class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filepath: undefined,
		};
	}
	componentDidMount() {
		console.log('Mounted');
	}
	updateFile = (file) => {
		this.setState({ filepath: file });
	}
	uploadFile = (file) => {
		console.log(file);
	
		//let fd = new FormData();
	
		//fd.append('upFile', e);
	
		//fetch('/upload', {method: 'POST', body: fd});
	}
	render() {
	  return(
	  <div id="selectWrapper">
	  <input id="inf" type="file" name="file" accept="image/x-png,image/gif,image/jpeg" onChange={(event) => this.updateFile(event.target.files[0])}/>
	  <button id="f" type="submit" className="file-submit" onClick={this.uploadFile(this.state.filepath)}>Submit File</button>
	/* upload an image to the server */
	//let e = document.getElementById('inf');
	//console.log(e);
	
	//let filename = e.value.split("\\").reverse()[0];
	  </div>);
	}
}

function Page() {
	return(<React.Fragment>
	<div id="page">
	<p>Hello</p>
	<Selector />
	</div>
	</React.Fragment>);
}


function openRequest(method, url) {
	/* open a request object for AJAX */
	let xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	return xhr;
}

ReactDOM.render(<Page />, document.getElementById('root'));
