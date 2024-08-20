import pandas as pd
import pymysql
from pymysql import OperationalError
import os
import uuid
from dotenv import load_dotenv
import json


load_dotenv()

        # connection = pymysql.connect(
        #     host=os.getenv("DB_HOST"),
        #     user=os.getenv("DB_USER"),
        #     password=os.getenv("DB_PASSWORD"),
        #     database=os.getenv("DB_NAME")
        # )

# Load data from CSV
csv_file = 'stores_data_dirk.csv'
data = pd.read_csv(csv_file)

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

        # SQL query to insert data (skipping openingDays)
        insert_query = """
        INSERT INTO supermarkets (
            uuid, latitude, longitude, storeType, city, countryCode, houseNumber,
            houseNumberExtra, postalCode, street, machineWorking, 
            supermarketBranch
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # Iterate over each row in the CSV and insert into the database
        count = 0
        for index, row in data.iterrows():
            # Generate a new UUID
            new_uuid = str(uuid.uuid4())

            # Prepare the data tuple
            record = (
                new_uuid,
                row.get('storeDetail_latitude', None),
                row.get('storeDetail_longitude', None),
                'supermarket',  # Assuming 'storeType' as 'supermarket' since it's not in CSV
                row.get('city', None),
                'NLD',  # Assuming countryCode is 'NL' (Netherlands)
                row.get('houseNumber', None),
                None,  # Assuming houseNumberExtra is not in CSV
                row.get('postalCode', None),
                row.get('street', None),
                1 if row.get('machineWorking', None) else None,
                'dirk'  # Fixed value for supermarketBranch
            )

            # Execute the query
            cursor.execute(insert_query, record)
            count += 1
            print(f"Inserted record with UUID: {new_uuid}, Count: {count}")

        # Commit the transaction
        connection.commit()
        print("Data inserted successfully")

    except OperationalError as e:
        print(f"Error while inserting data: {e}")
        connection.rollback()

    finally:
        if connection.open:
            cursor.close()

# Main function
def main():
    # Connect to the MySQL database
    connection = connect_to_database()

    if connection is not None:
        # Before inserting new data, delete existing records for 'dirk'
        delete_query = "DELETE FROM supermarkets WHERE supermarketBranch = 'dirk';"
        cursor = connection.cursor()
        cursor.execute(delete_query)
        connection.commit()
        print("Deleted existing records with supermarketBranch 'dirk'.")

        # Insert new data into the database
        insert_data_into_db(connection, data)

        # Close the connection
        connection.close()
        print("MySQL connection closed")

if __name__ == "__main__":
    main()

