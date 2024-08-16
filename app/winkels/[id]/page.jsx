'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import WarningAnimation from '@/public/images/warning-animation.gif'
import { useRouter } from 'next/navigation'
import Modal from '@/components/modal'
import Link from 'next/link'

const WinkelPage = ({ params }) => {
    const [storeData, setStoreData] = useState(null);
    const [error, setError] = useState(null);
    const [reports, setReports] = useState([]);
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalProps, setModalProps] = useState({
        version: 'default',
        title: '',
        message: '',
        buttonText: 'Understood',
    });

    const lastUpdate = new Date();

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await fetch(`/api/reports/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch store data');
                }
                const data = await response.json();
                setStoreData(data.store);
                if (Array.isArray(data.reports.features)) {
                    setReports(data.reports.features);
                }
            } catch (error) {
                console.error('Error fetching store data:', error);
                setError('Failed to load store data.');
            }
        };

        fetchStoreData();
    }, [params.id]);

    const checkUserLocation = (callback) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userCoords = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    };
                    const storeCoords = {
                        lat: storeData.latitude,
                        lon: storeData.longitude,
                    };
                    const distance = haversineDistance(userCoords, storeCoords);
                    console.log('Distance:', distance);
                    if (distance >= 0 && distance <= 150) {
                        callback(position);
                    } else {
                        setModalProps({
                            version: 'warning',
                            title: 'Out of Range',
                            message: 'You are not within 100 to 150 meters of the store location.',
                            buttonText: 'Close',
                        });
                        setIsModalOpen(true);
                    }
                },
                (error) => {
                    let modalConfig = {
                        version: 'default',
                        title: 'Location Error',
                        message: 'An error occurred while retrieving your location.',
                        buttonText: 'Close',
                    };

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            modalConfig = {
                                version: 'error',
                                title: 'Oops, ben je in de winkel?',
                                message: "We need your location to verify you're near the store. Without it, we can't ensure that you're reporting from the correct location.",
                                buttonText: 'Begrepen',
                            };
                            break;
                        case error.POSITION_UNAVAILABLE:
                            modalConfig = {
                                version: 'warning',
                                title: 'Location Unavailable',
                                message: 'Location information is unavailable.',
                                buttonText: 'Okay',
                            };
                            break;
                        case error.TIMEOUT:
                            modalConfig = {
                                version: 'warning',
                                title: 'Request Timeout',
                                message: 'The request to get your location timed out.',
                                buttonText: 'Probeer opnieuw',
                            };
                            break;
                        case error.UNKNOWN_ERROR:
                            modalConfig = {
                                version: 'error',
                                title: 'Unknown Error',
                                message: 'An unknown error occurred while retrieving your location.',
                                buttonText: 'Okay',
                            };
                            break;
                        default:
                            modalConfig = {
                                version: 'default',
                                title: 'Location Error',
                                message: 'An unexpected error occurred.',
                                buttonText: 'Understood',
                            };
                            break;
                    }

                    setModalProps(modalConfig);
                    setIsModalOpen(true);
                }
            );
        } else {
            setModalProps({
                version: 'warning',
                title: 'Geolocation Not Supported',
                message: 'Geolocation is not supported by this browser.',
                buttonText: 'Close',
            });
            setIsModalOpen(true);
        }
    };

    const haversineDistance = (coords1, coords2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371e3; // Earth's radius in meters
        const dLat = toRad(coords2.lat - coords1.lat);
        const dLon = toRad(coords2.lon - coords1.lon);
        const lat1 = toRad(coords1.lat);
        const lat2 = toRad(coords2.lat);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const submitReport = async (position, machineWorking) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
            // Fetch the client's IP address
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (!ipResponse.ok) {
                throw new Error('Failed to fetch IP address');
            }
            const ipData = await ipResponse.json();
            const ipAddress = ipData.ip;

            console.log(ipAddress);

            // Submit the report with the IP address
            const response = await fetch(`/api/reports/${params.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude,
                    machineWorking: machineWorking,
                    reporterIpAddress: ipAddress
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit report');
            }

            // Set success modal properties
            setModalProps({
                version: 'success',
                title: 'Success!',
                message: 'Thank you for your report. Your submission helps others!',
                buttonText: 'Close',
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error submitting report:', error);
            setModalProps({
                version: 'error',
                title: 'Submission Error',
                message: 'Failed to submit report. Please try again later.',
                buttonText: 'Close',
            });
            setIsModalOpen(true);
        }
    };

    const handleWorkingClick = () => {
        checkUserLocation((position) => {
            submitReport(position, true);
        });
    };

    const handleBrokenClick = () => {
        checkUserLocation((position) => {
            submitReport(position, false);
        });
    };

    const getStatusColor = (machineWorking) => {
        return machineWorking ? 'bg-green-500' : 'bg-red-500';
    };

    const formatDateTime = (dateString) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Modal
                isOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                version={modalProps.version}
                title={modalProps.title}
                message={modalProps.message}
                buttonText={modalProps.buttonText}
            />

            {error && <p className="text-red-500">{error}</p>}
            {storeData ? (
                <>
                    <div className="mb-4">
                        <Image
                            src={WarningAnimation}
                            alt="Warning Animation"
                            width={150}
                            height={150}
                        />
                    </div>

                    <div className="bg-white shadow sm:rounded-lg mx-10 w-full max-w-3xl">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-2xl font-semibold leading-6 text-gray-900 pb-1">
                                Werkt de machine op {storeData.street}?
                            </h3>
                            <div>
                                <p className='text-gray-300 font-semibold text-sm'>Laatste update: {formatDateTime(lastUpdate)}</p>
                            </div>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p className="bg-yellow-100 border border-yellow-300 p-2 rounded">
                                    ⚠️ We will ask for your location to determine if you are in the vicinity of the store.
                                </p>
                            </div>

                            <div className="mt-5">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => handleWorkingClick()}
                                >
                                    Working
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 ml-3 transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => handleBrokenClick()}
                                >
                                    Broken
                                </button>
                                <Link href={`/aanvraag-sticker/${params.id}`}
                                    type="button"
                                    className="inline-flex items-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ml-3 transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Sticker weg?
                                </Link>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg mt-8 mx-10 w-full max-w-3xl px-6 py-8 sm:p-10">
                        <div className="text-center">
                            <p className="text-lg font-semibold mb-2 text-left">Ik ben student die deze tool zijn eentje in de lucht houdt. Ik drink graag een biertje op jouw!</p>
                            <p className='text-left'>Deze tool heb ik gebouwd omdat ik er helemaal klaar mee ben, dat elke keer als ik met kratten naar de albert heijn loop en de machine kapot is. Om dit probleem op te lossen heb ik deze oplossing bedacht in de hoop dat mensen het gebruiken en dat je van te voren kan kijken of de machine werkt. Nu hoef je ook niet meer te bellen om te vragen of de machine werkt.</p>
                            <p className="text-md text-gray-600 mb-6">Je kan al vanaf 1 euro doneren!</p>
                            <a
                                href="https://www.buymeacoffee.com/gijssi"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none' }}
                            >
                                <img
                                    src="https://img.buymeacoffee.com/button-api/?text=Buy me a beer&emoji=🍺&slug=gijssi&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff"
                                    alt="Buy me a beer"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            </a>
                        </div>
                    </div>

                    {/* Displaying the reports */}
                    <div className="bg-white shadow sm:rounded-lg mt-8 mx-10 w-full max-w-3xl">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                Recente meldingen ({reports.length})
                            </h3>
                            <ul className="mt-5 space-y-4 max-h-48 overflow-y-auto">
                                {reports.length > 0 ? (
                                    reports.map((report) => (
                                        <li key={report.properties.id} className="flex items-center justify-between pr-8">
                                            <span>{formatDateTime(report.properties.createdAt)}</span>
                                            <span className={`ml-2 relative flex h-3 w-3 `}>
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusColor(report.properties.machineWorking)} opacity-75`}></span>
                                                <span className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(report.properties.machineWorking)}`}></span>
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <p>No reports available.</p>  // Fallback message if no reports
                                )}
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading store data...</p>
            )}
        </div>
    )
}

export default WinkelPage;
