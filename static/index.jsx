import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useDropzone } from 'react-dropzone';
import ajax from 'superagent';

const fs = require('fs');
const crypto = require('crypto');

function Selector() {
	
	const [filepath, changeFile] = useState(null);
	const [decfilepath, changeDecFile] = useState(null);
	const [message, changeMessage] = useState('');

	const updateFile = event => {
		// update the filepath
	}

	const updateMessage = async message => {
		// retrieve the input value
		let x = document.getElementById("message").value;
		// change state to the new value
		await changeMessage(x);
	}
	
	const awaitResponse = async (path) => {
		let formData = new FormData();
		formData.append('file', filepath);
		formData.append('message', message);
		const resp = await fetch(path, { method: "POST", body: formData });
		return await resp.json();
	}

	const startDownload = (str, filename) => {
		let dl_elem = document.createElement('a');
		dl_elem.setAttribute('href', str);
		dl_elem.setAttribute('download', filename);
		dl_elem.style.display = 'none';
		document.body.appendChild(dl_elem);
		dl_elem.click();
		document.body.removeChild(dl_elem);
	}

	const getFileHash = (str) => {
		let b64str = str.slice(22, str.length);
		let x = atob(b64str);
		const st = new Uint8Array(x);
		console.log(st);
		let hash = crypto.createHash('sha256')
			.update(st)
			.digest('hex');
		return hash + '.png';
	}

	const uploadFile = async () => {
		/* send image with POST request */
		await awaitResponse('/upload')
			.then(response => {
			let str = response['enc'];
			console.log(str);
			if (str == "None")
				return;
			//let canvas = document.getElementById("img");
			//let context = canvas.getContext('2d')
			let fp = getFileHash(str);
			startDownload(str, fp);
		});
	}

	const uploadDecode = async () => {
		/* send image with POST request */		
		let imgData = new FormData();
		// append append file to the FormData
		imgData.append("file", state.decodepath);
		// send AJAX POST request to server
		await awaitResponse(imgData, '/decode')
			.then(response => {
			let str = response['decoded'];
			console.log(atob(str));
		});
	}

	const onDrop = async file => {
		// FIXME: if encode flag is set, call updateFile
		// else call updateDecodeFile
		console.log('calling onDrop');
		console.log(file[0]);
		await changeFile(file[0]);
	};

	return(
	<React.Fragment>
	<Tabs>
	<TabList>
	<Tab>Encode</Tab>
	<Tab>Decode</Tab>
	</TabList>
	<div id="dropdiv">
	<Dropzone id="dropping" accept="image/*" onDrop={file => onDrop(file)}>
 		{({getRootProps, getInputProps, isDragActive}) => (
    	<div id="dropper" {...getRootProps()}>
      	<input type="file" {...getInputProps()} />
      	{isDragActive ? "Drop your file here!" : 'Click here or drag a file to upload!'}
    	</div>
  	)}
	 </Dropzone>
	 </div>
	 <TabPanel>
	 <div id="selectWrapper">
	 <input id="message" type="text" onChange={() => updateMessage()}/>
	 <button id="f" type="submit" className="file-submit" onClick={() => uploadFile()}>Submit File</button>
	 </div>
	 </TabPanel>
	 <TabPanel>
	 <div id="selectWrapper2">
	 <input id="inf2" type="file" name="file" accept="image/x-png,image/gif,image/jpeg" onChange={(e) => updateDecode(e)}/>
	 <button id="f2" type="submit" className="file-submit" onClick={() => uploadDecode()}>Decode File</button>
	 </div>
	 </TabPanel>
	 </Tabs>
	</React.Fragment>);
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
