import React from 'react';
import ReactDOM from 'react-dom';

function Page() {
	return React.createElement(
		React.Fragment,
		null,
		React.createElement(
			'div',
			null,
			React.createElement(
				'p',
				null,
				'Hello'
			)
		)
	);
}

ReactDOM.render(React.createElement(Page, null), document.getElementById('root'));