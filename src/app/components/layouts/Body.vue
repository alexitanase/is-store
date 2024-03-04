<template>
  <div class="application-sales-body">

    <div class="application-sales-body-form">

      <router-view :entity="entity" v-slot="{ Component }">
        <transition name="fade" mode="out-in" :duration="100">
          <component :is="Component" />
        </transition>
      </router-view>

      <div v-if="generalStore().actualStep === 7" class="application-sale-body-payment-method">
        <p>Confirmation</p>
      </div>

      <div v-if="generalStore().actualStep === 8" class="application-sale-body-payment-method">
        <p>Error</p>
      </div>

    </div>
  </div>
</template>

<script>
import {Settings} from "../../../config/Settings";
import {generalStore} from "../../../stores/general.store";

export default {
  name: "body-layout",
  components: {},
  props: ["entity"],
  computed: {
    Settings() {
      return Settings
    },
    generalStore() {
      return generalStore
    }
  },
  data() {
    return {

    }
  },
  methods: {

  },
  async beforeMount(){

  }
}
</script>

<style scoped>
.application-sale-body-customer-details,
.application-sale-body-payment-method{
  padding: 10px 5px;
}
</style>