const {getWindowOptions, setBottomMost} = require('./window');

class Widget {
	constructor(precipation, description, config) {
		this.config = config;
		this.description = description;
		this.id = this.description.id;
		this.x = config.x || 0;
		this.y = config.y || 0;
		this.width = config.width !== undefined ? config.width : description.desired_size.width;
		this.height = config.height !== undefined ? config.height : description.desired_size.height;
		this.precipation = precipation;
		this.directory = precipation.getWidgetDirectory(config.id);

		if(description.script) {
			const ScriptClass = require(path.resolve(this.directory, description.script));
			this.script = new ScriptClass(this, config);
			this.updateTick = script.updateTick;
			this.update();
		}
	}

	createWindow() {
		if(!this.description.individual) {
			const display = this.precipation.displays.find(v => v.isWidgetInDisplay(this));
			display.hostWidget(this);

			this.hostingDisplay = display;
			return;
		}

		let options = getWindowOptions(this, `Precipation Widget Layer (${this.description.name})`);
		if(this.script && this.script.onInit) options = this.script.onInit(options);

		this.window = new BrowserWindow(options);
		if(this.script && this.script.onLoaded) this.script.onLoaded(this.window);

		this.window.setMenu(null);
		this.window.loadURL(path.resolve(this.directory, this.description.main));
		this.window.show();
		setBottomMost(this.window);
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
			id: this.id,
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
