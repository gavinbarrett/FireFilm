import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import {useDropzone} from 'react-dropzone';
import ajax from 'superagent';

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
/* const [filepath, changeFile] = useState(null);

	updateFile = event => {
		// update the filepath
		changeState(prevState => {
			return {
				...prevState,
				filepath: event.target.files[0]
			}
		});
	}

	updateDecode = event => {
		// update the filepath
		changeState(prevState => {
			return {
				...prevState,
				decodepath: event.target.files[0]
			}
		});
	}

	updateMessage = message => {
		let x = document.getElementById("message").value;
		changeState(prevState => {
			return {
				...prevState,
				message: x
			}
		});
	}
*/
	awaitResponse = async (path) => {
		alert(this.state.filepath);
		let formData = new FormData();
		formData.append('file', this.state.filepath);
		const resp = await fetch(path, { method: "POST", body: formData });
		return await resp.json();
	}

	startDownload = (str, filename) => {
		let dl_elem = document.createElement('a');
		dl_elem.setAttribute('href', str);
		dl_elem.setAttribute('download', filename);
		dl_elem.style.display = 'none';
		document.body.appendChild(dl_elem);
		dl_elem.click();
		document.body.removeChild(dl_elem);
	}

	getFileHash = (str) => {
		let b64str = str.slice(22, str.length);
		let x = atob(b64str);
		const st = new Uint8Array(x);
		let hash = crypto.createHash('sha256')
			.update(st)
			.digest('hex');
		return hash + '.png';
	}

	uploadFile = async () => {
		/* send image with POST request */
		await this.awaitResponse('/upload')
			.then(response => {
			let str = response['enc'];
			if (str == "None")
				return;
			//let canvas = document.getElementById("img");
			//let context = canvas.getContext('2d')
			let fp = this.getFileHash(str);
			this.startDownload(str, fp);
		});
	}

	uploadDecode = async () => {
		/* send image with POST request */		
		let imgData = new FormData();
		// append append file to the FormData
		imgData.append("file", state.decodepath);
		// send AJAX POST request to server
		await this.awaitResponse(imgData, '/decode')
			.then(response => {
			let str = response['decoded'];
			console.log(atob(str));
		});
	}

	onDrop = async file => {
		console.log('calling onDrop');
		console.log(file[0]);
		await this.setState({ filepath: file[0] });
	};

	render() {
	return(
	<React.Fragment>
	<div id="dropdiv">
	<Dropzone id="dropping" accept="image/*" onDrop={file => this.onDrop(file)}>
 		{({getRootProps, getInputProps, isDragActive}) => (
    	<div id="dropper" {...getRootProps()}>
      	<input type="file" {...getInputProps()} />
      	{isDragActive ? "Drop your file here!" : 'Click here or drag a file to upload!'}
    	</div>
  	)}
	 </Dropzone>
	 </div>
	 <div id="selectWrapper">
	 <input id="message" type="text" onChange={() => this.updateMessage()}/>
	 <button id="f" type="submit" className="file-submit" onClick={() => this.uploadFile()}>Submit File</button>
	 </div>
	 <div id="selectWrapper2">
	 <input id="inf2" type="file" name="file" accept="image/x-png,image/gif,image/jpeg" onChange={(e) => this.updateDecode(e)}/>
	 <button id="f2" type="submit" className="file-submit" onClick={() => this.uploadDecode()}>Decode File</button>
	 </div>
	</React.Fragment>);
	}
}

function Heading() {
	return(
		<div id="heading">
		FireFilm
		</div>
	);
}

function Main() {
	return(
		<div id="page">
		<Heading />
		<Selector />
		</div>
	);
}

function Page() {
	return(
		<React.Fragment>
		<Main />
		</React.Fragment>
	);
}

ReactDOM.render(<Page/>, document.getElementById('root'));
