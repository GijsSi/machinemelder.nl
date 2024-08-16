// /api/payment/update-payment/
import mysql from 'mysql2/promise';

let cachedConnection = null;

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

export async function POST(req, res) {
  try {
    const {session_id} = await req.json();
    console.log('Request body:', {session_id});

    if (!session_id) {
      console.error('Missing session_id in request body');
      return new Response(JSON.stringify({error: 'Missing session_id'}), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const connection = await connectToDatabase();

    // Ensure we update based on session_id, not id
    const [result] = await connection.execute(
        'UPDATE sticker_requests SET payed = ? WHERE sessionId = ?',
        [1, session_id]);

    if (result.affectedRows === 0) {
      console.error('Sticker request not found for session_id:', session_id);
      return new Response(
          JSON.stringify({error: 'Sticker request not found'}), {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          });
    }

    console.log(
        'Payment status updated successfully for sessionId:', session_id);
    return new Response(JSON.stringify({success: true}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database update failed:', error);
    return new Response(
        JSON.stringify({error: 'Failed to update payment status'}), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
  }
}
