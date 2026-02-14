import { createRouter, createWebHistory } from 'vue-router'

// Lazy load semua halaman supaya build lebih ringan
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../pages/ProductsPage.vue')
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../pages/TransactionsPage.vue')
  },
  {
    path: '/transaction-history',
    name: 'TransactionHistory',
    component: () => import('../pages/TransactionHistory.vue')
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../pages/Report.vue')
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
