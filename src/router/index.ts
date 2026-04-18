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
      meta: { title: 'Personal Statement Pro — Free AI Personal Statement Analyzer & Writer' },
    },
    {
      path: '/analyzer',
      name: 'analyzer',
      component: () => import('../views/StatementAnalyzer.vue'),
      meta: { title: 'Free Personal Statement Analyzer — AI Feedback & Rewrites | Personal Statement Pro' },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogList.vue'),
      meta: { title: 'Personal Statement Tips & Career Advice Blog | Personal Statement Pro' },
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../views/BlogPost.vue'),
      meta: { title: 'Blog | Personal Statement Pro' },
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('../views/JobProspects.vue'),
      meta: { title: 'Remote Job Prospects — Salary, Skills & Career Paths | Personal Statement Pro' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutPage.vue'),
      meta: { title: 'About Us — Our Mission to Make Career Guidance Accessible | Personal Statement Pro' },
    },

  ],
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = title
  }
})

export default router
