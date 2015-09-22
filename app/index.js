require('./stylesheets/main.css');

import alt from './libs/alt';
import storage from './libs/storage';
import persist from './libs/persist';
import React from 'react';
import App from './components/App.jsx';

main();

function main(){

	persist( alt, storage, 'app');

	if (process.env.NODE_ENV === 'production') {
		Rect.render(<App />, document.getElementById('app'));
	}

	if (process.env.NODE_ENV !== 'production') {
		const app =  document.createElement('div');

		document.body.appendChild(app);

		React.render(<App />, app);
	}
}