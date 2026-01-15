'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { ITerritoryInfo } from '@/lib/territory';

// Mapping from ISO 3166-1 numeric codes to alpha-2 codes
const numericToAlpha2: Record<string, string> = {
  '004': 'af',
  '008': 'al',
  '012': 'dz',
  '016': 'as',
  '020': 'ad',
  '024': 'ao',
  '028': 'ag',
  '031': 'az',
  '032': 'ar',
  '036': 'au',
  '040': 'at',
  '044': 'bs',
  '048': 'bh',
  '050': 'bd',
  '051': 'am',
  '052': 'bb',
  '056': 'be',
  '060': 'bm',
  '064': 'bt',
  '068': 'bo',
  '070': 'ba',
  '072': 'bw',
  '076': 'br',
  '084': 'bz',
  '090': 'sb',
  '092': 'vg',
  '096': 'bn',
  '100': 'bg',
  '104': 'mm',
  '108': 'bi',
  '112': 'by',
  '116': 'kh',
  '120': 'cm',
  '124': 'ca',
  '132': 'cv',
  '140': 'cf',
  '144': 'lk',
  '148': 'td',
  '152': 'cl',
  '156': 'cn',
  '158': 'tw',
  '162': 'cx',
  '170': 'co',
  '174': 'km',
  '175': 'yt',
  '178': 'cg',
  '180': 'cd',
  '184': 'ck',
  '188': 'cr',
  '191': 'hr',
  '192': 'cu',
  '196': 'cy',
  '203': 'cz',
  '204': 'bj',
  '208': 'dk',
  '212': 'dm',
  '214': 'do',
  '218': 'ec',
  '222': 'sv',
  '226': 'gq',
  '231': 'et',
  '232': 'er',
  '233': 'ee',
  '234': 'fo',
  '238': 'fk',
  '242': 'fj',
  '246': 'fi',
  '248': 'ax',
  '250': 'fr',
  '254': 'gf',
  '258': 'pf',
  '262': 'dj',
  '266': 'ga',
  '268': 'ge',
  '270': 'gm',
  '275': 'ps',
  '276': 'de',
  '288': 'gh',
  '292': 'gi',
  '296': 'ki',
  '300': 'gr',
  '304': 'gl',
  '308': 'gd',
  '312': 'gp',
  '316': 'gu',
  '320': 'gt',
  '324': 'gn',
  '328': 'gy',
  '332': 'ht',
  '336': 'va',
  '340': 'hn',
  '344': 'hk',
  '348': 'hu',
  '352': 'is',
  '356': 'in',
  '360': 'id',
  '364': 'ir',
  '368': 'iq',
  '372': 'ie',
  '376': 'il',
  '380': 'it',
  '384': 'ci',
  '388': 'jm',
  '392': 'jp',
  '398': 'kz',
  '400': 'jo',
  '404': 'ke',
  '408': 'kp',
  '410': 'kr',
  '414': 'kw',
  '417': 'kg',
  '418': 'la',
  '422': 'lb',
  '426': 'ls',
  '428': 'lv',
  '430': 'lr',
  '434': 'ly',
  '438': 'li',
  '440': 'lt',
  '442': 'lu',
  '446': 'mo',
  '450': 'mg',
  '454': 'mw',
  '458': 'my',
  '462': 'mv',
  '466': 'ml',
  '470': 'mt',
  '474': 'mq',
  '478': 'mr',
  '480': 'mu',
  '484': 'mx',
  '492': 'mc',
  '496': 'mn',
  '498': 'md',
  '499': 'me',
  '500': 'ms',
  '504': 'ma',
  '508': 'mz',
  '512': 'om',
  '516': 'na',
  '520': 'nr',
  '524': 'np',
  '528': 'nl',
  '531': 'cw',
  '533': 'aw',
  '534': 'sx',
  '540': 'nc',
  '548': 'vu',
  '554': 'nz',
  '558': 'ni',
  '562': 'ne',
  '566': 'ng',
  '570': 'nu',
  '574': 'nf',
  '578': 'no',
  '580': 'mp',
  '583': 'fm',
  '584': 'mh',
  '585': 'pw',
  '586': 'pk',
  '591': 'pa',
  '598': 'pg',
  '600': 'py',
  '604': 'pe',
  '608': 'ph',
  '612': 'pn',
  '616': 'pl',
  '620': 'pt',
  '624': 'gw',
  '626': 'tl',
  '630': 'pr',
  '634': 'qa',
  '638': 're',
  '642': 'ro',
  '643': 'ru',
  '646': 'rw',
  '654': 'sh',
  '659': 'kn',
  '660': 'ai',
  '662': 'lc',
  '663': 'mf',
  '666': 'pm',
  '670': 'vc',
  '674': 'sm',
  '678': 'st',
  '682': 'sa',
  '686': 'sn',
  '688': 'rs',
  '690': 'sc',
  '694': 'sl',
  '702': 'sg',
  '703': 'sk',
  '704': 'vn',
  '705': 'si',
  '706': 'so',
  '710': 'za',
  '716': 'zw',
  '724': 'es',
  '728': 'ss',
  '729': 'sd',
  '732': 'eh',
  '740': 'sr',
  '744': 'sj',
  '748': 'sz',
  '752': 'se',
  '756': 'ch',
  '760': 'sy',
  '762': 'tj',
  '764': 'th',
  '768': 'tg',
  '772': 'tk',
  '776': 'to',
  '780': 'tt',
  '784': 'ae',
  '788': 'tn',
  '792': 'tr',
  '795': 'tm',
  '796': 'tc',
  '798': 'tv',
  '800': 'ug',
  '804': 'ua',
  '807': 'mk',
  '818': 'eg',
  '826': 'gb',
  '831': 'gg',
  '832': 'je',
  '833': 'im',
  '834': 'tz',
  '840': 'us',
  '850': 'vi',
  '854': 'bf',
  '858': 'uy',
  '860': 'uz',
  '862': 've',
  '876': 'wf',
  '882': 'ws',
  '887': 'ye',
  '894': 'zm',
  // Special cases
  '-99': 'xk', // Kosovo
};

export type CountryData = {
  code: string;
  label: string;
  numPeps: number;
  numPositions: number;
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 500;

interface WorldMapProps {
  countryDataArray: [string, CountryData][];
  focusTerritory?: ITerritoryInfo;
}

interface CountryFeature extends Feature<Geometry> {
  id: string;
  properties: {
    name: string;
  };
}

interface WorldTopology extends Topology {
  objects: {
    countries: GeometryCollection;
  };
}

export default function WorldMap({
  countryDataArray,
  focusTerritory,
}: WorldMapProps) {
  const focusCountry = focusTerritory?.code;
  const flagUrl = focusTerritory?.flag
    ? `/assets/${focusTerritory.flag}/?w=500&format=auto`
    : undefined;
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(
    null,
  );
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const countryData = useMemo(
    () => new Map(countryDataArray),
    [countryDataArray],
  );

  const hoveredCountry = useMemo(() => {
    return hoveredCountryCode ? countryData.get(hoveredCountryCode) : null;
  }, [hoveredCountryCode, countryData]);

  // Load TopoJSON data
  useEffect(() => {
    fetch('/data/countries-110m.json')
      .then((response) => response.json())
      .then((topology: WorldTopology) => {
        const countries = feature(
          topology,
          topology.objects.countries,
        ) as FeatureCollection;
        setGeoData(countries);
      });
  }, []);

  // Filter out Antarctica and create projection
  const { features, pathGenerator, focusFeature } = useMemo(() => {
    if (!geoData)
      return { features: null, pathGenerator: null, focusFeature: null };

    const filtered = geoData.features.filter((f) => f.id !== '010');

    // If focusing on a country, fit projection to that country
    if (focusCountry) {
      const foundFeature = filtered.find(
        (f) => numericToAlpha2[f.id as string] === focusCountry,
      );

      if (foundFeature) {
        const focusCollection = { ...geoData, features: [foundFeature] };
        const paddingY = 0.3;
        const paddingLeft = 0.5;
        const paddingRight = 0.1;
        const padY = VIEWBOX_HEIGHT * paddingY;
        const proj = geoNaturalEarth1().fitExtent(
          [
            [VIEWBOX_WIDTH * paddingLeft, padY],
            [VIEWBOX_WIDTH * (1 - paddingRight), VIEWBOX_HEIGHT - padY],
          ],
          focusCollection,
        );

        return {
          features: filtered,
          pathGenerator: geoPath().projection(proj),
          focusFeature: foundFeature,
        };
      }
    }

    // Default: show entire world
    const filteredCollection = { ...geoData, features: filtered };
    const proj = geoNaturalEarth1().fitSize(
      [VIEWBOX_WIDTH, VIEWBOX_HEIGHT],
      filteredCollection,
    );

    return {
      features: filtered,
      pathGenerator: geoPath().projection(proj),
      focusFeature: null,
    };
  }, [geoData, focusCountry]);

  // Calculate bounding box of focus country for flag pattern
  const focusBounds = useMemo(() => {
    if (!focusFeature || !pathGenerator) return null;
    const bounds = pathGenerator.bounds(focusFeature);
    return {
      x: bounds[0][0],
      y: bounds[0][1],
      width: bounds[1][0] - bounds[0][0],
      height: bounds[1][1] - bounds[0][1],
    };
  }, [focusFeature, pathGenerator]);

  const maxPositions = useMemo(
    () =>
      Math.max(...Array.from(countryData.values()).map((d) => d.numPositions)),
    [countryData],
  );

  const getCountryColor = (numericId: string) => {
    const alpha2 = numericToAlpha2[numericId];
    if (!alpha2) return '#e5e7eb';

    const data = countryData.get(alpha2);
    if (!data || data.numPositions === 0) return '#e5e7eb';

    const intensity =
      Math.log(data.numPositions + 1) / Math.log(maxPositions + 1);

    return `hsl(220, ${70 + intensity * 20}%, ${75 - intensity * 40}%)`;
  };

  const handleClick = (e: React.MouseEvent) => {
    const code = e.currentTarget.getAttribute('data-country');
    if (code) router.push(`/countries/${code}/national/`);
  };

  if (!features || !pathGenerator) {
    return (
      <div className="world-map-container">
        <div className="world-map-loading">Loading map...</div>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const showTooltipLeft =
    tooltipRef.current &&
    mousePos.x + tooltipRef.current.offsetWidth + 20 > window.innerWidth;

  return (
    <div className="world-map-container" onMouseMove={handleMouseMove}>
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="world-map"
      >
        {flagUrl && focusFeature && pathGenerator && (
          <defs>
            <clipPath id="country-clip">
              <path d={pathGenerator(focusFeature) || ''} />
            </clipPath>
          </defs>
        )}
        <g>
          {features.map((feature) => {
            const countryFeature = feature as CountryFeature;
            const numericId = countryFeature.id;
            const alpha2 = numericToAlpha2[numericId];
            const hasData = alpha2 && countryData.has(alpha2);

            const fill = getCountryColor(numericId);

            return (
              <path
                key={numericId}
                data-country={alpha2}
                d={pathGenerator(countryFeature) || ''}
                fill={fill}
                stroke="#fff"
                strokeWidth={0.5}
                className={hasData ? 'country-path clickable' : 'country-path'}
                onMouseEnter={
                  hasData ? () => setHoveredCountryCode(alpha2) : undefined
                }
                onMouseLeave={
                  hasData ? () => setHoveredCountryCode(null) : undefined
                }
                onClick={hasData ? handleClick : undefined}
              />
            );
          })}
        </g>
        {flagUrl && focusBounds && (
          <foreignObject
            x={focusBounds.x}
            y={focusBounds.y}
            width={focusBounds.width}
            height={focusBounds.height}
            clipPath="url(#country-clip)"
          >
            <img
              src={flagUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </foreignObject>
        )}
      </svg>
      {hoveredCountry && (
        <div
          ref={tooltipRef}
          className={`tooltip ${showTooltipLeft ? 'bs-tooltip-start' : 'bs-tooltip-end'} show`}
          role="tooltip"
          style={{
            position: 'fixed',
            left: showTooltipLeft ? mousePos.x - 12 : mousePos.x + 12,
            top: mousePos.y,
            pointerEvents: 'none',
            transform: showTooltipLeft
              ? 'translate(-100%, -50%)'
              : 'translateY(-50%)',
          }}
        >
          <div className="tooltip-inner">
            <strong>{hoveredCountry.label}</strong>
            <div className="tooltip-stats">
              <span>
                {hoveredCountry.numPositions.toLocaleString()} positions
              </span>
              <span>{hoveredCountry.numPeps.toLocaleString()} PEPs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
