import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiLoader, FiX } from 'react-icons/fi';

const LoadingButton = ({ initialText, onClick, successMessage, errorMessage, variantColor }) => {
    const [variant, setVariant] = useState('neutral');

    const classNames =
        variant === 'neutral'
            ? `${variantColor} hover:bg-opacity-90`
            : variant === 'error'
                ? 'bg-rose-500'
                : variant === 'success'
                    ? 'bg-emerald-500'
                    : 'bg-gray-300 pointer-events-none';

    const handleClick = async () => {
        if (variant !== 'neutral') return;

        setVariant('loading');
        try {
            await onClick();
            setVariant('success');
            setTimeout(() => {
                setVariant('neutral');
            }, 2000);
        } catch (error) {
            setVariant('error');
            setTimeout(() => {
                setVariant('neutral');
            }, 2000);
        }
    };

    return (
        <motion.button
            disabled={variant !== 'neutral'}
            onClick={handleClick}
            className={`relative rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all ${classNames}`}
        >
            <motion.span
                animate={{
                    y: variant === 'neutral' ? 0 : 6,
                    opacity: variant === 'neutral' ? 1 : 0,
                }}
                className="inline-block"
            >
                {initialText}
            </motion.span>
            <IconOverlay Icon={FiLoader} visible={variant === 'loading'} spin />
            <IconOverlay Icon={FiCheck} visible={variant === 'success'} />
            <IconOverlay Icon={FiX} visible={variant === 'error'} />
        </motion.button>
    );
};

const IconOverlay = ({ Icon, visible, spin = false }) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{
                        y: -12,
                        opacity: 0,
                    }}
                    animate={{
                        y: 0,
                        opacity: 1,
                    }}
                    exit={{
                        y: 12,
                        opacity: 0,
                    }}
                    className="absolute inset-0 grid place-content-center"
                >
                    <Icon className={`text-xl duration-300 ${spin && 'animate-spin'}`} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingButton;
