from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS to allow communication from your React app

# Helper function to convert an image to base64
def image_to_base64(image):
    _, buffer = cv2.imencode('.png', image)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    return img_base64

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    file = request.files['image']
    npimg = np.fromfile(file, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    # Example of simple image processing (resizing, converting to gray, etc.)
    fixed_size = (3462, 788)
    img_resized = cv2.resize(img, fixed_size, interpolation=cv2.INTER_LINEAR)
    img_gray = cv2.cvtColor(img_resized, cv2.COLOR_BGR2GRAY)
    _, img_binary = cv2.threshold(img_gray, 116, 255, cv2.THRESH_BINARY)
    img_dilate = cv2.dilate(img_binary, np.ones((3, 3), np.uint8), iterations=1)

    # Convert processed images to base64
    images = {
        'resized': image_to_base64(img_resized),
        'gray': image_to_base64(img_gray),
        'binary': image_to_base64(img_binary),
        'dilate': image_to_base64(img_dilate),
    }

    return jsonify(images)

if __name__ == '__main__':
    app.run(debug=True)
