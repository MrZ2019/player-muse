// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import {apis} from './config'
import App from './App'
import router from './router'

import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import VueWorker from 'vue-worker'

Vue.use(VueWorker);

import './utils/plus.js'

Vue.config.productionTip = false

window.Hub = new Vue()

import store from './store';

import axios from 'axios';

Vue.prototype.$apis = apis;
Vue.prototype.$axios = axios;

import gallery from 'img-vuer'

Vue.use(gallery, {
  swipeThreshold: 150, // default 100
  isIndexShow: true, // show image index, default true
  useCloseButton: true, // trigger gallery close with close button, default true
  preload: true, // preload images in the same group, default true
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
