<template>
  <div class="application-sales">

    <header-layout
      v-if="!error.status && Settings.header"
      :entity="entity"
    ></header-layout>

    <body-layout
      v-if="!error.status"
      :entity="entity"
    ></body-layout>

    <div v-if="error.status" class="application-sales-error text-center">
      {{ error.message }}
    </div>

    <footer-layout v-if="Settings.footer"></footer-layout>

  </div>
</template>

<script>

import FooterLayout from "../components/Footer.vue";
import HeaderLayout from "../components/Header.vue";
import {RequestApi} from "../../utils/RequestApi";
import {Settings} from "../../config/Settings";
import BodyLayout from "../components/Body.vue";
import {cartStore} from "../../stores/cart.store";

export default {
  name: "base-layout",
  components: {
    BodyLayout,
    HeaderLayout,
    FooterLayout

  },
  data() {
    return {
      CartDetails: {},
      error: {
        status: false,
        message: ''
      },
      entity: {
        Name: '',
        Description: '',
        Currency: {
          Name: '',
          Code: '',
          Decimal: 2
        }
      }
    }
  },
  methods: {
    async getEntityDetails() {
      let Request = new RequestApi(Settings.endpoint);
      Request.add_header('Entity', Settings.entity);
      let response = await Request.doAsync({
        method: "get",
        url: "api/details",
      });

      if(response.Error){
        this.error.status = true;
        this.error.message = response.Message;
        return false;
      }

      this.entity.Name = response.Message.Name;
      this.entity.Description = response.Message.Description;
      this.entity.Currency = response.Message.Currency;
    }
  },
  async beforeMount() {
    await this.getEntityDetails();
    this.CartDetails = cartStore().products;
  },
  computed: {
    Settings() {
      return Settings
    }
  }
}
</script>

<style>
.application-sales {
  background: #fff;
  border-left: 1px solid #dcdcdc;
  border-right: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
  border-top: 1px solid #dcdcdc;
  width: 100%;
  max-width: 1200px;
  margin: auto;
}
.application-sales > .application-sales-footer {
  border-top: 1px solid #dcdcdc;
  padding: 15px 10px;
}
.application-sales > .application-sales-header {
  border-bottom: 1px solid #dcdcdc;
  padding: 15px 10px;
}
.application-sales > .application-sales-header > img {
  max-height: 80px;
}
.application-sales > .application-sales-body,
.application-sales > .application-sales-error {
  padding: 15px 10px;
}
</style>