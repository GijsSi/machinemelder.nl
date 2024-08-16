import React from 'react';
import { useRouter } from 'next/navigation';

const CancelPage = () => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-red-600">Payment Canceled</h1>
                <p className="mt-4">Your payment was not completed. If you wish to try again, please click the button below.</p>
                <button
                    className="mt-6 inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    onClick={() => router.push(`/store/${router.query.storeId}`)}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default CancelPage;
