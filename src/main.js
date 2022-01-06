import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Router from "vue-router";
Vue.use(ElementUI);
Vue.config.productionTip = false;

function logout() {
  console.log("logout");
  window.localStorage.removeItem("userId");
  window.localStorage.removeItem("userPhone");
  window.localStorage.removeItem("username");
  window.localStorage.removeItem("userRole");
}

// logout();

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
