import Vue from 'vue'
import Router from 'vue-router'
import MainFrame from '@/components/MainFrame'
import SideBar from '@/components/sidebar/SideBar'
import MenuBar from '@/components/MenuBar'

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
      path: '/menu',
      name: 'MenuBar',
      component: MenuBar
    }
  ]
})
