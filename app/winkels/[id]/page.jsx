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
                    if (distance >= 0 && distance <= 300) {
                        callback(position);
                    } else {
                        setModalProps({
                            version: 'warning',
                            title: 'Out of Range',
                            message: 'Je bent niet binnen 150m van de winkel.',
                            buttonText: 'Close',
                        });
                        setIsModalOpen(true);
                    }
                },
                (error) => {
                    let modalConfig = {
                        version: 'default',
                        title: 'Locatie Error',
                        message: 'Er is een fout opgetreden bij het ophalen van je locatie.',
                        buttonText: 'Close',
                    };

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            modalConfig = {
                                version: 'error',
                                title: 'Oops, ben je in de winkel?',
                                message: "We hebben je locatie nodig om te controleren of je in de buurt van de winkel bent.",
                                buttonText: 'Begrepen',
                            };
                            break;
                        case error.POSITION_UNAVAILABLE:
                            modalConfig = {
                                version: 'warning',
                                title: 'Locatie niet beschikbaar',
                                message: 'Locatie-informatie is niet beschikbaar.',
                                buttonText: 'Okay',
                            };
                            break;
                        case error.TIMEOUT:
                            modalConfig = {
                                version: 'warning',
                                title: 'Request Timeout',
                                message: 'Het verzoek om je locatie op te halen duurde helaas te lang.',
                                buttonText: 'Probeer opnieuw',
                            };
                            break;
                        case error.UNKNOWN_ERROR:
                            modalConfig = {
                                version: 'error',
                                title: 'Unknown Error',
                                message: 'Er is een onbekende fout opgetreden bij het ophalen van je locatie.',
                                buttonText: 'Okay',
                            };
                            break;
                        default:
                            modalConfig = {
                                version: 'default',
                                title: 'Location Error',
                                message: 'Onbekende fout opgetreden.',
                                buttonText: 'Begrepen',
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
                title: 'Geolocatie niet ondersteund',
                message: 'Geolocatie niet ondersteund in deze browser.',
                buttonText: 'Sluit',
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
            const reportResponse = await fetch(`/api/reports/${params.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude,
                    machineWorking: machineWorking,
                    reporterIpAddress: ipAddress,
                }),
            });

            const reportData = await reportResponse.json();
            console.log('Report response status:', reportResponse.status);
            console.log('Report response data:', reportData);

            // Check if the report was successfully submitted
            if (reportResponse.status === 201 && reportData.success) {
                // Set success modal properties
                setModalProps({
                    version: 'success',
                    title: 'Success!',
                    message: 'Dankjewel voor je melding. Jouw melding helpt anderen!',
                    buttonText: 'Close',
                });
                setIsModalOpen(true);
                setReports(prevReports => [reportData.report, ...prevReports]);
            } else {
                throw new Error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            setModalProps({
                version: 'error',
                title: 'Submission Error',
                message: 'Melding is niet gelukt. Probeer het later nog een keer.',
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
        const date = new Date(dateString);

        // Subtract 2 hours from the time
        date.setHours(date.getHours() - 2);

        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        };


        return date.toLocaleDateString('nl-NL', options);
    };

    const sortedReports = reports.sort((a, b) => new Date(b.properties?.createdAt) - new Date(a.properties?.createdAt));
    const latestReport = sortedReports.length > 0 ? sortedReports[0] : null;
    const dotColor = latestReport?.properties?.machineWorking ? 'bg-green-400' : 'bg-red-400';

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
                            width={150}
                            height={150}
                        />
                    </div>

                    <div className="bg-white shadow sm:rounded-lg mx-10 w-full max-w-3xl">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-2xl font-semibold leading-6 text-gray-900 pb-1">
                                Werkt de machine op {storeData.street} {storeData.houseNumber}?
                            </h3>
                            {latestReport ? (
                                <p className='text-gray-300 font-semibold text-sm flex items-center'>
                                    Laatste update: {formatDateTime(latestReport.properties?.createdAt)}
                                    <span className="relative inline-flex ml-2">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}></span>
                                        <span className={`relative inline-flex rounded-full h-3 w-3 ${dotColor}`}></span>
                                    </span>
                                </p>
                            ) : (
                                <p className='text-gray-300 font-semibold text-sm flex items-center'>
                                    Nog geen meldingen beschikbaar.
                                </p>
                            )}
                            <div className="mt-2 text-sm text-gray-500">
                                <p className="bg-yellow-100 border border-yellow-300 p-2 rounded">
                                    ⚠️ We vragen je locatie om te controleren of je in de buurt van de winkel bent.
                                </p>
                            </div>

                            <div className="mt-5 flex justify-center space-x-4 w-full">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => handleWorkingClick()}
                                >
                                    Werkend
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => handleBrokenClick()}
                                >
                                    Kapot
                                </button>
                                <Link
                                    href={`/aanvraag-sticker/${params.id}`}
                                    type="button"
                                    className="inline-flex items-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition duration-300 ease-in-out transform hover:scale-105"
                                >
                                    Sticker weg?
                                </Link>
                            </div>
                            <Link
                                href={`/`}
                                type="button"
                                className="mt-4 w-full inline-flex items-center justify-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 text-center transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                <p className="w-full text-center">
                                    Toon alle automaten in de buurt
                                </p>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg mt-8 mx-10 w-full max-w-3xl px-6 py-8 sm:p-10">
                        <div className="text-center">
                            <p className="text-lg font-semibold mb-2 text-left">Wat is MachineMelder nou weer?</p>
                            <p className='text-left'>Deze tool heb ik gebouwd omdat ik er helemaal klaar mee ben dat elke keer als ik met kratten naar de Albert Heijn loop de statiegeldmachine weer kapot is. Om dit probleem op te lossen heb ik deze oplossing bedacht in de hoop dat mensen het gebruiken. Zo kun je van tevoren checken of de statiegeldmachine werkt. Scheelt je ook weer een telefoontje naar die sjacherijnige filiaalmanager 😜</p>
                            <p className="text-md pt-2 text-gray-600 text-left mb-6">Ik ben een student die deze tool in zijn eentje in de lucht houdt. Je kunt al vanaf 1 euro doneren! Ik drink graag een biertje op jou!</p>
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
                                {sortedReports.length > 0 ? (
                                    sortedReports.map((report) => (
                                        <li key={report.properties.id} className="flex items-center justify-between pr-8">
                                            <span>{formatDateTime(report.properties.createdAt)}</span>
                                            <span className={`ml-2 relative flex h-3 w-3 `}>
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusColor(report.properties.machineWorking)} opacity-75`}></span>
                                                <span className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(report.properties.machineWorking)}`}></span>
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <p>Geen meldingen beschikbaar.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </>
            ) : (
                <p>Winkeldata laden...</p>
            )}
        </div>
    )
}

export default WinkelPage;
