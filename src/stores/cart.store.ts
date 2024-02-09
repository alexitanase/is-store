import {defineStore} from 'pinia'

export const cartStore = defineStore(
  'Cart',
  {
    state: () => ({
      products: []
    }),
    actions: {

    },
    persist: {
      storage: sessionStorage,
    }
  }
)