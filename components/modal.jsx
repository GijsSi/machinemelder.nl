import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import Confetti from 'react-confetti';
import { useEffect, useState } from "react";
import useWindowSize from 'react-use/lib/useWindowSize';
import Link from "next/link";
import clsx from 'clsx';

const Modal = ({
    isOpen,
    setIsModalOpen,
    version = 'default',
    title = 'Thank you!',
    message = 'Keep reporting the status of the bottlemachine to help others. If you spot a machine without a sticker get one here or report it.',
    buttonText = 'Understood!'
}) => {
    const [isExploding, setIsExploding] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        if (isOpen) {
            setIsExploding(true);
        } else {
            setIsExploding(false);
        }
    }, [isOpen]);

    const versionStyles = {
        default: 'bg-gradient-to-br from-violet-600 to-indigo-600',
        warning: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
        error: 'bg-gradient-to-br from-red-600 to-red-800',
        success: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    };

    const modalBackground = versionStyles[version] || versionStyles.default;

    const handleButtonClick = () => {
        setIsModalOpen(false);
        window.location.reload(); // Reload the page
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsModalOpen(false)}
                    className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    {isExploding && versionStyles === 'success' && (
                        <Confetti
                            width={width}
                            height={height}
                            numberOfPieces={500}
                            recycle={false}
                        />
                    )}

                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className={clsx(
                            "text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden",
                            modalBackground
                        )}
                    >
                        <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                        <div className="relative z-10">
                            <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                                <FiAlertCircle />
                            </div>
                            <h3 className="text-3xl font-bold text-center mb-2">
                                {title}
                            </h3>
                            <p className="text-center mb-6">
                                {message}
                            </p>
                            <div className="flex gap-2">
                                <Link href="/"
                                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded text-center"
                                >
                                    Go to the map
                                </Link>
                                <button
                                    onClick={handleButtonClick} // Use window.location.reload here
                                    className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                                >
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
