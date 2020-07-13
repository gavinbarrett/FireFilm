from PIL import Image
from base64 import b64encode
from src.steg import encode, decode
from flask import Flask, request, render_template, jsonify

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def encode_image():
	if 'file' not in request.files:
		print('file was not sent')
		return jsonify({ 'enc': 'None' })
	# FIXME check the file type; jpg should be converted to png
	r = request.files['file']
	# retrieve the secret message
	# FIXME: add error handling
	secret_message = request.form['message']
	# read the image
	data = r.read()
	# encode the image with a message
	enc_data = encode(data, secret_message)
	# encode image as base64
	serialized_data = b64encode(enc_data).decode("UTF-8")
	# add image/png heading
	serialized = f"data:image/png;base64,{str(serialized_data)}"
	# return the serialized data in a json object
	return jsonify({ "enc":serialized })

@app.route('/decode', methods=['POST'])
def decode_image():
	r = request.files['decfile']
	# read the image
	data = r.read()
	# attempt to decode the image
	message = decode(data)
	# return nothing if no message was found
	if not message:
		return jsonify({ "decoded":"None" })
	# return the image's message
	serialized_data = b64encode(message.encode()).decode("UTF-8")
	return jsonify({ "decoded":serialized_data })

@app.route('/', methods=['GET'])
def main():
    return render_template('./index.html') 

if __name__ == "__main__":
    app.run(threaded=True)
