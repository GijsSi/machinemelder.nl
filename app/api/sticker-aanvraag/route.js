// /api/sticker-aanvraag
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
    const {
      storeId,
      firstName,
      lastName,
      email,
      streetAddress,
      city,
      region,
      postalCode,
      requestId,
      payed = false,  // default to false if not provided
    } = await req.json();

    console.log('Received Data:', {
      storeId,
      firstName,
      lastName,
      email,
      streetAddress,
      city,
      region,
      postalCode,
      requestId,
      payed,
    });

    // Validate the incoming data
    if (typeof storeId !== 'string' || storeId.trim() === '' ||
        typeof firstName !== 'string' || firstName.trim() === '' ||
        typeof lastName !== 'string' || lastName.trim() === '' ||
        typeof email !== 'string' || email.trim() === '' ||
        typeof streetAddress !== 'string' || streetAddress.trim() === '' ||
        typeof city !== 'string' || city.trim() === '' ||
        typeof region !== 'string' || region.trim() === '' ||
        typeof postalCode !== 'string' || postalCode.trim() === '' ||
        typeof requestId !== 'string' || requestId.trim() === '') {
      console.error('Validation failed. Missing or invalid fields.');
      return new Response(
          JSON.stringify(
              {error: 'All fields are required and must be valid strings.'}),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          });
    }


    // Insert data into your database
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
        `INSERT INTO sticker_requests 
        (storeId, firstName, lastName, email, streetAddress, city, region, postalCode, requestId, payed) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          storeId,
          firstName,
          lastName,
          email,
          streetAddress,
          city,
          region,
          postalCode,
          requestId,
          payed,
        ]);

    if (result.affectedRows === 1) {
      return new Response(
          JSON.stringify({
            success: true,
            id: requestId,
          }),
          {
            status: 201,
            headers: {
              'Content-Type': 'application/json',
            },
          });
    } else {
      return new Response(
          JSON.stringify({error: 'Failed to submit sticker request.'}), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          });
    }
  } catch (error) {
    console.error('Database insert failed:', error);
    return new Response(
        JSON.stringify({error: 'Failed to submit sticker request.'}), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
  }
}
