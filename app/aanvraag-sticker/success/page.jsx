'use client'
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SuccessPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const session_id = searchParams.get('session_id');
    const storeId = searchParams.get('storeId');

    useEffect(() => {
        const updatePaymentStatus = async () => {
            try {
                const response = await fetch('/api/payment/update-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ session_id }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update payment status');
                }

                console.log('Payment status updated successfully');
            } catch (error) {
                console.error('Error updating payment status:', error);
                alert('Failed to update payment status.');
            }
        };

        if (session_id) {
            updatePaymentStatus();
        } else {
            console.error('session_id is missing in the query parameters.');
        }
    }, [session_id]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-green-50">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-green-600">Betaling Geslaagd!</h1>
                <p className="mt-4">Dankjewel voor je bestelling! Ik ga hem zo snel mogelijk op de bus voor je doen. (Meestal binnen 1-2 dagen)</p>
                <button
                    className="mt-6 inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                    onClick={() => router.push(`/store/${storeId}`)}
                >
                    Terug naar de map 🗺️
                </button>
            </div>
        </div>
    );
};

const SuccessPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <SuccessPageContent />
    </Suspense>
);

export default SuccessPage;
