class Selector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filepath: undefined
		};
	}
	componentDidMount() {
		console.log('Mounted');
	}
	updateFile(file) {
		this.setState({ filepath: file });
	}
	uploadFile(file) {
		console.log(file);

		//let fd = new FormData();

		//fd.append('upFile', e);

		//fetch('/upload', {method: 'POST', body: fd});
	}
	render() {
		return React.createElement(React.Fragment, null, React.createElement("div", { id: "selectWrapper" }, React.createElement("input", { id: "inf", type: "file", name: "file", accept: "image/x-png,image/gif,image/jpeg", onChange: event => updateFile(event.target.files[0]) }), React.createElement("button", { id: "f", type: "submit", className: "file-submit", onClick: uploadFile(this.state.filepath) }, "Submit File"), "/* upload an image to the server */ //let e = document.getElementById('inf'); //console.log(e); //let filename = e.value.split(\"\\\\\").reverse()[0];"));
	}
}

function Page() {
	return React.createElement(React.Fragment, null, React.createElement("div", { id: "page" }, React.createElement("p", null, "Hello"), React.createElement(Selector, null)));
}

function openRequest(method, url) {
	/* open a request object for AJAX */
	let xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	return xhr;
}

ReactDOM.render(React.createElement(Page, null), document.getElementById('root'));