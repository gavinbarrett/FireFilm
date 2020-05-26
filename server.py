import base64
from src.steg import encode
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

@app.route('/upload', methods=['POST', 'GET'])
def encode_image():
	r = request.files['file']
	# read the image binary
	data = r.read()
	# encode the image with a message
	enc_data = encode(data, "I'm Gavin")
	# encode image as base64
	serialized_data = base64.b64encode(enc_data).decode("UTF-8")
	# add image/png heading
	serialized = f"data:image/png;base64,{str(serialized_data)}"
	# return the serialized data in a json object
	return jsonify({"enc":serialized})

@app.route('/', methods=['GET'])
def main():
    return render_template('./index.html') 

if __name__ == "__main__":
    app.run(threaded=True)
