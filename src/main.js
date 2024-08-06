import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from './plugins';
import axios from 'axios';

const app = createApp(App);

app.config.globalProperties.$http = axios;

registerPlugins(app);

app.mount('#app');
