'use client';
import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

const MapContainer = ({ onStoreHover, onStoreClick }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const amsterdam = { lng: 4.9041, lat: 52.3676 };
    const zoom = 14;

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
                    const image = new Image();
                    image.src = '/images/ah-logo.png';

                    image.onload = () => {
                        map.current.addImage('ahLogo', image);

                        fetch('/api/stores')
                            .then(response => response.json())
                            .then(data => {
                                map.current.addSource('stores', {
                                    type: 'geojson',
                                    data: data,
                                });

                                map.current.addLayer({
                                    id: 'store-status',
                                    type: 'circle',
                                    source: 'stores',
                                    paint: {
                                        'circle-color': [
                                            'case',
                                            ['==', ['get', 'machineWorking'], 1],
                                            '#00FF00',
                                            ['==', ['get', 'machineWorking'], 0],
                                            '#FF0000',
                                            '#808080',
                                        ],
                                        'circle-radius': 8,
                                    },
                                });

                                map.current.addLayer({
                                    id: 'stores',
                                    type: 'symbol',
                                    source: 'stores',
                                    layout: {
                                        'icon-image': 'ahLogo',
                                        'icon-size': 0.12,
                                        'icon-anchor': 'bottom',
                                    },
                                });

                                map.current.on('mouseenter', 'stores', (e) => {
                                    map.current.getCanvas().style.cursor = 'pointer';
                                    const coordinates = e.features[0].geometry.coordinates.slice();
                                    const pos = map.current.project(coordinates);
                                    onStoreHover(e.features[0].properties, pos);
                                });

                                map.current.on('mouseleave', 'stores', () => {
                                    map.current.getCanvas().style.cursor = '';
                                    onStoreHover(null);
                                });

                                map.current.on('click', 'stores', (e) => {
                                    const id = e.features[0].properties.id;
                                    onStoreClick(id);
                                });
                            })
                            .catch(error => console.error("Error fetching or adding data:", error));
                    };

                    image.onerror = () => {
                        throw new Error('Failed to load the image');
                    };
                } catch (error) {
                    console.error("Error loading the map or adding resources:", error);
                }
            });
        }
    }, [amsterdam.lng, amsterdam.lat, zoom, onStoreHover, onStoreClick]);

    return <div ref={mapContainer} className="w-full h-screen" />;
};

export default MapContainer;
