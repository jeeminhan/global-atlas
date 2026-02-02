import React, { useState, useEffect, useRef, useCallback } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { geoCentroid } from "d3-geo";
import { Plus, Minus } from "lucide-react";

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
    // Lazy init position to set distinct initial center for mobile vs desktop
    const [position, setPosition] = useState(() => {
        const isMobileInit = typeof window !== 'undefined' && window.innerWidth < 768;
        return { coordinates: isMobileInit ? [0, 30] : [0, 20], zoom: isMobileInit ? 1.5 : 1 };
    });

    // Track dimensions to ensure map fills container
    const [dimensions, setDimensions] = useState(() => ({
        width: typeof window !== 'undefined' ? window.innerWidth : 800,
        height: typeof window !== 'undefined' ? window.innerHeight : 600
    }));

    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef(null);
    const lastPinchDistance = useRef(null);

    // Update dimensions and mobile status via ResizeObserver
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Initial measure
        setDimensions({ width: container.offsetWidth, height: container.offsetHeight });
        setIsMobile(container.offsetWidth < 768);

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
                setIsMobile(width < 768);
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    // Pinch-to-zoom touch handlers for mobile
    const getDistance = useCallback((touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Touch events for mobile pinch
        const handleTouchStart = (e) => {
            if (e.touches.length === 2) {
                lastPinchDistance.current = getDistance(e.touches);
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 2 && lastPinchDistance.current !== null) {
                e.preventDefault();
                const newDistance = getDistance(e.touches);
                const scale = newDistance / lastPinchDistance.current;

                setPosition(prev => ({
                    ...prev,
                    zoom: Math.max(1, Math.min(8, prev.zoom * scale))
                }));

                lastPinchDistance.current = newDistance;
            }
        };

        const handleTouchEnd = () => {
            lastPinchDistance.current = null;
        };

        // Wheel event for Mac trackpad pinch AND scroll wheel zoom
        const handleWheel = (e) => {
            e.preventDefault();

            // Mac trackpad pinch gestures have ctrlKey = true
            // Regular scroll wheel zooming
            const zoomSensitivity = e.ctrlKey ? 0.01 : 0.002;
            const delta = -e.deltaY * zoomSensitivity;

            setPosition(prev => ({
                ...prev,
                zoom: Math.max(1, Math.min(8, prev.zoom * (1 + delta)))
            }));
        };

        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
            container.removeEventListener('wheel', handleWheel);
        };
    }, [getDistance]);

    const colors = {
        unvisited: "#D6D3D1",
        bronze: "#B45309",
        silver: "#BCC6CC",
        gold: "#EAB308",
    };

    const currentZoom = position.zoom;

    // Calculate label visibility based on zoom
    const getLabelOpacity = (countryName) => {
        const isMajor = majorCountries.includes(countryName);

        if (currentZoom < 1.5) {
            return isMajor ? 0.4 : 0;
        }
        if (currentZoom < 2.5) {
            return isMajor ? 0.6 : 0.3;
        }
        return 0.7;
    };

    // Dynamic font size based on zoom
    const getLabelFontSize = () => {
        if (currentZoom < 1.5) return 4;
        if (currentZoom < 2.5) return 3.5;
        return 3;
    };

    // Handle zoom/pan end from gestures - with validation
    const handleMoveEnd = (newPosition) => {
        // Validate the position data before updating state
        if (newPosition &&
            typeof newPosition.zoom === 'number' &&
            !isNaN(newPosition.zoom) &&
            Array.isArray(newPosition.coordinates) &&
            newPosition.coordinates.length === 2 &&
            typeof newPosition.coordinates[0] === 'number' &&
            typeof newPosition.coordinates[1] === 'number') {
            setPosition({
                coordinates: newPosition.coordinates,
                zoom: Math.max(1, Math.min(8, newPosition.zoom))
            });
        }
    };

    // Zoom button handlers
    const handleZoomIn = () => {
        if (position.zoom < 8) {
            setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 8) }));
        }
    };

    const handleZoomOut = () => {
        if (position.zoom > 1) {
            setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }));
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full bg-stone-100 relative overflow-hidden rounded-xl border border-stone-200 shadow-inner"
            style={{ touchAction: 'none' }}
        >
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 100 }}
                width={dimensions.width}
                height={dimensions.height}
            >
                <ZoomableGroup
                    center={position.coordinates}
                    zoom={position.zoom}
                    maxZoom={8}
                    minZoom={1}
                    disableZooming
                    onMoveEnd={handleMoveEnd}
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

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-md flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 transition-colors active:scale-95"
                    aria-label="Zoom In"
                >
                    <Plus size={20} />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 bg-white/90 backdrop-blur rounded-full shadow-md flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 transition-colors active:scale-95"
                    aria-label="Zoom Out"
                >
                    <Minus size={20} />
                </button>
            </div>

            {/* Helper text overlay */}
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-stone-500 shadow-sm pointer-events-none">
                {isMobile ? "Pinch to zoom • Tap a country" : "Scroll or use buttons to zoom"}
            </div>

            {/* Zoom indicator */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-stone-400 shadow-sm pointer-events-none">
                {currentZoom.toFixed(1)}x
            </div>
        </div>
    );
};

export default WorldMap;


