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

                    await Promise.all([
                        new Promise((resolve) => (ahLogo.onload = resolve)),
                        new Promise((resolve) => (jumboLogo.onload = resolve)),
                    ]);

                    map.current.addImage('ahLogo', ahLogo);
                    map.current.addImage('jumboLogo', jumboLogo);

                    // Fetch store data from the API
                    const response = await fetch('/api/stores');
                    const data = await response.json();

                    console.log('Stores:', data);

                    // Log each store's properties to check the data structure
                    data.features.forEach(feature => {
                        console.log('Store ID:', feature.properties.id, 'Branch:', feature.properties.supermarktBranch);
                        // Ensure 'supermarktBranch' is at least an empty string if undefined
                        feature.properties.supermarktBranch = feature.properties.supermarktBranch || 'unknown';
                    });

                    // Add the GeoJSON source for the stores
                    map.current.addSource('stores', {
                        type: 'geojson',
                        data: data,
                    });

                    // Add a layer for Albert Heijn stores
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

                    // Add a layer for Jumbo stores
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

                    // Add a layer for stores with unknown or undefined branch
                    map.current.addLayer({
                        id: 'unknown-stores',
                        type: 'symbol',
                        source: 'stores',
                        layout: {
                            'icon-image': 'defaultLogo', // Add a default logo if desired
                            'icon-size': 0.12,
                            'icon-anchor': 'bottom',
                        },
                        filter: ['==', ['get', 'supermarktBranch'], null]
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
