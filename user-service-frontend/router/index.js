import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import UserInfoPage from '@/components/UserInfoPage.vue'

const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  {
    path: '/user/:id',
    name: 'UserInfo',
    component: UserInfoPage,
    props: (route) => ({ 
      userData: route.params.userData 
    })
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router