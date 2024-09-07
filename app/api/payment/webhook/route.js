import mysql from 'mysql2/promise';
import {NextResponse} from 'next/server';
import Stripe from 'stripe';

let cachedConnection = null;

// Function to connect to the MySQL database
async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  cachedConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  return cachedConnection;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  //   console.log('Received Stripe signature:', sig);
  //   console.log('Received raw body:', body);

  let event;

  // Verify the webhook event from Stripe
  try {
    event = stripe.webhooks.constructEvent(
        body, sig,
        process.env.STRIPE_WEBHOOK_SECRET  // Ensure secret is correct
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
        {error: `Webhook Error: ${err.message}`}, {status: 400});
  }

  //   console.log('Received Stripe webhook:', event);

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent);

      // Fetch the requestId or sessionId from the metadata (if passed during
      // checkout creation)
      const requestId = paymentIntent.metadata.requestId;
      const sessionId =
          paymentIntent.id;  // Use the session id of the paymentIntent

      // Connect to the database
      const dbConnection = await connectToDatabase();

      try {
        // Update the payed status in the sticker_requests table
        const [result] = await dbConnection.execute(
            `UPDATE sticker_requests 
           SET payed = 1, sessionId = ? 
           WHERE requestId = ?`,
            [sessionId, requestId]);

        console.log(
            'Sticker request payed status updated in database:', result);
      } catch (dbError) {
        console.error('Database update error:', dbError.message);
        return NextResponse.json(
            {error: 'Database update failed'}, {status: 500});
      }
      break;

    // Handle other event types if necessary
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to Stripe
  return NextResponse.json({received: true});
}
