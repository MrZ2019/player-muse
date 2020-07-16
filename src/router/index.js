import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Mp3List from '@/components/mp3-list'
import Star from '@/components/star'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Mp3List',
      component: Mp3List
    },
    {
      path: '/mp3-list',
      name: 'Mp3List',
      component: Mp3List
    },
    {
      path: '/star',
      name: 'star',
      component: Star
    },
    {
      path: '*',
      name: 'Mp3List',
      component: Mp3List
    },
  ]
})
