import requests
import json
import pymysql
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

# Define the URL of the API endpoint
url = "https://www.jumbo.com/INTERSHOP/rest/WFS/Jumbo-Grocery-Site/webapi/stores"

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
    'Cookie': 'your_cookies_here',
}

# Send a GET request to the endpoint
response = requests.get(url, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    try:
        # Manually parse the JSON content
        stores_data = json.loads(response.text).get("stores", [])
        
        # Define the list to hold filtered stores
        filtered_stores = []

        # Filter stores with collectionPoint: true
        for store in stores_data:
            if store.get("collectionPoint"):
                filtered_stores.append({
                    "uuid": store.get("uuid"),
                    "latitude": store.get("latitude"),
                    "longitude": store.get("longitude"),
                    "storeType": store.get("locationType"),
                    "city": store.get("city"),
                    "countryCode": "NLD",
                    "houseNumber": store.get("street2"),
                    "houseNumberExtra": store.get("street3"),
                    "postalCode": store.get("postalCode"),
                    "street": store.get("street"),
                    "openingDays": json.dumps({}),  # Convert openingDays to JSON string
                    "machineWorking": None,
                    "supermarketBranch": "jumbo"
                })

        # Insert data into the database
        for store in filtered_stores:
            sql = """INSERT INTO albertheijn (uuid, latitude, longitude, storeType, city, countryCode, 
                    houseNumber, houseNumberExtra, postalCode, street, openingDays, machineWorking, supermarketBranch) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                    latitude=VALUES(latitude), longitude=VALUES(longitude), storeType=VALUES(storeType),
                    city=VALUES(city), countryCode=VALUES(countryCode), houseNumber=VALUES(houseNumber),
                    houseNumberExtra=VALUES(houseNumberExtra), postalCode=VALUES(postalCode),
                    street=VALUES(street), openingDays=VALUES(openingDays), machineWorking=VALUES(machineWorking),
                    supermarketBranch=VALUES(supermarketBranch)
            """
            cursor.execute(sql, (
                store['uuid'], store['latitude'], store['longitude'], store['storeType'], store['city'], 
                store['countryCode'], store['houseNumber'], store['houseNumberExtra'], store['postalCode'], 
                store['street'], store['openingDays'], store['machineWorking'], store['supermarketBranch']
            ))

        db.commit()
        print(f"Data inserted into the database successfully.")
    except json.JSONDecodeError:
        print("Failed to parse JSON content.")
        print("Response content:", response.text)
    finally:
        cursor.close()
        db.close()
else:
    print(f"Failed to retrieve data. Status code: {response.status_code}")
    print("Response content:", response.text)
