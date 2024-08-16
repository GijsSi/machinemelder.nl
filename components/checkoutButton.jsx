import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for requestId generation

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = ({ amount, storeId, formData }) => {
    const handleCheckout = async (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page

        try {
            const requestId = uuidv4();  // Generate requestId

            console.log('Generated Request ID:', requestId);  // Debugging line
            console.log('Form Data:', formData);  // Debugging line
            console.log('Store ID:', storeId);  // Debugging line

            // Create the sticker request in the database
            const response = await fetch('/api/sticker-aanvraag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    storeId,
                    requestId,
                    payed: false,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Sticker request created:', result);  // Debugging line
                const stripe = await stripePromise;

                const paymentResponse = await fetch('/api/payment/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount, storeId, requestId }),
                });

                const session = await paymentResponse.json();

                if (session.id) {
                    console.log('Stripe session created:', session.id);  // Debugging line
                    const result = await stripe.redirectToCheckout({
                        sessionId: session.id,
                    });

                    if (result.error) {
                        console.error(result.error.message);
                    }
                } else {
                    console.error('Failed to create checkout session:', session.error);
                }
            } else {
                console.error('Error creating sticker request:', result.error);
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error submitting form', error);
            alert('Something went wrong while submitting the form.');
        }
    };

    return (
        <button
            className="inline-flex items-center justify-center w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            onClick={handleCheckout} // Call handleCheckout on click
        >
            Betaal 3 euro 💳
        </button>
    );
};

export default CheckoutButton;
