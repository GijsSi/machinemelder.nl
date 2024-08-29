"use client";
import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import StickerImage from '@/public/images/sticker.png'


const WinkelSelector = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const router = useRouter();

    // Debounced function to fetch suggestions
    const fetchSuggestions = useCallback(
        debounce(async (query) => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`/api/stores/search?query=${query}`);
                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        fetchSuggestions(query);
    }, [query, fetchSuggestions]);

    const handleSelect = (store) => {
        setSelectedStore(store);
        setQuery(store.street);
        setSuggestions([]);

        // Redirect to the store-specific page
        if (store.id) {
            router.push(`/aanvraag-sticker/${store.id}`);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">

            <div className="winkel-selector bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
                {/* Sticker Image Section */}
                <div className="mt-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Stickers voor jouw winkel</h2>
                    <Image
                        src={StickerImage} // Ensure you update the path correctly
                        alt="Sticker voor machinemelder"
                        width={400} // Adjust the width and height as necessary
                        height={300}
                        className="mx-auto"
                    />
                </div>
                <h2 className="text-xl font-semibold mb-4 mt-6">Zoek jouw winkel</h2>
                <p className="text-gray-600 mb-2">Vul de straatnaam in onder de sticker voor jouw specifieke winkel:</p>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="bv: Vijzelstraat"
                    className="p-3 border rounded w-full text-gray-700 focus:outline-none focus:border-blue-500"
                />

                {loading && <div className="mt-2 text-blue-500">Laden...</div>}

                {suggestions.length > 0 && (
                    <ul className="suggestions-list bg-white border rounded mt-2 w-full z-10 max-h-48 overflow-y-auto">
                        {suggestions.map((store) => (
                            <li
                                key={store.id}
                                onClick={() => handleSelect(store)}
                                className="p-3 cursor-pointer hover:bg-gray-100 border-b last:border-none"
                            >
                                <strong>{store.street} {store.houseNumber}</strong>, {store.city}
                            </li>
                        ))}
                    </ul>
                )}

                {selectedStore && selectedStore.geometry && (
                    <div className="selected-store mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Geselecteerde winkel:</h3>
                        <p className="text-gray-700">{selectedStore.street} {selectedStore.houseNumber}, {selectedStore.city}</p>
                        <p className="text-gray-700">Status van de machine: {selectedStore.machineWorking !== null ? (selectedStore.machineWorking ? 'Werkend' : 'Niet werkend') : 'Onbekend'}</p>
                        <p className="text-gray-700">Coördinaten: {selectedStore.geometry.coordinates.join(', ')}</p>
                    </div>
                )}


                {/* New Section */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Werkt machinemelder.nl ook zonder sticker?</h2>
                    <p className="text-gray-600 mb-4">
                        Ja, machinemelder.nl werkt ook zonder sticker. Maar er zullen vast mensen in de omgeving zijn die machinemelder.nl nog niet kennen en als gevolg hiervan wordt de status van de statiegeldautomaat voor die betreffende winkels minder vaak geüpdatet. Vandaar de sticker, om meer mensen te betrekken en ervoor te zorgen dat de automaatstatus zo up-to-date mogelijk is.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WinkelSelector;
