import React, { useState, useEffect } from "react";
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

// Large countries that show labels at low zoom
const majorCountries = [
    "United States of America", "Russia", "Canada", "China", "Brazil",
    "Australia", "India", "Argentina", "Kazakhstan", "Algeria",
    "Democratic Republic of the Congo", "Saudi Arabia", "Mexico", "Indonesia",
    "Sudan", "Libya", "Iran", "Mongolia", "Peru", "Chad", "Niger", "Angola",
    "Mali", "South Africa", "Colombia", "Ethiopia", "Bolivia", "Mauritania",
    "Egypt", "Tanzania", "Nigeria", "Pakistan", "Namibia", "Mozambique",
    "Venezuela", "Zambia", "Turkey", "Myanmar", "Afghanistan", "Somalia"
];

const WorldMap = ({ onCountryClick, countryStats = {} }) => {
    const [content, setContent] = useState("");
    const [currentZoom, setCurrentZoom] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile on mount
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const colors = {
        unvisited: "#D6D3D1",
        bronze: "#B45309",
        silver: "#BCC6CC",
        gold: "#EAB308",
    };

    // Adaptive initial zoom: mobile starts more zoomed in
    const initialZoom = isMobile ? 1.8 : 1;
    const initialCenter = isMobile ? [0, 30] : [0, 20];

    // Calculate label visibility based on zoom
    const getLabelOpacity = (countryName) => {
        const isMajor = majorCountries.includes(countryName);

        // At zoom 1-1.5: only major countries visible
        if (currentZoom < 1.5) {
            return isMajor ? 0.4 : 0;
        }
        // At zoom 1.5-2.5: major countries clear, others fading in
        if (currentZoom < 2.5) {
            return isMajor ? 0.6 : 0.3;
        }
        // At zoom 2.5+: all labels visible
        return 0.7;
    };

    // Dynamic font size based on zoom
    const getLabelFontSize = () => {
        if (currentZoom < 1.5) return 4;
        if (currentZoom < 2.5) return 3.5;
        return 3;
    };

    return (
        <div className="w-full h-full bg-stone-100 relative overflow-hidden rounded-xl border border-stone-200 shadow-inner">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
                <ZoomableGroup
                    center={initialCenter}
                    zoom={initialZoom}
                    maxZoom={8}
                    onMoveEnd={({ zoom }) => setCurrentZoom(zoom)}
                >
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
                                const labelOpacity = getLabelOpacity(name);

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
                                        {labelOpacity > 0 && (
                                            <Marker coordinates={centroid}>
                                                <text
                                                    y="2"
                                                    fontSize={getLabelFontSize()}
                                                    textAnchor="middle"
                                                    fill="#44403C"
                                                    style={{
                                                        opacity: labelOpacity,
                                                        transition: "opacity 0.3s ease",
                                                        pointerEvents: "none",
                                                        fontWeight: 600,
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.05em"
                                                    }}
                                                >
                                                    {label}
                                                </text>
                                            </Marker>
                                        )}
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
                {isMobile ? "Pinch to zoom • Tap a country" : "Scroll to zoom • Click a country"}
            </div>

            {/* Zoom indicator */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-stone-400 shadow-sm pointer-events-none">
                {currentZoom.toFixed(1)}x
            </div>
        </div>
    );
};

export default WorldMap;

