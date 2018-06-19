const {BrowserWindow} = require('electron');
const {getWindowOptions, setBottomMost} = require('./window');
const path = require('path');

class Widget {
	constructor(precipation, description, config) {
		this.precipation = precipation;
		this.directory = precipation.getWidgetDirectory(config.typeId);
		this.config = config;
		this.description = description;
		this.typeId = description.id;
		this.id = config.id;
		this.x = config.x || 0;
		this.y = config.y || 0;
		this.width = config.width !== undefined ? config.width : description.desired_size.width;
		this.height = config.height !== undefined ? config.height : description.desired_size.height;

		this.processSize('width');
		this.processSize('height');

		if(description.script) {
			const ScriptClass = require(path.resolve(this.directory, description.script));
			this.script = new ScriptClass(this, config);
			this.updateTick = script.updateTick;
			this.update();
		}
	}

	createWindow() {
		if(!this.description.individual) {
			const display = this.getDisplay();
			display.hostWidget(this);

			this.hostingDisplay = display;
			return;
		}

		let options = getWindowOptions(this, `Precipation Widget Layer (${this.description.name})`);
		if(this.script && this.script.onInit) options = this.script.onInit(options);

		this.window = new BrowserWindow(options);
		if(this.script && this.script.onLoaded) this.script.onLoaded(this.window);

		this.window.webContents.on('crashed', (event, errorCode, description) => {
			this.precipation.log(this.typeId, 'error', description);
		});

		this.window.webContents.on('did-finish-load', (err) => {
			this.precipation.log(this.typeId, 'info', "Widget Layer Page loaded successfully!");
		});

		this.window.setMenu(null);
		this.window.show();
		this.window.loadURL(this.resolveUrl(this.description.main));
		setBottomMost(this.window);

		if(this.description.click_through) {
			this.window.setIgnoreMouseEvents(true);
		}

		this.precipation.log(this.typeId, 'info', "Created Individual Widget Layer.");
	}

	resolveUrl(url) {
		if(this.description.use_file_protocol) {
			return path.resolve(this.directory, url);
		}

		return `precipation://${this.typeId}/${url}`;
	}

	getDisplay() {
		return this.precipation.displays.find(v => v.isWidgetInDisplay(this));
	}

	processSize(name) {
		if(typeof this[name] === 'string') {
			const match = this[name].match(/^((?:\d|\.)+)(px|%)$/);

			if(!match) {
				this[name] = 300;
				this.precipation.log(this.typeId, 'error', `Invalid property: ${name}`);
			} else {
				if(match[2] === '%') {
					this[name] = Math.round(this.getDisplay()[name] * parseFloat(match[1]) / 100);
				} else {
					this[name] = parseInt(match[1]);
				}
			}
		}
	}

	destroy() {
		if(this.hostingDisplay) {
			this.hostingDisplay.removeWidget(this);
			this.hostingDisplay = null;
		}

		if(this.script && this.script.onDestroy) {
			this.script.onDestroy();
		}

		this.script = null;

		if(this.window) {
			this.window.close();
			this.window = null;
		}
	}

	update() {
		if(this.script && this.script.onUpdate) this.script.onUpdate();

		if(this.updateTick) setTimeout(() => this.onUpdate(), this.updateTick);
	}

	saveConfig() {
		let config = {
			typeId: this.typeId,
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.height
		};

		if(this.script && this.script.onSave) config = this.script.onSave(config);

		this.precipation.store.commit('widget', config);
	}
}

module.exports = Widget;
