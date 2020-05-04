class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filepath: null,
		};
	}
	componentDidMount() {
	}
	updateFile = event => {
		// update the filepath
		this.setState({ filepath: event.target.files[0] });
	}
	uploadFile = () => {
		// send image with POST request
		console.log("Current file: " + this.state.filepath.name);
		
		let imgData = new FormData();
		imgData.append("file", this.state.filepath, this.state.filepath.name);
		//imgData.append("file", this.state.filepath, "error.png");
		fetch('/upload', { method: "POST", body: imgData })
			.then(response => console.log(response));
	}
	render() {
	  return(
	  <div id="selectWrapper">
	  <input id="inf" type="file" name="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.updateFile}/>
	  <button id="f" type="submit" className="file-submit" onClick={() => { this.uploadFile() }}>Submit File</button>
	  </div>);
	}
}

function Page() {
	return(<React.Fragment>
	<div id="page">
	<Selector />
	</div>
	</React.Fragment>);
}

ReactDOM.render(<Page />, document.getElementById('root'));
