import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const {amount, currency = 'eur', storeId, requestId} = await req.json();

    if (!amount || !storeId || !requestId) {
      return new Response(JSON.stringify({error: 'Missing required fields'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types:
          ['ideal', 'card'],  // Enable iDEAL and card payments
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
      success_url: `${
          baseUrl}/aanvraag-sticker/success?session_id={CHECKOUT_SESSION_ID}&storeId=${
          storeId}`,
      cancel_url: `${baseUrl}/aanvraag-sticker/cancel`,
    });

    // Save the session_id and requestId in your database
    const saveSessionResponse =
        await fetch(`${baseUrl}/api/sticker-aanvraag/save-session-id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestId,  // The correct requestId for this sticker request
            session_id: session.id,  // The session ID returned from Stripe
          }),
        });

    const saveSessionResult = await saveSessionResponse.json();

    if (!saveSessionResponse.ok) {
      console.error('Failed to save session_id:', saveSessionResult.error);
      throw new Error('Failed to save session_id');
    }

    return new Response(JSON.stringify({id: session.id, requestId}), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error) {
    console.error('Stripe Checkout Session Error:', error.message);
    return new Response(JSON.stringify({error: error.message}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}
