<template>
  <div class="application-sales-header">
    <b-container class="mb-3">
      <b-row>
        <b-col cols="12" md="6">
          <h1 class="mt-3 cursor-pointer" v-on:click="generalStore().actualStep = 1">{{ entity.Name }}</h1>
          <p class="mb-0" v-html="entity.Description"></p>
        </b-col>
        <b-col cols="12" md="6" class="position-relative">
          <div class="application-sale-cart" v-on:click="generalStore().actualStep = 3">
            <span>{{ getTotalItems() }}</span>
            <BIconCart />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {Settings} from "../../../config/Settings";
import {cartStore} from "../../../stores/cart.store";
import {generalStore} from "../../../stores/general.store";

export default {
  name: "header-layout",
  components: {},
  props: ["entity"],
  computed: {
    Settings() {
      return Settings
    },
    cartStore() {
      return cartStore;
    },
    generalStore() {
      return generalStore;
    }
  },
  data() {
    return {
      TotalItems: 0
    }
  },
  beforeMount() {

  },
  methods: {
    getTotalItems() {
      let total = 0;
      cartStore().products.forEach(function(v){
        total = parseInt(total + v.qty);
      })
      return total;
    }
  }
}
</script>

<style scoped>
.application-sale-cart {
  font-size:32px;
  position: absolute;
  top:50%;
  right: 15px;
  transform: translate(0, -50%);
  cursor: pointer;
}
.application-sale-cart > svg {
  z-index: 2;
}
.application-sale-cart > span {
  position: absolute;
  top:5px;
  right:4px;
  background: #c0c0c0;
  color:#000;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size:12px;
  opacity: 0.95;
  z-index: 1;
}
.cursor-pointer {
  cursor: pointer;
}
</style>