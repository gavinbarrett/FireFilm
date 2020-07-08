class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filepath: null,
			decodepath: null,
		};
	}

	componentDidMount() {}

	updateFile = event => {
		// update the filepath
		this.setState({ filepath: event.target.files[0] });
	}

	updateDecode = event => {
		// update the filepath
		this.setState({ decodepath: event.target.files[0] });
	}
	

	awaitResponse = async (imgData, path) => {
		const resp = await fetch(path, { method: "POST", body: imgData });
		return await resp.json();
	}

	clicked = () => {
		newst(n => 'green');
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

	uploadFile = () => {
		/* send image with POST request */		
		let imgData = new FormData();
		// append append file to the FormData
		imgData.append("file", this.state.filepath, this.state.filepath.name);
		// send AJAX POST request to server
		this.awaitResponse(imgData, '/upload')
			.then(response => {
			console.log("Server responded");
			
			let str = response['enc'];
			let canvas = document.getElementById("img");
			let context = canvas.getContext('2d')
			console.log(str);
			
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
			
			this.startDownload(str, 'newm.png');
			
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
	render() {
	  return(
	  <React.Fragment>
	  <div id="selectWrapper">
	  <input id="inf" type="file" name="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.updateFile}/>
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
		<canvas id="img" src="" height="0px" width="0px"></canvas>
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
