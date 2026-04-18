import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
    },
    {
      path: '/analyzer',
      name: 'analyzer',
      component: () => import('../views/StatementAnalyzer.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogList.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../views/BlogPost.vue'),
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('../views/JobProspects.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutPage.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthPage.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfilePage.vue'),
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('../views/PricingPage.vue'),
    },

  ],
})

export default router
