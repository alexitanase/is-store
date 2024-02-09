import {defineStore} from 'pinia'

export const generalStore = defineStore(
  'General',
  {
    state: () => ({
      actualStep: 0,
      showMessageCart: false
    }),
    actions: {
      currencyCodeSymbol(code) {
        switch (code) {
          case "EUR":
            return '&euro;';
          default:
            return code;
        }
      }
    },
    persist: {
      storage: sessionStorage,
    }
  }
)