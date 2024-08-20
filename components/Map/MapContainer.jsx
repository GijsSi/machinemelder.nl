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
        if (map.current) return; // Prevent reinitialization

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
                    // Load logos
                    const ahLogo = new Image();
                    ahLogo.src = '/images/ah-logo.png';
                    const jumboLogo = new Image();
                    jumboLogo.src = '/images/jumbo-logo.png';
                    const dirkLogo = new Image();
                    dirkLogo.src = '/images/dirk-logo.png';

                    await Promise.all([
                        new Promise((resolve) => (ahLogo.onload = resolve)),
                        new Promise((resolve) => (jumboLogo.onload = resolve)),
                    ]);

                    map.current.addImage('ahLogo', ahLogo);
                    map.current.addImage('jumboLogo', jumboLogo);
                    map.current.addImage('dirkLogo', dirkLogo);


                    // Fetch store data from the API
                    const response = await fetch('/api/stores');
                    const data = await response.json();

                    console.log('Stores:', data);

                    // Ensure 'supermarktBranch' is at least an empty string if undefined
                    data.features.forEach(feature => {
                        console.log('Store ID:', feature.properties.id, 'Branch:', feature.properties.supermarktBranch);
                        feature.properties.supermarktBranch = feature.properties.supermarktBranch || 'unknown';
                    });

                    // Add the GeoJSON source for the stores
                    map.current.addSource('stores', {
                        type: 'geojson',
                        data: data,
                    });

                    // Add a layer for machine status (circle)
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

                    // Add layers for different supermarket branches
                    map.current.addLayer({
                        id: 'ah-stores',
                        type: 'symbol',
                        source: 'stores',
                        layout: {
                            'icon-image': 'ahLogo',
                            'icon-size': 0.12,
                            'icon-anchor': 'bottom',
                        },
                        filter: ['==', ['get', 'supermarktBranch'], 'albertheijn']
                    });

                    map.current.addLayer({
                        id: 'jumbo-stores',
                        type: 'symbol',
                        source: 'stores',
                        layout: {
                            'icon-image': 'jumboLogo',
                            'icon-size': 0.12,
                            'icon-anchor': 'bottom',
                        },
                        filter: ['==', ['get', 'supermarktBranch'], 'jumbo']
                    });

                    map.current.addLayer({
                        id: 'dirk-stores',
                        type: 'symbol',
                        source: 'stores',
                        layout: {
                            'icon-image': 'dirkLogo',
                            'icon-size': 0.50,
                            'icon-anchor': 'bottom',
                        },
                        filter: ['==', ['get', 'supermarktBranch'], 'dirk']
                    });


                    map.current.addLayer({
                        id: 'unknown-stores',
                        type: 'symbol',
                        source: 'stores',
                        layout: {
                            'icon-image': 'defaultLogo',
                            'icon-size': 0.12,
                            'icon-anchor': 'bottom',
                        },
                        filter: ['==', ['get', 'supermarktBranch'], 'unknown']
                    });

                    // Hover functionality
                    map.current.on('mouseenter', 'ah-stores', (e) => {
                        if (e.features.length > 0) {
                            map.current.getCanvas().style.cursor = 'pointer';
                            const feature = e.features[0];
                            onStoreHover(feature.properties, { x: e.point.x, y: e.point.y });
                        }
                    });

                    map.current.on('mouseenter', 'jumbo-stores', (e) => {
                        if (e.features.length > 0) {
                            map.current.getCanvas().style.cursor = 'pointer';
                            const feature = e.features[0];
                            onStoreHover(feature.properties, { x: e.point.x, y: e.point.y });
                        }
                    });

                    map.current.on('mouseenter', 'dirk-stores', (e) => {
                        if (e.features.length > 0) {
                            map.current.getCanvas().style.cursor = 'pointer';
                            const feature = e.features[0];
                            onStoreHover(feature.properties, { x: e.point.x, y: e.point.y });
                        }
                    });

                    map.current.on('mouseleave', 'ah-stores', () => {
                        map.current.getCanvas().style.cursor = '';
                        onStoreHover(null, { x: 0, y: 0 });
                    });

                    map.current.on('mouseleave', 'jumbo-stores', () => {
                        map.current.getCanvas().style.cursor = '';
                        onStoreHover(null, { x: 0, y: 0 });
                    });

                    map.current.on('mousemove', 'ah-stores', (e) => {
                        if (e.features.length > 0) {
                            onStoreHover(e.features[0].properties, { x: e.point.x, y: e.point.y });
                        }
                    });

                    map.current.on('mousemove', 'jumbo-stores', (e) => {
                        if (e.features.length > 0) {
                            onStoreHover(e.features[0].properties, { x: e.point.x, y: e.point.y });
                        }
                    });

                    map.current.on('mousemove', 'dirk-stores', (e) => {
                        if (e.features.length > 0) {
                            onStoreHover(e.features[0].properties, { x: e.point.x, y: e.point.y });
                        }
                    });

                    map.current.on('click', 'ah-stores', (e) => {
                        if (e.features.length > 0) {
                            const feature = e.features[0];
                            console.log("Store Clicked: ", feature.properties.id); // Debug log
                            onStoreClick(feature.properties.id);
                        }
                    });

                    map.current.on('click', 'jumbo-stores', (e) => {
                        if (e.features.length > 0) {
                            const feature = e.features[0];
                            console.log("Store Clicked: ", feature.properties.id); // Debug log
                            onStoreClick(feature.properties.id);
                        }
                    });

                    map.current.on('click', 'dirk-stores', (e) => {
                        if (e.features.length > 0) {
                            const feature = e.features[0];
                            console.log("Store Clicked: ", feature.properties.id); // Debug log
                            onStoreClick(feature.properties.id);
                        }
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
