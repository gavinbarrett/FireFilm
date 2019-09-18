import os
from flask import Flask, flash, request, redirect, url_for, render_template

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def encode_image():
    print(request.files)

@app.route('/')
def main():
    return render_template('./index.html') 

if __name__ == "__main__":
    app.run(threaded=True)
