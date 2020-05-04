import os
import json
from flask import Flask, flash, request, redirect, url_for, render_template, jsonify, send_file

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def encode_image():
	f = open("newfile.png", "wb")
	r = request.files['file']
	# read the image binary
	data = r.read()
	print(data)
	f.write(data)
	f.close()
	return jsonify({"data":"received"})

@app.route('/')
def main():
    return render_template('./index.html') 

if __name__ == "__main__":
    app.run(threaded=True)
