const fs = require('fs');
const path = require('path');
const https = require('https');
const mapshaper = require('mapshaper');

const NATURAL_EARTH_ADMIN1_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson';

// Override country assignment for specific regions
const REGION_OVERRIDES = {
  Crimea: 'ua',
  Sevastopol: 'ua',
};

// Map Natural Earth ISO codes to EveryPolitician codes
const ISO_CODE_PATCHES = {
  'cn-tw': 'tw', // Taiwan
};

// Territories identified by admin name that need custom codes
const NAME_TO_ISO = {
  'N. Cyprus': 'cy-trnc',
  Somaliland: 'so-som',
};

const OUTPUT_PATH = path.resolve(
  __dirname,
  '..',
  'public',
  'data',
  'countries-110m.json',
);

function fetch(url) {
  return new Promise((resolve, reject) => {
    console.log(`Fetching: ${url}`);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks).toString()));
      response.on('error', reject);
    });
  });
}

function getCountryCode(props) {
  const regionName = props.name;

  // Check for region-specific overrides first
  if (REGION_OVERRIDES[regionName]) {
    return REGION_OVERRIDES[regionName];
  }

  // Get ISO code from properties
  let iso2 = props.iso_a2 !== '-99' ? props.iso_a2 : props.iso_a2_eh;
  iso2 = iso2?.toLowerCase();

  // Apply code patches
  if (iso2 && ISO_CODE_PATCHES[iso2]) {
    iso2 = ISO_CODE_PATCHES[iso2];
  }

  // Handle territories identified by admin name
  if (NAME_TO_ISO[props.admin]) {
    iso2 = NAME_TO_ISO[props.admin];
  }

  return iso2 || null;
}

async function main() {
  const admin1Text = await fetch(NATURAL_EARTH_ADMIN1_URL);
  const admin1 = JSON.parse(admin1Text);

  // Add country_code field to each feature for dissolving
  for (const feature of admin1.features) {
    feature.properties.country_code = getCountryCode(feature.properties);
    feature.properties.country_name = feature.properties.admin;
  }

  // Filter out features without a country code
  admin1.features = admin1.features.filter((f) => f.properties.country_code);

  console.log(`Processing ${admin1.features.length} regions`);

  // Use mapshaper to dissolve by country and simplify
  const input = { 'input.geojson': JSON.stringify(admin1) };

  const commands = `
    -i input.geojson
    -dissolve country_code copy-fields=country_name
    -simplify 3% keep-shapes
    -rename-fields name=country_name
    -o format=topojson quantization=1e4 output.json
  `;

  const output = await mapshaper.applyCommands(commands, input);
  const topojson = output['output.json'];

  // Parse and fix the topology object name
  const topology = JSON.parse(topojson);
  topology.objects.countries = topology.objects.input;
  delete topology.objects.input;

  // Set feature IDs from country_code
  for (const geom of topology.objects.countries.geometries) {
    geom.id = geom.properties.country_code;
    delete geom.properties.country_code;
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(topology));

  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`Written: ${OUTPUT_PATH} (${(stats.size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
