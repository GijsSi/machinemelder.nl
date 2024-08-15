// 'use client'
// import React, { useRef, useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // Import useRouter for navigation
// import * as maptilersdk from '@maptiler/sdk';
// import "@maptiler/sdk/dist/maptiler-sdk.css";
// import './map.css';

// export default function Map() {
//     const mapContainer = useRef(null);
//     const map = useRef(null);
//     const amsterdam = { lng: 4.9041, lat: 52.3676 };
//     const [zoom] = useState(14);
//     maptilersdk.config.apiKey = '4g1c0YAafWCgBYnEQNkl';
//     const router = useRouter(); // Initialize useRouter

//     useEffect(() => {
//         if (map.current) return; // Stops map from initializing more than once

//         // Initialize the map
//         map.current = new maptilersdk.Map({
//             container: mapContainer.current,
//             style: maptilersdk.MapStyle.STREETS,
//             center: [amsterdam.lng, amsterdam.lat],
//             zoom: zoom
//         });

//         // Handle map load event
//         map.current.on('load', async () => {
//             try {
//                 console.log('Loading image manually...');

//                 // Manually create an HTMLImageElement
//                 const image = new Image();
//                 image.src = '/images/ah-logo.png';

//                 image.onload = () => {
//                     map.current.addImage('ahLogo', image);

//                     // Fetch store data
//                     fetch('/api/stores')
//                         .then(response => {
//                             if (!response.ok) {
//                                 throw new Error(`HTTP error! status: ${response.status}`);
//                             }
//                             return response.json();
//                         })
//                         .then(data => {
//                             console.log('Data fetched:', data);
//                             if (!data || !data.features) {
//                                 throw new Error('Invalid GeoJSON data');
//                             }

//                             // Add a source for stores
//                             map.current.addSource('stores', {
//                                 type: 'geojson',
//                                 data: data,
//                             });

//                             // Add a layer to display the stores with the custom icon
//                             map.current.addLayer({
//                                 id: 'stores',
//                                 type: 'symbol',
//                                 source: 'stores',
//                                 layout: {
//                                     'icon-image': 'ahLogo',
//                                     'icon-size': 0.10,
//                                     'icon-anchor': 'bottom',
//                                 },
//                             });

//                             // Change cursor to pointer on hover
//                             map.current.on('mouseenter', 'stores', () => {
//                                 map.current.getCanvas().style.cursor = 'pointer';
//                             });

//                             // Revert cursor to default on leave
//                             map.current.on('mouseleave', 'stores', () => {
//                                 map.current.getCanvas().style.cursor = '';
//                             });

//                             // Handle click event to navigate to dynamic path
//                             map.current.on('click', 'stores', (e) => {
//                                 const id = e.features[0].properties.id; // Get the store id
//                                 router.push(`/winkels/${id}`); // Navigate to the dynamic route
//                             });
//                         })
//                         .catch(error => {
//                             console.error("Error fetching or adding data:", error);
//                         });
//                 };

//                 image.onerror = () => {
//                     throw new Error('Failed to load the image');
//                 };

//             } catch (error) {
//                 console.error("Error loading the map or adding resources:", error);
//             }
//         });

//     }, [amsterdam.lng, amsterdam.lat, zoom, router]);

//     return (
//         <div className="map-wrap">
//             <div ref={mapContainer} className="w-full h-full" />
//         </div>
//     );
// }

'use client'
import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

function StoreCard({ store, position }) {
    return (
        <div
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
            }}
            className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64"
        >
            <h3 className="text-lg font-semibold">{store.street}</h3>
            {/* <p className="text-sm text-gray-500">ID: {store.id}</p> */}
            <p className="text-sm text-gray-500">Laatste melding: Today - 20:22</p>

            <p className="flex items-center text-sm text-gray-500">
                Automaat status:
                <span className="ml-2 relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                </span>
            </p>
        </div>
    );
}

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const amsterdam = { lng: 4.9041, lat: 52.3676 };
    const [zoom] = useState(14);
    const router = useRouter();

    // State to track hovered store and its position
    const [hoveredStore, setHoveredStore] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (map.current) return; // Stops map from initializing more than once

        if (mapContainer.current) {
            // Set API key for MapTiler SDK
            maptilersdk.config.apiKey = '4g1c0YAafWCgBYnEQNkl'; // Your API key

            // Initialize the map
            map.current = new maptilersdk.Map({
                container: mapContainer.current,
                style: maptilersdk.MapStyle.STREETS,
                center: [amsterdam.lng, amsterdam.lat],
                zoom: zoom
            });

            // Handle map load event
            map.current.on('load', async () => {
                try {
                    console.log('Loading image manually...');

                    // Manually create an HTMLImageElement
                    const image = new Image();
                    image.src = '/images/ah-logo.png';

                    image.onload = () => {
                        map.current.addImage('ahLogo', image);

                        // Fetch store data
                        fetch('/api/stores')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log('Data fetched:', data);
                                if (!data || !data.features) {
                                    throw new Error('Invalid GeoJSON data');
                                }

                                // Log each feature to check properties
                                data.features.forEach(feature => {
                                    console.log('Feature:', feature);
                                });

                                // Add a source for stores
                                map.current.addSource('stores', {
                                    type: 'geojson',
                                    data: data,
                                });

                                // Add a layer to display the stores with the custom icon
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

                                // Change cursor to pointer on hover
                                map.current.on('mouseenter', 'stores', (e) => {
                                    map.current.getCanvas().style.cursor = 'pointer';

                                    // Set hovered store data and position
                                    setHoveredStore(e.features[0].properties);
                                    const coordinates = e.features[0].geometry.coordinates.slice();
                                    const pos = map.current.project(coordinates);
                                    setHoverPosition({ x: pos.x, y: pos.y });
                                });

                                // Revert cursor to default on leave and hide the card
                                map.current.on('mouseleave', 'stores', () => {
                                    map.current.getCanvas().style.cursor = '';
                                    setHoveredStore(null);
                                });

                                // Handle click event to navigate to dynamic path
                                map.current.on('click', 'stores', (e) => {
                                    const id = e.features[0].properties.id; // Get the store id
                                    router.push(`/winkels/${id}`); // Navigate to the dynamic route
                                });
                            })
                            .catch(error => {
                                console.error("Error fetching or adding data:", error);
                            });
                    };

                    image.onerror = () => {
                        throw new Error('Failed to load the image');
                    };

                } catch (error) {
                    console.error("Error loading the map or adding resources:", error);
                }
            });
        }
    }, [amsterdam.lng, amsterdam.lat, zoom, router]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="w-full h-screen" /> {/* Ensure map has a height */}
            {hoveredStore && (
                <StoreCard store={hoveredStore} position={hoverPosition} />
            )}
        </div>
    );
}
