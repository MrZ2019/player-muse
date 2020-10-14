import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Mp3List from '@/components/mp3-list'
import Star from '@/components/star'
import Lyric from '@/components/lyric'
import Scan from '@/components/scan'
import Album from '@/components/albumView'
import Rank from '@/components/rank'
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
      path: '/lyric',
      name: 'lyric',
      component: Lyric
    },
    {
      path: '/scan',
      name: 'scan',
      component: Scan
    },
    {
      path: '/album',
      name: 'album',
      component: Album
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },

    {
      path: '*',
      name: 'Mp3List',
      component: Mp3List
    },
  ]
})
