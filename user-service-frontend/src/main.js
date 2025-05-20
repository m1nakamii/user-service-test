import { createApp } from 'vue';
import App from './App.vue';
import { provideApollo } from './apollo.ts';
import router from '/router';

const app = createApp(App);
provideApollo(app);
app.use(router);
app.mount('#app');