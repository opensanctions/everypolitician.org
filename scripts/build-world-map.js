const fs = require('fs');
const path = require('path');
const https = require('https');

const NATURAL_EARTH_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';
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

async function main() {
  const topojsonServer = await import('topojson-server');

  const geojsonText = await fetch(NATURAL_EARTH_URL);
  const geojson = JSON.parse(geojsonText);

  // Keep only the properties we need and use ISO_A2 as feature ID
  // Natural Earth uses -99 for disputed/special territories, fall back to ISO_A2_EH
  geojson.features = geojson.features.map((feature) => {
    const props = feature.properties;
    const iso2 =
      props.ISO_A2 !== '-99' ? props.ISO_A2 : props.ISO_A2_EH || props.ISO_N3;
    return {
      ...feature,
      id: iso2?.toLowerCase(),
      properties: {
        name: props.NAME,
      },
    };
  });

  // Convert to TopoJSON (quantize reduces coordinate precision for smaller file)
  const topology = topojsonServer.topology({ countries: geojson }, 1e4);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(topology));

  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`Written: ${OUTPUT_PATH} (${(stats.size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
