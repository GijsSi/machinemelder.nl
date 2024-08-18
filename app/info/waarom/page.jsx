'use client';
import React from 'react';
import { FaGithub, FaReddit } from 'react-icons/fa';

const WaaromPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Waarom Dit Project?</h1>

                    <p className="text-gray-700 text-lg leading-7 mb-4">
                        Dit project is ontstaan vanuit een frustratie die velen van ons delen: het is enorm vervelend om je zware flessen en kratten naar de supermarkt te brengen, alleen om erachter te komen dat de automaat kapot is.
                    </p>

                    <p className="text-gray-700 text-lg leading-7 mb-4">
                        Om dit probleem op te lossen, heb ik besloten om een platform te bouwen waar je van tevoren kunt controleren of de flessenautomaat in de supermarkt werkt. Dit bespaart je niet alleen een hoop moeite, maar zorgt er ook voor dat je je bezoek aan de supermarkt beter kunt plannen.
                    </p>

                    <p className="text-gray-700 text-lg leading-7 mb-4">
                        Het doel van dit project is om de ervaring van recyclen gemakkelijker en aangenamer te maken.
                    </p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Wie Heeft Aan Dit Project Gewerkt?</h2>

                    <ul className="list-disc pl-5 text-gray-700 text-lg leading-7">
                        <li className="mb-2">
                            <span className="font-semibold">Gijs</span> - Ontwikkelaar van dit project
                            <div className="flex space-x-4 mt-2">
                                <a href="https://github.com/gijssi" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700">
                                    <FaGithub className="text-2xl" style={{ color: '#4078c0' }} />
                                </a>
                            </div>
                        </li>
                        <li className="mb-2">
                            <span className="font-semibold">Jphorn</span> - Hulp met copywriting.
                            <div className="flex space-x-4 mt-2">
                                <a href="https://github.com/jphorn" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700">
                                    <FaGithub className="text-2xl" style={{ color: '#4078c0' }} />
                                </a>
                                <a href="https://www.reddit.com/user/jphorn/" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700">
                                    <FaReddit className="text-2xl" style={{ color: '#FF4500' }} />
                                </a>
                            </div>
                        </li>
                        <li className="mb-2">
                            <span className="font-semibold">Nubrot</span> - Hulp met het design van stickers.
                            <div className="flex space-x-4 mt-2">
                                <a href="https://www.reddit.com/user/nubrot/" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700">
                                    <FaReddit className="text-2xl" style={{ color: '#FF4500' }} />
                                </a>
                            </div>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Hoe Kan Jij Helpen?</h2>
                    <p className="text-gray-700 text-lg leading-7 mb-4">
                        Wil je ook bijdragen aan dit project? Je kunt een sticker aanvragen voor jouw supermarkt om anderen te helpen weten of de statiegeldmachine werkt.
                    </p>

                    <div className="text-center mb-8">
                        <a
                            href="/aanvraag-sticker"
                            className="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-400 transition duration-300"
                        >
                            Vraag een sticker aan
                        </a>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Steun Dit Project</h2>
                    <p className="text-gray-700 text-lg leading-7 mb-4">
                        Ik ben een student die deze tool in zijn eentje in de lucht houdt. Je kunt al vanaf 1 euro doneren! Ik drink graag een biertje op jou!
                    </p>

                    <div className="text-center">
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

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Dankwoord</h2>
                    <p className="text-gray-700 text-lg leading-7">
                        Ik wil iedereen bedanken die heeft bijgedragen aan dit project. Jullie steun, suggesties en feedback zijn van onschatbare waarde geweest. Samen kunnen we een verschil maken en het recyclen een stuk eenvoudiger maken.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WaaromPage;
