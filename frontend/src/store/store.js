import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		visible: true
	},
	mutations: {
		alterState(state, payload) {
			if (payload) {
				state.visible = payload;
			} else {
				state.visible = false;
			}
		}
	}
})
