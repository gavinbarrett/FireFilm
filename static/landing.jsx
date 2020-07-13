import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useDropzone } from 'react-dropzone';

const fs = require('fs');
const crypto = require('crypto');

function Selector() {
	
	const [filepath, changeFile] = useState(null);
	const [decfilepath, changeDecFile] = useState(null);
	const [message, changeMessage] = useState('');
	const [key, setKey] = useState(0);

	const updateMessage = async message => {
		// retrieve the input value
		let x = document.getElementById("message").value;
		// change state to the new message value
		await changeMessage(x);
	}
	
	const awaitEncode = async (path) => {
		let formData = new FormData();
		// append the image file
		formData.append('file', filepath);
		// append the secret message
		formData.append('message', message);
		// retrieve the encoded image
		const resp = await fetch(path, { method: "POST", body: formData });
		// return the image's base64
		return await resp.json();
	}
	
	const awaitDecode = async (path) => {
		let formData = new FormData();
		// append the encoded file
		formData.append('decfile', decfilepath);
		// retrieve the decoded message
		const resp = await fetch(path, { method: "POST", body: formData });
		// return the image's message
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
		const st = new Uint8Array(x.length);
		for (let i = 0; i < x.length; i++)
			st[i] = x[i];
		let hash = crypto.createHash('sha256')
			.update(st)
			.digest('hex');
		return hash + '.png';
	}

	const uploadFile = async () => {
		/* send image with POST request */
		await awaitEncode('/upload')
			.then(response => {
			let str = response['enc'];
			if (str == "None")
				return;
			// get the sha256 hash on the file
			let fp = getFileHash(str);
			// begin download of encoded file
			startDownload(str, fp);
		});
	}

	const uploadDecode = async () => {
		/* send image with POST request */		
		let imgData = new FormData();
		console.log('decfile');
		console.log(decfilepath);
		// append append file to the FormData
		imgData.append("decfile", decfilepath);
		// send AJAX POST request to server
		await awaitDecode('/decode')
			.then(response => {
			console.log(response);
			let str = response['decoded'];
			alert("The message is:\n" + atob(str));
		});
	}

	const onDrop = async file => {
		// update the appropriate file path based on the key
		(!key) ? await changeFile(file[0]) : await changeDecFile(file[0]);
	};

	

	return(
	<React.Fragment>
	<div id="selectorWrapper">
	<Tabs onSelect={k => setKey(k)}>
	<TabList>
	<Tab>Encode</Tab>
	<Tab>Decode</Tab>
	</TabList>
	<div id="dropwrapper">
	<div id="dropdiv">
	<Dropzone id="dropping" accept="image/*" onDrop={file => onDrop(file)}>
 		{({getRootProps, getInputProps, isDragActive, isDragReject, acceptedFiles}) => (
    	<div id="dropper" {...getRootProps()}>
      	<input type="file" {...getInputProps()} />
      	{!isDragActive && acceptedFiles.length == 0 && "Click here or drag a file to upload!"}
		{isDragActive && !isDragReject && "Drop your file here!"}
		{isDragActive && isDragReject && "Please enter an image file"}
		{acceptedFiles.length > 0 && !isDragActive && !isDragReject && acceptedFiles[0].name}
		</div>
  	)}
	 </Dropzone>
	 <TabPanel>
	 <div id="selectWrapper">
	 <input id="message" type="text" placeholder="Enter your message here" onChange={() => updateMessage()}/>
	 <button id="f" type="submit" className="file-submit" onClick={() => uploadFile()}>Submit File</button>
	 </div>
	 </TabPanel>
	 <TabPanel>
	 <div id="selectWrapper2">
	 <button id="f2" type="submit" className="file-submit" onClick={() => uploadDecode()}>Decode File</button>
	 </div>
	 </TabPanel>
	 </div>
	 </div>
	 </Tabs>
	 </div>
	</React.Fragment>);
}

function Heading() {
	return(
		<div id="heading">
		FireFilm
		</div>
	);
}

function LandingPage() {
	return(
		<React.Fragment>
		<div id="page">
		<Heading />
		<Selector />
		</div>
		</React.Fragment>
	);
}

ReactDOM.render(<LandingPage />, document.getElementById('root'));
