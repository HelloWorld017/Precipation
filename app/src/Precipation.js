const {app, protocol, screen} = require('electron');
const fs = require("fs");
const makeStore = require("./store");
const path = require("path");
const {promisify} = require("util");

const {BrowserWindow} = require('electron');
const Display = require('./Display');
const Widget = require('./Widget');

class Precipation {
	constructor() {
		this.store = makeStore();
		this.registerProtocols();
		this.displays = screen.getAllDisplays().map(v => new Display(v));
		this.displays.forEach(v => v.createWindow());
		this.widgetBaseDir = path.resolve('./precipation/widgets');
		this.initWidgets();
	}

	initWidgets() {
		const widgets = this.store.state.widgets;
		for(let widgetConfig of widgets) {
			try {
				const widgetDir = this.getWidgetDirectory(widgetConfig.typeId);
				const widgetDescription = JSON.parse(fs.readFileSync(path.resolve(widgetDir, 'precipation.json')));

				const widget = new Widget(this, widgetDescription, widgetConfig);
				widget.createWindow();

			} catch(e) {
				this.log(widgetConfig.typeId, 'error', e.stack);
			}
		}
	}

	getWidgetDirectory(id) {
		return path.resolve(this.widgetBaseDir, id);
	}

	registerProtocols() {
		protocol.registerFileProtocol('precipation', (req, cb) => {
			const requestPath = req.url.substr(14).replace(/\?.*/, '').replace(/\#.*/, '');
			const responsePath = path.resolve(this.widgetBaseDir, requestPath);

			console.log("Protocol", req.url, "->", responsePath);
			cb(responsePath);
		}, err => err && console.error(err));
	}

	log(widgetName, level, content) {
		console.log(`[${level.toUpperCase()}] ${widgetName} :: ${content}`);
	}
}

module.exports = Precipation;
