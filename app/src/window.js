let SetBottomMost = () => {};

if(os.platform() === 'win32') {
	SetBottomMost = require('electron-bottom-most').SetBottomMost;
}

module.exports.getWindowOptions = (object, title='Precipation Layer') => {
	return {
		width: object.width,
		height: object.height,
		x: object.x,
		y: object.y,
		skipTaskbar: true,
		frame: false,
		resizable: false,
		movable: false,
		transparent: true,
		title: title,
		type: os.platform() === 'win32' ? null : 'desktop',
		webPreferences: {
			webSecurity: false,
			allowRunningInsecureContent: true,
			experimentalFeatures: true,
			experimentalCanvasFeatures: true
		}
	};
};

module.exports.setBottomMost = (browserWindow) => {
	if(os.platform() === 'win32') {
		SetBottomMost(browserWindow.getNativeWindowHandle());
	}
};
