'use client';
import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

const MapContainer = ({ onStoreHover, onStoreClick }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const amsterdam = { lng: 5.2913, lat: 52.1326 };
    const zoom = 8;

    useEffect(() => {
        if (map.current) return;

        if (mapContainer.current) {
            maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAP_TILE_API_KEY;

            map.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.STREETS,
                center: [amsterdam.lng, amsterdam.lat],
                zoom: zoom,
            });

            map.current.on('load', async () => {
                try {
                    const logos = {
                        ahLogo: '/images/ah-logo.png',
                        jumboLogo: '/images/jumbo-logo.png',
                        dirkLogo: '/images/dirk-logo.png',
                        dekaLogo: '/images/deka-logo.png',
                    };

                    for (const [key, src] of Object.entries(logos)) {
                        const img = new Image();
                        img.src = src;
                        await new Promise((resolve) => (img.onload = resolve));
                        map.current.addImage(key, img);
                    }

                    const response = await fetch('/api/stores');
                    const data = await response.json();

                    data.features.forEach(feature => {
                        feature.properties.supermarktBranch = feature.properties.supermarktBranch || 'unknown';
                    });

                    map.current.addSource('stores', {
                        type: 'geojson',
                        data: data,
                    });

                    map.current.addLayer({
                        id: 'machine-status',
                        type: 'circle',
                        source: 'stores',
                        paint: {
                            'circle-color': [
                                'case',
                                ['==', ['get', 'machineWorking'], 1],
                                '#00FF00', // Green for working
                                ['==', ['get', 'machineWorking'], 0],
                                '#FF0000', // Red for broken
                                '#808080'  // Gray for unknown/not reported
                            ],
                            'circle-radius': 8,
                        },
                    });

                    const layers = [
                        { id: 'ah-stores', branch: 'albertheijn', logo: 'ahLogo' },
                        { id: 'jumbo-stores', branch: 'jumbo', logo: 'jumboLogo' },
                        { id: 'dirk-stores', branch: 'dirk', logo: 'dirkLogo' },
                        { id: 'deka-stores', branch: 'deka', logo: 'dekaLogo' },
                    ];

                    layers.forEach(layer => {
                        map.current.addLayer({
                            id: layer.id,
                            type: 'symbol',
                            source: 'stores',
                            layout: {
                                'icon-image': layer.logo,
                                'icon-size': 0.12,
                                'icon-anchor': 'bottom',
                            },
                            filter: ['==', ['get', 'supermarktBranch'], layer.branch]
                        });
                    });

                    const handleMouseEvents = (event, callback, reset = false) => {
                        layers.forEach(layer => {
                            map.current.on(event, layer.id, (e) => {
                                if (e.features && e.features.length > 0) {
                                    const feature = e.features[0];
                                    callback(feature.properties, { x: e.point.x, y: e.point.y });
                                } else if (reset) {
                                    callback(null, { x: 0, y: 0 });
                                }
                            });
                        });
                    };

                    handleMouseEvents('mouseenter', (props, coords) => {
                        map.current.getCanvas().style.cursor = 'pointer';
                        onStoreHover(props, coords);
                    });

                    handleMouseEvents('mouseleave', () => {
                        map.current.getCanvas().style.cursor = '';
                        onStoreHover(null, { x: 0, y: 0 });
                    }, true);

                    handleMouseEvents('mousemove', (props, coords) => {
                        onStoreHover(props, coords);
                    });

                    handleMouseEvents('click', (props) => {
                        onStoreClick(props.id);
                    });

                } catch (error) {
                    console.error("Error loading the map or adding resources:", error);
                }
            });
        }
    }, [amsterdam.lng, amsterdam.lat, zoom, onStoreHover, onStoreClick]);

    return <div ref={mapContainer} className="w-full h-screen" />;
};

export default MapContainer;
