from pdf2image import convert_from_path
import numpy as np

# Convert PDF to image
pdf_file_path = 'templates/template-colored-boxes.pdf'  # Replace with your actual PDF path
pages = convert_from_path(pdf_file_path, dpi=300)

# Convert the first page to a numpy array for analysis
page_image = pages[0]
page_array = np.array(page_image)

# Define colors for detection
normal_id_color_rgb = [84, 255, 0]  # #54FF00
uuid_color_rgb = [255, 0, 0]        # #FF0000

# Find positions of normal and uuid colored rectangles
normal_id_positions = np.where(np.all(page_array[:, :, :3] == normal_id_color_rgb, axis=-1))
uuid_positions = np.where(np.all(page_array[:, :, :3] == uuid_color_rgb, axis=-1))

# Determine bounding boxes
def calculate_all_bounding_boxes(positions):
    if not positions[0].size:  # Check if positions array is empty
        return []
    
    # Convert positions to a set of points
    points = set(zip(positions[0], positions[1]))
    
    # Group points into clusters based on proximity to determine separate rectangles
    clusters = []
    while points:
        new_cluster = set()
        to_process = {points.pop()}
        
        while to_process:
            point = to_process.pop()
            new_cluster.add(point)
            
            # Find neighbors (within a small range to account for gaps in the detection)
            neighbors = {p for p in points if abs(p[0] - point[0]) <= 10 and abs(p[1] - point[1]) <= 10}
            points -= neighbors
            to_process |= neighbors
        
        clusters.append(new_cluster)
    
    # Calculate bounding boxes for each cluster
    bounding_boxes = []
    for cluster in clusters:
        y_positions, x_positions = zip(*cluster)
        bounding_box = (min(x_positions), min(y_positions), max(x_positions), max(y_positions))
        bounding_boxes.append(bounding_box)
    
    return bounding_boxes

# Calculate all bounding boxes for normal and uuid positions
all_normal_id_bboxes = calculate_all_bounding_boxes(normal_id_positions)
all_uuid_bboxes = calculate_all_bounding_boxes(uuid_positions)

print("Normal ID Bounding Boxes:", all_normal_id_bboxes)
print("UUID Bounding Box:", all_uuid_bboxes)
