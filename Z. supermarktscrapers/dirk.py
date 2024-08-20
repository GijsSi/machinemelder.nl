import requests
import json
import csv

# Define the range of store IDs to check
start_id = 1
end_id = 1000  # Adjust this as necessary

# Set up the request headers
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Content-Type': 'application/json',
    'Referer': 'https://www.dirk.nl/',
    'api_key': '6d3a42a3-6d93-4f98-838d-bcc0ab2307fd',
    'Origin': 'https://www.dirk.nl',
    'Connection': 'keep-alive',
    'TE': 'trailers'
}

def fetch_store_details(store_id):
    query = f"""
    query {{
      store(storeId: {store_id}) {{
        city
        emailAddress
        formulaID
        storeId
        houseNumber
        name
        number
        phoneNumber
        postalCode
        street
        openingHours {{
          close
          open
          date
          special
          specialDescription
        }}
        storeDetail {{
          label
          latitude
          longitude
          parking
          placeId
          services
          storeManagerName
          storeManagerPhoto
          storeManagerPhoto2
          storeManagerQuote
          textBlockAtTheTop
          textBlockSubText
          textBlockTitle
          tiktokAccount
          reviewDetails {{
            result {{
              rating
              userRatingsTotal
              reviews {{
                authorName
                authorUrl
                profilePhotoUrl
                rating
                relativeTimeDescription
                text
                time
                translated
              }}
            }}
          }}
        }}
      }}
    }}
    """
    
    payload = {
        "query": query,
        "variables": {}
    }

    response = requests.post('https://web-dirk-gateway.detailresult.nl/graphql', headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        return None

def filter_null_values(data):
    if isinstance(data, dict):
        return {k: filter_null_values(v) for k, v in data.items() if v is not None and v != {} and v != []}
    return data

def flatten_dict(d, parent_key='', sep='_'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

# Define the CSV header based on known structure
fieldnames = [
    "storeId", "name", "city", "street", "houseNumber", "postalCode", "phoneNumber", 
    "emailAddress", "formulaID", "number", "openingHours", "storeDetail_label", 
    "storeDetail_latitude", "storeDetail_longitude", "storeDetail_parking", 
    "storeDetail_placeId", "storeDetail_services", "storeDetail_storeManagerName", 
    "storeDetail_storeManagerPhoto", "storeDetail_storeManagerPhoto2", 
    "storeDetail_storeManagerQuote", "storeDetail_textBlockAtTheTop", 
    "storeDetail_textBlockSubText", "storeDetail_textBlockTitle", 
    "storeDetail_tiktokAccount", "storeDetail_reviewDetails_result_rating", 
    "storeDetail_reviewDetails_result_userRatingsTotal", "storeDetail_reviewDetails_result_reviews"
]

# Open a CSV file for writing
with open('stores_data.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()

    for store_id in range(start_id, end_id + 1):
        store_data = fetch_store_details(store_id)
        if store_data:
            store = store_data.get("data", {}).get("store", {})
            filtered_store = filter_null_values(store)
            flattened_store = flatten_dict(filtered_store)

            # Ensure all required fields are present and fill missing fields with empty strings
            row = {field: flattened_store.get(field, "") for field in fieldnames}

            # Write the store data if it is valid
            if any(value for value in row.values() if value):  # Ensure there's at least some data
                writer.writerow(row)

print("Data fetching and saving complete.")
