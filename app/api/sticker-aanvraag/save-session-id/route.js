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
    const {requestId, session_id} = await req.json();

    console.log(
        'Received request to save session_id:',
        {requestId, session_id});  // Debugging line

    if (!requestId || !session_id) {
      console.error('Missing required fields:', {requestId, session_id});
      return new Response(JSON.stringify({error: 'Missing required fields'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const connection = await connectToDatabase();

    const [result] = await connection.execute(
        'UPDATE sticker_requests SET sessionId = ? WHERE requestId = ?',
        [session_id, requestId]  // Update the correct column with session_id
    );

    if (result.affectedRows === 0) {
      console.error('Sticker request not found for requestId:', requestId);
      return new Response(
          JSON.stringify({error: 'Sticker request not found'}), {
            status: 404,
            headers: {'Content-Type': 'application/json'},
          });
    }

    console.log('Session ID successfully saved for requestId:', requestId);
    return new Response(JSON.stringify({success: true}), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error) {
    console.error('Database update failed:', error);
    return new Response(JSON.stringify({error: 'Failed to save session_id'}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
}
