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

export async function GET(req, res) {
  try {
    const connection = await connectToDatabase();

    const [rows] = await connection.execute(
        'SELECT id, latitude, longitude, storeType, city, countryCode, houseNumber, houseNumberExtra, postalCode, street, machineWorking, openingDays, supermarketBranch FROM supermarkets');


    const geojson = {
      type: 'FeatureCollection',
      features: rows.map(
          (row) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates:
                  [parseFloat(row.longitude), parseFloat(row.latitude)],
            },
            properties: {
              id: row.id,
              storeType: row.storeType,
              city: row.city,
              countryCode: row.countryCode,
              houseNumber: row.houseNumber,
              houseNumberExtra: row.houseNumberExtra,
              postalCode: row.postalCode,
              street: row.street,
              machineWorking: row.machineWorking,
              supermarktBranch: row.supermarketBranch,
              // Check if openingDays is a string and needs parsing
              openingDays: typeof row.openingDays === 'string' ?
                  JSON.parse(row.openingDays) :
                  row.openingDays,
            },
          })),
    };

    console.log('GeoJSON Data:', geojson);

    // Log the first object in the geojson data
    if (geojson && geojson.features && geojson.features.length > 0) {
      console.dir(geojson.features[5], {depth: null});
    } else {
      console.log('No features found in GeoJSON data.');
    }

    return new Response(JSON.stringify(geojson), {
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
