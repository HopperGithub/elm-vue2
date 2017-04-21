import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router/router';
import store from './store/';
import {routerMode} from './config/env';
import fastclick from 'fastclick';
import './config/rem';

Vue.use(VueRouter);
const router = new VueRouter({
	routes,
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production'
});

fastclick.attach(document.body);

new Vue({
	router,
	store,
}).$mount('#app');
