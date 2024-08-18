import requests
import json
import pymysql
import uuid
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# MySQL Database connection
db = pymysql.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
cursor = db.cursor()

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Referer': 'https://www.ah.nl/winkels',
    'content-type': 'application/json',
    'batch': 'true',
    'x-client-name': 'ah-store',
    'x-client-version': '1.2.88',
    'Origin': 'https://www.ah.nl',
    'Connection': 'keep-alive',
    'Cookie': 'your_cookies_here',  # You can copy your cookies here
}

# Create table if not exists with all necessary columns, including a UUID column
cursor.execute("""
    CREATE TABLE IF NOT EXISTS albertheijn (
        id INT PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        storeType VARCHAR(50),
        city VARCHAR(100),
        countryCode VARCHAR(10),
        houseNumber VARCHAR(10),
        houseNumberExtra VARCHAR(10),
        postalCode VARCHAR(10),
        street VARCHAR(255),
        openingDays JSON
    )
""")

# First request to get the basic store information
map_data = json.dumps([
    {
        "operationName": "storesMapResults",
        "variables": {"filter": {"cityStartsWith": None, "location": None, "openingHours": None, "postalCode": None, "services": None, "storeType": None}},
        "query": """
            query storesMapResults($filter: StoresFilterInput) {
                storesSearch(filter: $filter, start: 0, limit: 5000) {
                    result {
                        id
                        geoLocation {
                            latitude
                            longitude
                        }
                        storeType
                    }
                }
            }
        """
    }
])

response = requests.post('https://www.ah.nl/gql', headers=headers, data=map_data)

if response.status_code == 200:
    map_results = response.json()[0]['data']['storesSearch']['result']

    # Insert or update basic store info
    for store in map_results:
        # Generate a UUID for the store if it doesn't already have one
        cursor.execute("SELECT uuid FROM albertheijn WHERE id=%s", (store['id'],))
        existing_uuid = cursor.fetchone()
        if existing_uuid is None:
            store_uuid = str(uuid.uuid4())
        else:
            store_uuid = existing_uuid[0]

        cursor.execute("""
            INSERT INTO albertheijn (id, uuid, latitude, longitude, storeType)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE uuid=VALUES(uuid), latitude=VALUES(latitude), longitude=VALUES(longitude), storeType=VALUES(storeType)
        """, (
            store['id'],
            store_uuid,
            store['geoLocation']['latitude'],
            store['geoLocation']['longitude'],
            store['storeType']
        ))

    # Commit the transaction
    db.commit()

    print(f"Inserted/Updated {len(map_results)} basic store records into the database.")
    
    # Second request to get the detailed store information
    list_data = json.dumps([
        {
            "operationName": "storesListResults",
            "variables": {"limit": 5000},
            "query": """
                query storesListResults($filter: StoresFilterInput, $limit: Int, $start: Int) {
                    storesSearch(filter: $filter, limit: $limit, start: $start) {
                        result {
                            id
                            storeType
                            address {
                                city
                                countryCode
                                houseNumber
                                houseNumberExtra
                                postalCode
                                street
                            }
                            openingDays {
                                date
                                dayName
                                openingHour {
                                    openFrom
                                    openUntil
                                }
                                type
                            }
                        }
                    }
                }
            """
        }
    ])

    response = requests.post('https://www.ah.nl/gql', headers=headers, data=list_data)
    
    if response.status_code == 200:
        list_results = response.json()[0]['data']['storesSearch']['result']

        # Insert or update detailed store info
        for store in list_results:
            cursor.execute("""
                UPDATE albertheijn
                SET city=%s, countryCode=%s, houseNumber=%s, houseNumberExtra=%s, postalCode=%s, street=%s, openingDays=%s
                WHERE id=%s
            """, (
                store['address']['city'],
                store['address']['countryCode'],
                store['address']['houseNumber'],
                store['address'].get('houseNumberExtra', ''),
                store['address']['postalCode'],
                store['address']['street'],
                json.dumps(store['openingDays']),
                store['id']
            ))

        # Commit the transaction
        db.commit()

        print(f"Inserted/Updated {len(list_results)} detailed store records into the database.")
    else:
        print(f"Failed to fetch detailed store data. Status code: {response.status_code}")

else:
    print(f"Failed to fetch basic store data. Status code: {response.status_code}")

# Close the connection
cursor.close()
db.close()
