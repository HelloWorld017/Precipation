const {app, screen} = require('electron');
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
		this.widgetBaseDir = path.resolve('./widgets');
		this.initWidgets();
		this.displays = screen.getAllDisplays().map(v => new Display(v));
		this.displays.forEach(v => v.createWindow());
	}

	initWidgets() {
		const widgets = store.state.widgets;
		for(widget of widgets) {
			try {
				const widgetDir = this.getWidgetDirectory(widget.id);
				const widgetDescription = fs.readFileSync(JSON.parse(path.resolve(widgetDir, 'precipation.json')));

				const widget = new Widget(this, widgetDescription, widget);
				widget.createWindow();

			} catch(e) {
				this.log(widget.id, 'error', e.stack);
			}
		}
	}

	getWidgetDirectory(id) {
		return path.resolve(this.widgetBaseDir, id);
	}

	log(widgetName, level, content) {
		console.log(`[${level.toUpperCase()}] ${widgetName} :: ${content}`);
	}
}

module.exports = Precipation;
