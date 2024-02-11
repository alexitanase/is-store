import {defineStore} from 'pinia'

export const cartStore = defineStore(
  'Cart',
  {
    state: () => ({
      products: [],
      checkoutToken: ""
    }),
    actions: {

    },
    persist: {
      storage: sessionStorage,
    }
  }
)