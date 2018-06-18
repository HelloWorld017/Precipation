class MultiWidgetView {
	constructor() {
		this.widgets = [];
		this.view = document.querySelector('#precipation');
	}

	addWidget(src, viewSetting, config) {
		const widgetView = document.createElement('iframe');
		widgetView.src = src;
		widgetView.width = `${viewSetting.width}px`;
		widgetView.height = `${viewSetting.height}px`;
		widgetView.style.background = 'transparent';
		widgetView.style.border = 'none';
		widgetView.style.position = 'fixed';
		widgetView.style.top = `${viewSetting.y}px`;
		widgetView.style.left = `${viewSetting.x}px`;

		this.view.appendChild(widgetView);
		this.widgets.push({url, view: widgetView});
	}
}

module.exports = MultiWidgetView;
