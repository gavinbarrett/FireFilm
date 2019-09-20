function Selector() {
	return React.createElement(
		React.Fragment,
		null,
		React.createElement(
			"div",
			{ id: "selectWrapper" },
			React.createElement(
				"div",
				null,
				React.createElement("input", { id: "f", type: "file" })
			),
			React.createElement(
				"div",
				null,
				React.createElement(
					"button",
					{ className: "file-submit", onClick: uploadFile },
					"Submit File"
				)
			)
		)
	);
}

function Page() {
	return React.createElement(
		React.Fragment,
		null,
		React.createElement(
			"div",
			{ id: "page" },
			React.createElement(
				"p",
				null,
				"Hello"
			),
			React.createElement(Selector, null)
		)
	);
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
	};

	fd.append('upFile', filename);

	xhr.send(fd);
}

function openRequest(method, url) {
	/* open a request object for AJAX */
	let xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	return xhr;
}

ReactDOM.render(React.createElement(Page, null), document.getElementById('root'));