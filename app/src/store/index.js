const Vue = require('vue');
const Vuex = require('vuex');

Vue.use(Vuex);

module.exports () => {
	const store = new Vuex.Store({
		state: {
			widgets: []
		},

		mutations: {
			widget(state, payload) {
				if(payload.id) {
					//Modify existing widget
					const widget = state.widgets.find(v => v.id === payload.id);
					if(!widget) return;

					Object.keys(payload)
						.filter(key => key !== 'id')
						.forEach(key => widget[key] = payload[key]);

					return;
				}

				//Add new widget
				state.widgets.push(payload);
			},

			removeWidget(state, id) {
				const widgetIndex = state.widgets.findIndex(v => v.id === id);
				if(widgetIndex < 0) return;

				state.widgets.splice(widgetIndex, 1);
			}
		}
	});

	return store;
};
