import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { geoCentroid } from "d3-geo";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Manual abbreviations for map clarity
const abbreviations = {
    "United States of America": "USA",
    "United Kingdom": "UK",
    "United Arab Emirates": "UAE",
    "Central African Republic": "CAR",
    "Democratic Republic of the Congo": "DRC",
    "Russian Federation": "Russia",
    "Dominican Republic": "DR",
    "South Sudan": "S. Sudan",
    "Papua New Guinea": "PNG",
    "South Africa": "RSA",
    "Saudi Arabia": "KSA",
    "South Korea": "ROK",
    "North Korea": "DPRK",
    "Switzerland": "SUI",
    "Netherlands": "NED",
    "Philippines": "PH",
    "New Zealand": "NZ",
    "Congo": "COG",
};

const WorldMap = ({ onCountryClick, countryStats = {} }) => {
    const [content, setContent] = useState("");

    const colors = {
        unvisited: "#D6D3D1",
        bronze: "#B45309", // Amber-700
        silver: "#BCC6CC", // Metallic Silver
        gold: "#EAB308",   // Yellow-500
    };

    return (
        <div className="w-full h-full bg-stone-100 relative overflow-hidden rounded-xl border border-stone-200 shadow-inner">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
                <ZoomableGroup center={[0, 20]} zoom={1} maxZoom={4}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const name = geo.properties.name;
                                const stats = countryStats[name];
                                const regionCount = stats ? stats.regions.size : 0;

                                let fillColor = colors.unvisited;
                                if (regionCount >= 3) fillColor = colors.gold;
                                else if (regionCount === 2) fillColor = colors.silver;
                                else if (regionCount === 1) fillColor = colors.bronze;

                                const centroid = geoCentroid(geo);
                                const label = abbreviations[name] || name.substring(0, 3).toUpperCase();

                                return (
                                    <React.Fragment key={geo.rsmKey}>
                                        <Geography
                                            geography={geo}
                                            onMouseEnter={() => {
                                                setContent(`${name}${regionCount > 0 ? ` (${regionCount} regions)` : ""}`);
                                            }}
                                            onMouseLeave={() => {
                                                setContent("");
                                            }}
                                            onClick={() => onCountryClick(name)}
                                            style={{
                                                default: {
                                                    fill: fillColor,
                                                    outline: "none",
                                                    transition: "all 0.3s ease"
                                                },
                                                hover: {
                                                    fill: regionCount > 0 ? fillColor : "#A8A29E",
                                                    outline: "none",
                                                    cursor: "pointer"
                                                },
                                                pressed: {
                                                    fill: "#78716C",
                                                    outline: "none"
                                                },
                                            }}
                                        />
                                        <Marker coordinates={centroid}>
                                            <text
                                                y="2"
                                                fontSize={3}
                                                textAnchor="middle"
                                                fill="#44403C"
                                                className="pointer-events-none opacity-50 font-semibold uppercase tracking-wider"
                                            >
                                                {label}
                                            </text>
                                        </Marker>
                                    </React.Fragment>
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
            <Tooltip id="my-tooltip" content={content} />

            {/* Helper text overlay */}
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-stone-500 shadow-sm pointer-events-none">
                Tap a country to start
            </div>
        </div>
    );
};

export default WorldMap;
