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
cursor.execute("SELECT id, uuid, street FROM supermarkets ")
results = cursor.fetchall()

# Close the cursor and connection
cursor.close()
db.close()

# Filter results to include only the specified IDs
specified_ids = {1105}
filtered_results = [row for row in results if row[0] in specified_ids]

# Template image (PDF converted to PNG or an existing image file)
template_path = 'templates/sticker2-a4.png' 

# Create directory to save the final images
output_dir = 'final_stickers'
os.makedirs(output_dir, exist_ok=True)

# Define the website URL
base_url = 'http://www.machinemelder.nl'

# Coordinates extracted from the image processing step
positions = [
    ((59, 3140), (361, 3442)),
    ((1299, 3139), (1601, 3442)),
    ((1299, 2261), (1603, 2565)),
    ((60, 2261), (362, 2565)),
    ((59, 1386), (362, 1689)),
    ((1299, 1385), (1603, 1689)),
    ((59, 507), (362, 810)),
    ((1299, 506), (1603, 812))
]

# Define A4 size in pixels (at 300 dpi)
a4_width, a4_height = 2480, 3508

# Loop through each store and create QR codes and stickers
for row in filtered_results:
    store_id = row[0]
    
    # Generate QR code for the store ID
    qr_id = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr_id.add_data(f'{base_url}/winkels/{store_id}')
    qr_id.make(fit=True)
    img_qr_id = qr_id.make_image(fill='black', back_color='white')
    
    # Open the template image
    template = Image.open(template_path)
    
    # Create a blank A4 canvas
    a4_canvas = Image.new('RGB', (a4_width, a4_height), 'white')
    
    # Calculate the offset to center the template on the A4 canvas
    template_width, template_height = template.size
    offset_x = (a4_width - template_width) // 2
    offset_y = (a4_height - template_height) // 2
    
    # Paste the template onto the A4 canvas
    a4_canvas.paste(template, (offset_x, offset_y))
    
    # Loop through each position and place the QR code
    for pos in positions:
        img_qr_resized = img_qr_id.resize((pos[1][0] - pos[0][0], pos[1][1] - pos[0][1]))
        a4_canvas.paste(img_qr_resized, (pos[0][0] + offset_x, pos[0][1] + offset_y))

    # Save the final image as A4 PDF
    a4_canvas.save(os.path.join(output_dir, f'sticker_{store_id}.pdf'), "PDF", resolution=300)

print("Stickers generated and saved in A4 format in the 'final_stickers' directory.")
