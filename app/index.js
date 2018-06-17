const {app} = require('electron');

app.on('ready', () => {
	const Precipation = require('./src/Precipation');
	new Precipation;
});
