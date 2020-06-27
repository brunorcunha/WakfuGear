import Vue from 'vue'
import Router from 'vue-router'
import View from '../views/View'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/:id',
    redirect: '/'
  }, {
    path: '/',
    component: View
  }],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { x: 0, y: 0 }
  }
})

export default router
