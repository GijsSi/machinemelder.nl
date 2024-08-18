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

export async function GET(req, {params}) {
  const {id} = params;

  try {
    const connection = await connectToDatabase();

    // Fetch store information and related reports
    const [storeRows] = await connection.execute(
        'SELECT id, latitude, longitude, storeType, city, countryCode, houseNumber, houseNumberExtra, postalCode, street, openingDays FROM supermarkets WHERE id = ?',
        [id]);

    if (storeRows.length === 0) {
      return new Response(JSON.stringify({error: 'Store not found'}), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const store = storeRows[0];

    const [reportRows] = await connection.execute(
        'SELECT id, latitude, longitude, machineWorking, createdAt FROM meldingen WHERE supermarktId = ?',
        [id]);

    const geojson = {
      type: 'FeatureCollection',
      features: reportRows.map(
          (row) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates:
                  [parseFloat(row.longitude), parseFloat(row.latitude)],
            },
            properties: {
              id: row.id,
              machineWorking: row.machineWorking,
              createdAt: row.createdAt,
            },
          })),
    };

    return new Response(JSON.stringify({store, reports: geojson}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database query failed', error);
    return new Response(JSON.stringify({error: 'Failed to load data'}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(req, {params}) {
  const {id} = params;

  try {
    const {latitude, longitude, machineWorking, reporterIpAddress} =
        await req.json();

    if (latitude === undefined || longitude === undefined ||
        machineWorking === undefined) {
      return new Response(JSON.stringify({error: 'Missing required fields'}), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const connection = await connectToDatabase();

    // Insert the new report into the meldingen table
    const [result] = await connection.execute(
        'INSERT INTO meldingen (supermarktId, latitude, longitude, machineWorking, reporterIpAddress) VALUES (?, ?, ?, ?, ?)',
        [id, latitude, longitude, machineWorking, reporterIpAddress]);

    // Update the machineWorking status in the albertheijn table
    const [updateResult] = await connection.execute(
        'UPDATE supermarkets SET machineWorking = ? WHERE id = ?',
        [machineWorking, id]);
    console.log('Update result:', updateResult);

    return new Response(JSON.stringify({success: true, id: result.insertId}), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Database insert or update failed', error);
    return new Response(
        JSON.stringify({error: 'Failed to add report and update store status'}),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
  }
}
