const {BrowserWindow} = require('electron');
const {getWindowOptions, setBottomMost} = require('./window');
const os = require('os');
const path = require('path');

class Display {
	constructor(display) {
		this.id = display.id;
		this.x = display.bounds.x;
		this.y = display.bounds.y;
		this.width = display.bounds.width;
		this.height = display.bounds.height;
	}

	createWindow() {
		return;
		this.displayWindow = new BrowserWindow(getWindowOptions(this));
		this.displayWindow.setMenu(null);
		this.displayWindow.loadURL(path.resolve(__dirname, '..', 'precipation.html'));
		this.displayWindow.show();

		setBottomMost(this.displayWindow);

		console.log("Created Display Layer.");
	}

	hostWidget(widget) {
		const viewSetting = {
			x: widget.x - this.x,
			y: widget.y - this.y,
			width: widget.width,
			height: widget.height
		};


	}

	removeWidget(widget) {
		//TODO implement multiwidgetview
	}

	isWidgetInDisplay(widget) {
		return (this.x <= widget.x && widget.x <= this.x + this.width) &&
			(this.y <= widget.y && widget.y <= this.y + this.height);
	}
}

module.exports = Display;
