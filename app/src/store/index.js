const createPersistedState = require('vuex-persistedstate');
const fs = require('fs');
const Vue = require('vue');
const Vuex = require('vuex');

Vue.use(Vuex);

module.exports = () => {
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
		},

		plugins: [
			createPersistedState({
				storage: {
					getItem: key => {
						return fs.readFileSync('./precipation/config.json', 'utf8');
					},
					setItem: (key, value) => {
						if(key === '@@') return;
						fs.writeFileSync('./precipation/config.json', value);
					},
					removeItem: key => {
						if(key === '@@') return;
						fs.writeFileSync('./precipation/config.json', 'null');
					}
				}
			})
		]
	});

	return store;
};
