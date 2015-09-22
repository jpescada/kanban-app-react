require('./stylesheets/main.css');

import alt from './libs/alt';
import storage from './libs/storage';
import persist from './libs/persist';
import React from 'react';
import App from './components/App.jsx';

main();

function main(){

	persist( alt, storage, 'app');

	const app =  document.createElement('div');

	document.body.appendChild(app);

	React.render(<App />, app);
}