import Vue from 'vue'
import Router from 'vue-router'
import MainFrame from '@/components/MainFrame'
import SideBar from '@/components/SideBar'
import TextRegion from '@/components/TextRegion'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainFrame',
      component: MainFrame
    },
    {
      path: '/side',
      name: 'SideBar',
      component: SideBar
    },
    {
      path: '/text',
      name: 'TextRegion',
      component: TextRegion
    }
  ]
})
