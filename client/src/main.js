import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia, setActivePinia } from "pinia";

import "./assets/new.scss";
import "./assets/button.scss";
import "./assets/newV2.scss";

import Toaster from "@meforma/vue-toaster";

const app = createApp(App);
const pinia = createPinia();
setActivePinia(pinia);

app.use(pinia);
app.use(router);

app.use(Toaster).mount("#app");
