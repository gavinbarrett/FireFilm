class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filepath: null,
		};
	}

	componentDidMount() {}

	updateFile = event => {
		// update the filepath
		this.setState({ filepath: event.target.files[0] });
	}

	awaitResponse = async imgData => {
		const resp = await fetch('/upload', { method: "POST", body: imgData });
		return await resp.json();
	}

	uploadFile = () => {
		/* send image with POST request */		
		let imgData = new FormData();
		// append append file to the FormData
		imgData.append("file", this.state.filepath, this.state.filepath.name);
		// send AJAX POST request to server
		this.awaitResponse(imgData)
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
			});
	}
	render() {
	  return(
	  <div id="selectWrapper">
	  <input id="inf" type="file" name="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.updateFile}/>
	  <button id="f" type="submit" className="file-submit" onClick={() => { this.uploadFile() }}>Submit File</button>
	  </div>);
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
