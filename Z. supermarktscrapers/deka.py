import requests
import pymysql
import pandas as pd
import uuid
from pymysql import OperationalError
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Define the API endpoint and headers
api_url = 'https://api.dekamarkt.nl/v1/storescache/formula/1'
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Referer': 'https://www.dekamarkt.nl/',
    'Content-Type': 'application/json',
    'api_key': '6d3a42a3-6d93-4f98-838d-bcc0ab2307fd',
    'Origin': 'https://www.dekamarkt.nl',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'Priority': 'u=4',
    'TE': 'trailers'
}

# Function to fetch data from the API
def fetch_store_data():
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data: {response.status_code}")
        return None

# Function to connect to the MySQL database
def connect_to_database():
    try:
        connection = pymysql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        print("Connected to MySQL database")
        return connection
    except OperationalError as e:
        print(f"Error while connecting to MySQL: {e}")
        return None

# Function to insert data into the database
def insert_data_into_db(connection, data):
    try:
        cursor = connection.cursor()

        # SQL query to insert data
        insert_query = """
        INSERT INTO supermarkets (
            uuid, latitude, longitude, storeType, city, countryCode, houseNumber,
            houseNumberExtra, postalCode, street, machineWorking, 
            supermarketBranch
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        for store_value in data:
            # Generate a new UUID
            new_uuid = str(uuid.uuid4())

            # Prepare the data tuple
            record = (
                new_uuid,
                store_value.get('StoreDetail', {}).get('Latitude', None),
                store_value.get('StoreDetail', {}).get('Longitude', None),
                'supermarket',  # Fixed value for storeType
                store_value.get('City', None),
                'NL',  # Assuming countryCode is 'NL' (Netherlands)
                store_value.get('HouseNumber', None),
                None,  # Assuming houseNumberExtra is not provided
                store_value.get('PostalCode', None),
                store_value.get('Street', None),
                None,  # Assuming machineWorking as 0, adjust as needed
                'deka'  # Fixed value for supermarketBranch
            )

            # Execute the query
            cursor.execute(insert_query, record)

        # Commit the transaction
        connection.commit()
        print("Data inserted successfully")

    except OperationalError as e:
        print(f"Error while inserting data: {e}")
        connection.rollback()

    finally:
        if connection.open:
            cursor.close()

# Main function to execute the script
def main():
    data = fetch_store_data()
    if data:
        connection = connect_to_database()
        if connection is not None:
            # Insert the data into the database
            insert_data_into_db(connection, data)
            # Close the connection
            connection.close()
            print("MySQL connection closed")

if __name__ == "__main__":
    main()
