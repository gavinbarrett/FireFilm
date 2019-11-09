import os
from flask import Flask, flash, request, redirect, url_for, render_template, jsonify, send_file

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def encode_image():
    # TODO make sure we are receiving the actual image file
    # be sure to return the .png files after processing
    print('Made it to the server')
    print(request.files)
    #print(request.files['a'])
    #print(type(request.files['a']))
    a = {"hey" : "yo"}
    return jsonify(a)

@app.route('/')
def main():
    return render_template('./index.html') 

if __name__ == "__main__":
    app.run(threaded=True)
