import { createRouter, createWebHashHistory } from 'vue-router'
import { requireAuth, requireGuest } from './guards'

import HomeView from '@/views/HomeView.vue'

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import StorefrontLayout from '@/layouts/StorefrontLayout.vue'

// Auth views
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

// Dashboard views — lazy loaded
const OverviewView    = () => import('@/views/dashboard/OverviewView.vue')
const ProductsView    = () => import('@/views/dashboard/ProductsView.vue')
const OrdersView      = () => import('@/views/dashboard/OrdersView.vue')
const StorefrontView  = () => import('@/views/dashboard/StorefrontView.vue')
const AnalyticsView   = () => import('@/views/dashboard/AnalyticsView.vue')
const SettingsView    = () => import('@/views/dashboard/SettingsView.vue')

// Storefront views — lazy loaded
const StoreHomeView     = () => import('@/views/storefront/StoreHomeView.vue')
const ProductDetailView = () => import('@/views/storefront/ProductDetailView.vue')
// const CartView          = () => import('@/views/storefront/CartView.vue')
// const CheckoutView      = () => import('@/views/storefront/CheckoutView.vue')
// const OrderSuccessView  = () => import('@/views/storefront/OrderSuccessView.vue')

// 404
// const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  {
   path: '/',
   component: HomeView
  },
  // ─── Auth ───────────────────────────────────────────────
  {
    path: '/auth',
    component: AuthLayout,
    beforeEnter: requireGuest,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
        meta: { title: 'Login — Kweek' },
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterView,
        meta: { title: 'Create account — Kweek' },
      },
      {
        path: '',
        redirect: { name: 'Login' },
      },
    ],
  },

  // ─── Seller dashboard (protected) ───────────────────────
  {
    path: '/dashboard',
    component: DashboardLayout,
    // beforeEnter: requireAuth,
    children: [
      {
        path: '',
        redirect: { name: 'Overview' },
      },
      {
        path: 'overview',
        name: 'Overview',
        component: OverviewView,
        meta: { title: 'Overview — Kweek' },
      },
      {
        path: 'products',
        name: 'Products',
        component: ProductsView,
        meta: { title: 'Products — Kweek' },
      },
      {
        path: 'orders',
        name: 'Orders',
        component: OrdersView,
        meta: { title: 'Orders — Kweek' },
      },
      {
        path: 'storefront',
        name: 'Storefront',
        component: StorefrontView,
        meta: { title: 'My Storefront — Kweek' },
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: AnalyticsView,
        meta: { title: 'Analytics — Kweek' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsView,
        meta: { title: 'Settings — Kweek' },
      },
    ],
  },

  // // ─── Buyer storefront (public) ──────────────────────────
  {
    path: '/store/:sellerId',
    component: StorefrontLayout,
    children: [
      {
        path: '',
        name: 'StoreHome',
        component: StoreHomeView,
        meta: { title: 'Shop' },
      },
      {
        path: 'product/:productId',
        name: 'ProductDetail',
        component: ProductDetailView,
        meta: { title: 'Product' },
      },
      // {
      //   path: 'cart',
      //   name: 'Cart',
      //   component: CartView,
      //   meta: { title: 'Cart' },
      // },
      // {
      //   path: 'checkout',
      //   name: 'Checkout',
      //   component: CheckoutView,
      //   meta: { title: 'Checkout' },
      // },
      // {
      //   path: 'order/success',
      //   name: 'OrderSuccess',
      //   component: OrderSuccessView,
      //   meta: { title: 'Order placed' },
      // },
    ],
  },

  // ─── Root redirect ───────────────────────────────────────
  {
    path: '/',
    redirect: { name: 'Login' },
  },

  // ─── 404 ────────────────────────────────────────────────
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: NotFoundView,
  //   meta: { title: '404 — Kweek' },
  // },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

// ─── Global page title handler ───────────────────────────
router.afterEach((to) => {
  document.title = to.meta.title || 'Kweek'
})

export default router