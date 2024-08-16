# template_path = 'templates/template-no-bg.psd' 
# base_url = 'http://www.machinemelder.nl'


import qrcode
from PIL import Image, ImageDraw, ImageFont
import pymysql
import os

# Database connection
db = pymysql.connect(
    host="161.97.151.230",
    user="root",
    password="E12deab3C8!!",
    database="statiegeld"
)

# Query the database to get the id, uuid, and street for stores in Amsterdam
cursor = db.cursor()
cursor.execute("SELECT id, uuid, street FROM albertheijn WHERE city = 'Amsterdam'")
results = cursor.fetchall()

# Close the cursor and connection
cursor.close()
db.close()

# Filter results to include only the specified IDs
specified_ids = {1112, 1391, 2209, 1676, 5602}
filtered_results = [row for row in results if row[0] in specified_ids]

# Template image (PDF converted to PNG or an existing image file)
template_path = 'templates/template-no-bg.psd' 

# Create directory to save the final images
output_dir = 'final_stickers'
os.makedirs(output_dir, exist_ok=True)

# Define the website URL
base_url = 'http://www.machinemelder.nl'

# Define positions (top-left and bottom-right coordinates)
positions = {
    'square_1': ((1905, 452), (2285, 832)),
    'square_2': ((1905, 1200), (2285, 1580)),
    'square_3': ((1905, 1947), (2285, 2328)),
    'square_uuid': ((1905, 2694), (2285, 3075)),  # Updated coordinates for UUID
    'street_text': ((600, 88), (1878, 207))  # Coordinates for street name
}

# Font settings for street name
font_path = "/System/Library/Fonts/Helvetica.ttc"  # Adjust path if necessary
font_size = 50
font = ImageFont.truetype(font_path, font_size)

# Loop through each store and create QR codes and stickers
for row in filtered_results:
    store_id = row[0]
    store_uuid = row[1]
    street_name = row[2]
    
    # Generate QR codes
    qr_id = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr_id.add_data(f'{base_url}/winkels/{store_id}')
    qr_id.make(fit=True)
    img_qr_id = qr_id.make_image(fill='black', back_color='white')
    
    qr_uuid = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr_uuid.add_data(f'{base_url}/manager/{store_uuid}')
    qr_uuid.make(fit=True)
    img_qr_uuid = qr_uuid.make_image(fill='black', back_color='white')

    # Open the template image
    template = Image.open(template_path)
    draw = ImageDraw.Draw(template)
    
    # Resize QR codes to fit within the boxes
    img_qr_id = img_qr_id.resize((positions['square_1'][1][0] - positions['square_1'][0][0], 
                                  positions['square_1'][1][1] - positions['square_1'][0][1]))
    img_qr_uuid = img_qr_uuid.resize((positions['square_uuid'][1][0] - positions['square_uuid'][0][0], 
                                      positions['square_uuid'][1][1] - positions['square_uuid'][0][1]))

    # Paste the QR codes onto the template
    template.paste(img_qr_id, positions['square_1'][0])
    template.paste(img_qr_id, positions['square_2'][0])
    template.paste(img_qr_id, positions['square_3'][0])
    template.paste(img_qr_uuid, positions['square_uuid'][0])

    # Add the street name in bold black font
    text_position = positions['street_text'][0]
    draw.text(text_position, street_name, font=font, fill="black")

    # Save the final image as PDF
    template.save(os.path.join(output_dir, f'sticker_{store_id}.pdf'), "PDF")

print("Stickers generated and saved in the 'final_stickers' directory.")