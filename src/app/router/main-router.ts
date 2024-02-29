import { createRouter, createWebHashHistory } from 'vue-router'

import Products from '../components/pages/Products.vue'
import ProductDetails from '../components/pages/ProductDetails.vue'
import Cart from '../components/pages/Cart.vue'
import Checkout from '../components/pages/Checkout.vue'
import Operation from '../components/pages/OperationDetails.vue'

const routes = [
  { path: '/', component: Products },
  { path: '/product/:id', component: ProductDetails },
  { path: '/cart', component: Cart },
  { path: '/checkout', component: Checkout },
  { path: '/operation/:token', component: Operation },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;