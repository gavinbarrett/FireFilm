import React from 'react';
import ReactDOM from 'react-dom';

function Page() {
	return(<React.Fragment>
	<div>
	<p>Hello</p>
	</div>
	</React.Fragment>);
}

ReactDOM.render(<Page />, document.getElementById('root'));
