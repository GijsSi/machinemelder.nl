'use client';
import React, { useEffect, useState } from 'react';

const StoreCard = ({ store, position }) => {
    const [latestReport, setLatestReport] = useState(null);

    useEffect(() => {
        async function fetchReports() {
            try {
                const response = await fetch(`/api/reports/${store.id}`);
                const data = await response.json();

                if (data.reports && data.reports.features && data.reports.features.length > 0) {
                    const latest = data.reports.features.reduce((latest, report) => {
                        return new Date(report.properties.createdAt) > new Date(latest.properties.createdAt) ? report : latest;
                    }, data.reports.features[0]);

                    setLatestReport(latest);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        }

        fetchReports();
    }, [store.id]);

const formatDate = (dateString) => {
    const date = new Date(dateString.replace(' ', 'T'));
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit', 
        timeZone: 'Europe/Amsterdam' 
    };
    return date.toLocaleString('nl-NL', options);
};
    
    const machineWorking = latestReport?.properties?.machineWorking;
    const createdAt = latestReport?.properties?.createdAt;
    const dotColor = machineWorking ? 'bg-green-400' : 'bg-red-400';

    return (
        <div
            style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
            }}
            className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-74"
        >
            <h3 className="text-lg font-semibold">{store.street} {store.houseNumber}{store.houseNumberExtra}</h3>
            <p className="text-sm text-gray-500">
                Laatste melding: {createdAt ? formatDate(createdAt) : 'nog geen meldingen'}
            </p>

            {createdAt && (
                <p className="flex items-center text-sm text-gray-500">
                    Automaatstatus:
                    <span className="ml-2 relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`}></span>
                    </span>
                </p>
            )}
        </div>
    );
};

export default StoreCard;
