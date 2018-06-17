const {BrowserWindow} = require('electron');
const {getWindowOptions, setBottomMost} = require('./window');
const os = require('os');

class Display {
	constructor(display) {
		this.id = display.id;
		this.x = display.bounds.x;
		this.y = display.bounds.y;
		this.width = display.bounds.width;
		this.height = display.bounds.height;
	}

	createWindow() {
		this.displayWindow = new BrowserWindow(getWindowOptions(this));
		this.displayWindow.setMenu(null);
		this.diplayWindow.loadURL(path.resolve(__dirname, '..', 'precipation.html'));
		this.displayWindow.show();

		setBottomMost(this.displayWindow);
	}

	hostWidget(widget) {
		//TODO implement multiwidgetview
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
