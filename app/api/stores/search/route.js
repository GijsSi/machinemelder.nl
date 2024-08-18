import mysql from 'mysql2/promise';
import {NextResponse} from 'next/server';

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

export async function GET(req) {
  const {searchParams} = new URL(req.url);
  const query = searchParams.get('query');

  if (!query || query.length < 2) {
    return NextResponse.json(
        {error: 'Query must be at least 2 characters long.'}, {status: 400});
  }

  try {
    const connection = await connectToDatabase();
    const [results] = await connection.execute(
        'SELECT id, street, houseNumber, city FROM supermarkets WHERE street LIKE ? LIMIT 10',
        [`%${query}%`]);

    return NextResponse.json(results, {status: 200});
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json({error: 'Failed to fetch stores'}, {status: 500});
  }
}
