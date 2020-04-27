import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Model from './components/Model.vue'
import Hello from './components/Hello.vue'
Vue.use(Router)

const router = new Router({
 routes: [
   {
     path: '/',
     name:'home',
     component: Hello,
   },
   {
     path: '/model/:id',
     name:'model',
     component: Model,
     props: true,
   },
 ]
})

new Vue({
 el: '#app',
 render: h => h(App),
 router
})
