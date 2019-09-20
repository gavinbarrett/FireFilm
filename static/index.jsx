function Selector() {
	return(<React.Fragment>
	<div id="selectWrapper">
	<div>
	<input id="f" type="file"/>
	</div>
	<div>
	<button className="file-submit" onClick={uploadFile}>Submit File</button>
	</div>
	</div>
	</React.Fragment>);
}

function Page() {
	return(<React.Fragment>
	<div id="page">
	<p>Hello</p>
	<Selector />
	</div>
	</React.Fragment>);
}

function uploadFile() {
	/* upload an image to the server */
	let e = document.getElementById('f').value;
	let filename = e.split("\\").reverse()[0];
	
	let xhr = openRequest('POST', 'upload');
	let fd = new FormData();

	xhr.onload = () => {
		console.log("Returned from AJAX");
		let ob = JSON.parse(xhr.responseText);
		console.log(ob);
		alert(ob['hey']);
	}
	
	fd.append('upFile', filename);

	xhr.send(fd);
}

function openRequest(method, url) {
	/* open a request object for AJAX */
	let xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	return xhr;
}

ReactDOM.render(<Page />, document.getElementById('root'));
