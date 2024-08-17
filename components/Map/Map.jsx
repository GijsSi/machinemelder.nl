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
        router.push(`/winkels/${id}`);
    };

    return (
        <div className="relative w-full h-full">
            <MapContainer onStoreHover={handleStoreHover} onStoreClick={handleStoreClick} />
            {hoveredStore && (
                <StoreCard store={hoveredStore} position={hoverPosition} />
            )}
        </div>
    );
};

export default Map;
