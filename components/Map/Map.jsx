'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MapContainer from './MapContainer';
import StoreCard from './StoreCard';

const Map = () => {
    const router = useRouter();
    const [hoveredStore, setHoveredStore] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    const handleStoreHover = (store, position) => {
        setHoveredStore(store);
        setHoverPosition(position);
    };

    const handleStoreClick = (id) => {
        if (typeof id === 'string' || typeof id === 'number') {
            router.push(`/winkels/${id}`);
            console.log('Navigating to:', `/winkels/${id}`);
        } else {
            console.error('Invalid store ID:', id);
        }
    };


    return (
        <div className="relative w-full h-full">
            <MapContainer
                onStoreHover={handleStoreHover}
                onStoreClick={(store) => handleStoreClick(store.id)}
            />           {hoveredStore && (
                <StoreCard store={hoveredStore} position={hoverPosition} />
            )}
        </div>
    );
};

export default Map;
