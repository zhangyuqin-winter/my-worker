import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import uCharts from '@qiun/ucharts'

export function createApp() {
	const app = createSSRApp(App);
	
	app.component('qiun-ucharts',uCharts)
	return {
		app,
	};
}
