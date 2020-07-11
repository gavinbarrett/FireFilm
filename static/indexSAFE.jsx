import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';

const fs = require('fs');
const crypto = require('crypto');

class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filepath: null,
			decodepath: null,
			value: '',
		};
	}

	componentDidMount() {}

	updateFile = event => {
		// update the filepath
		this.setState({ filepath: event.target.files[0] });
	}

	updateDecode = event => {
		// update the filepath
		console.log(event.target.files[0]);
		this.setState({ decodepath: event.target.files[0] });
	}

	updateMessage = (event) => {
		let x = document.getElementById("message").value;
		this.setState({ value: x });
	}

	awaitResponse = async (imgData, path) => {
		const resp = await fetch(path, { method: "POST", body: imgData });
		if (resp.ok)
			return await resp.json();
		else {
			console.log("couldn't get a response");
			return {};
		}
	}

	startDownload = (str, filename) => {
		let dl_element = document.createElement('a');
		console.log("str: " + str);
		dl_element.setAttribute('href', str);
		dl_element.setAttribute('download', filename);
		dl_element.style.display = 'none';
		document.body.appendChild(dl_element);
		dl_element.click();
		document.body.removeChild(dl_element);
	}

	getFileHash = (str) => {
		let b64str = str.slice(22, str.length);
		let x = atob(b64str);
		const st = new Uint8Array(x);
		let hash = crypto.createHash('sha256')
			.update(st)
			.digest('hex');
		console.log(hash);
		return hash + '.png';
	}

	uploadFile = () => {
		/* send image with POST request */		
		let imgData = new FormData();
		// append append file to the FormData
		imgData.append("file", this.state.filepath);
		// send AJAX POST request to server
		this.awaitResponse(imgData, '/upload')
			.then(response => {
			console.log("Server responded");
			
			let str = response['enc'];
			let canvas = document.getElementById("img");
			let context = canvas.getContext('2d')
			console.log(str);
			
			{/*
			let encoded = new Image();
			
			encoded.onload = function() {
				console.log(this.width, " ", this.height);
				// set img width/height dimensions
				canvas.setAttribute("width", this.width);
				canvas.setAttribute("height", this.height);
				// draw base64 image to the component
				context.drawImage(encoded, 0, 0, this.width, this.height);
				console.log("Image loaded!");
			}

			// set image source to base64 string	
			encoded.setAttribute("src", str);
			*/}
			let filepath = this.getFileHash(str);
			this.startDownload(str, filepath);
			});
	}

	uploadDecode = () => {
		/* send image with POST request */		
		let imgData = new FormData();
		// append append file to the FormData
		imgData.append("decodefile", this.state.decodepath, this.state.decodepath.name);
		// send AJAX POST request to server
		this.awaitResponse(imgData, '/decode')
			.then(response => {
			console.log("Server responded");
			let str = response['decoded'];
			console.log(atob(str));
		});
	}

	onDrop = async file => {
		await this.setState({ filepath: file });
		console.log(this.state.filepath);
	}

	render() {
	  return(
	  <React.Fragment>
	  <div id="dropdiv">
	  <Dropzone onDrop={this.onDrop}>
 		 {({getRootProps, getInputProps, isDragActive}) => (
    		<div id="dropper" {...getRootProps()}>
      		<input {...getInputProps()} />
      		{isDragActive ? "Drop your file here!" : 'Click here or drag a file to upload!'}
    		</div>
  		)}
	  </Dropzone>
	  </div>
	  <div id="selectWrapper">
	  <input id="message" type="text" onChange={() => {this.updateMessage()}}/>
	  {/*<input id="inf" type="file" name="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.updateFile}/>*/}
	  <button id="f" type="submit" className="file-submit" onClick={() => { this.uploadFile() }}>Submit File</button>
	  </div>
	  <div id="selectWrapper2">
	  <input id="inf2" type="file" name="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.updateDecode}/>
	  <button id="f2" type="submit" className="file-submit" onClick={() => { this.uploadDecode() }}>Decode File</button>
	  </div>
	</React.Fragment>);
	}
}

class Heading extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return(
		<div id="heading">
		FireFilm
		</div>
		);
	}
}

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return(
		<div id="page">
		<Heading />
		//<canvas id="img" src="" height="0px" width="0px"></canvas>
		<Selector />
		</div>
		);
	}
}

function Page() {
	return(
	<React.Fragment>
	<Main />
	</React.Fragment>
	);
}

ReactDOM.render(<Page />, document.getElementById('root'));
