'use client';
import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CancelPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const storeId = searchParams.get('storeId');

    return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-red-600">Betaling geannuleerd</h1>
                <p className="mt-4">Je betaling is helaas niet geslaagd. Als je het nogmaals wilt proberen, klik dan de knop hieronder.</p>
                <button
                    className="mt-6 inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    onClick={() => router.push(storeId ? `/store/${storeId}` : '/store')}
                >
                    Probeer opnieuw
                </button>
            </div>
        </div>
    );
};

const CancelPage = () => (
    <Suspense fallback={<div>Laden...</div>}>
        <CancelPageContent />
    </Suspense>
);

export default CancelPage;
