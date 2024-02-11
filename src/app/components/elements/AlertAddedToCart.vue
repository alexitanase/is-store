<template>
  <b-row v-if="generalStore().showMessageCart">
    <b-col>
      <div class="alert alert-info mt-3 mb-3">Product added to cart. &nbsp; <b-button v-on:click="generalStore().actualStep = 3">View cart</b-button></div>
    </b-col>
  </b-row>
</template>

<script>
import {generalStore} from "../../../stores/general.store";
import {cartStore} from "../../../stores/cart.store";
import Currencies from "../../../utils/Currencies";

export default {
  name: "alert-added-to-cart-layout",
  components: {},
  computed: {
    generalStore(){
      return generalStore;
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>