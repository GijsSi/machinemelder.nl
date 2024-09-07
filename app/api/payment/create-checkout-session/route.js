// /api/payment/create-checkout-session
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const {amount, currency = 'eur', storeId, requestId} = await req.json();
    // console.log(
    //     'Received Data CCS API:', {amount, currency, storeId, requestId});

    if (!amount || !storeId || !requestId) {
      return new Response(JSON.stringify({error: 'Missing required fields'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Sticker Payment',
            },
            unit_amount: amount * 100,  // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/aanvraag-sticker/success`,
      cancel_url: `${baseUrl}/aanvraag-sticker/cancel`,
      metadata: {
        requestId: String(requestId),
      },
      payment_intent_data: {
        metadata: {
          requestId: String(requestId),
        }
      }


    });
    // console.log('Stripe session created:', session);

    // Save the session_id and requestId in database
    try {
      const saveSessionResponse =
          await fetch(`${baseUrl}/api/sticker-aanvraag/save-session-id`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requestId,
              session_id: session.id,
            }),
          });

      if (!saveSessionResponse.ok) {
        const errorMessage = await saveSessionResponse.text();
        console.error('Failed to save session_id:', errorMessage);
        throw new Error('Failed to save session_id');
      }

      // const saveSessionResult = await saveSessionResponse.json();
      // console.log('Save session result:', saveSessionResult);

      return new Response(JSON.stringify({id: session.id, requestId}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      });

    } catch (fetchError) {
      console.error('Error during fetch to save session:', fetchError);
      throw new Error('Failed to perform fetch request');
    }

  } catch (error) {
    console.error('Stripe Checkout Session Error:', error.message);

    return new Response(JSON.stringify({error: error.message}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}
