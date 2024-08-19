from PIL import Image
import numpy as np
from psd_tools import PSDImage
import cv2 

# Load the PSD file
psd_image_path = 'templates/test2.png'
image = cv2.imread(psd_image_path)

# Convert to RGB (OpenCV loads images in BGR by default)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Define the target color (in RGB format)
target_color = np.array([255, 252, 243])

# Create a mask where the target color is found
mask = cv2.inRange(image_rgb, target_color, target_color)

# Find contours in the mask
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Initialize a list to store the bounding boxes
bounding_boxes = []

# Loop through the contours and extract bounding boxes
for contour in contours:
    x, y, w, h = cv2.boundingRect(contour)
    bounding_boxes.append(((x, y), (x + w, y + h)))

# Output the coordinates of the bounding boxes
print("Extracted coordinates:", bounding_boxes)