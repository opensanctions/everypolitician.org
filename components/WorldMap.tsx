'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { TerritoryInfo } from '@/lib/territory';
import { HelpLink } from '@/components/HelpLink';

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
  focusTerritory?: TerritoryInfo;
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

    const filtered = geoData.features.filter((f) => f.id !== 'aq');

    // If focusing on a country, fit projection to that country
    if (focusCountry) {
      const foundFeature = filtered.find((f) => f.id === focusCountry);

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

  const getCountryColor = (alpha2: string) => {
    const data = countryData.get(alpha2);
    if (!data || data.numPositions === 0) return '#e5e7eb';

    const intensity =
      Math.log(data.numPositions + 1) / Math.log(maxPositions + 1);

    return `hsl(220, ${70 + intensity * 20}%, ${75 - intensity * 40}%)`;
  };

  const handleClick = (e: React.MouseEvent) => {
    const code = e.currentTarget.getAttribute('data-country');
    if (code) router.push(`/territories/${code}/national/`);
  };

  if (!features || !pathGenerator) {
    return null;
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
            const alpha2 = countryFeature.id;
            const hasData = countryData.has(alpha2);

            const fill = getCountryColor(alpha2);

            return (
              <path
                key={alpha2}
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
              <span>{hoveredCountry.numPeps.toLocaleString()} politicians</span>
            </div>
          </div>
        </div>
      )}
      <div
        className="position-absolute bottom-0 end-0 p-2 small text-white"
        style={{ backgroundColor: '#0040c1', zIndex: 2, pointerEvents: 'auto' }}
      >
        Standard political map.{' '}
        <HelpLink
          href="/docs/mapping/"
          tooltipId="map-disclaimer-help"
          tooltip="Maps are political. Not everyone agrees on borders and who controls what."
        >
          Reality is more complicated.
        </HelpLink>
      </div>
    </div>
  );
}
