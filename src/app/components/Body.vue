<template>
  <div class="application-sales-body">

    <div class="application-sales-body-form">

      <div v-if="generalStore().actualStep === 1" class="application-sale-body-select-product">

        <b-container v-if="generalStore().showMessageCart">
          <b-row>
            <b-col>
              <div class="alert alert-info mt-3 mb-3">Product added to cart. &nbsp; <b-button v-on:click="generalStore().actualStep = 3">View cart</b-button></div>
            </b-col>
          </b-row>
        </b-container>

        <b-container>
          <b-row v-if="Settings.filters">
            <b-col cols="12" md="4">
              <b-input-group prepend="@" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input v-model="Filters.SearchByName" placeholder="Search..."></b-form-input>
              </b-input-group>
            </b-col>
            <b-col cols="12" md="4">

            </b-col>
            <b-col cols="12" md="4">
              <b-form-select v-model="Filters.OrderBy" :options="Filters.OrderByOptions"></b-form-select>
            </b-col>
          </b-row>
          <b-row class="mt-4">
            <product-layout v-for="Product in Products" v-bind:Product="Product" :entity="entity"></product-layout>
          </b-row>
        </b-container>

      </div>

      <div v-if="generalStore().actualStep === 2" class="application-sale-body-product-details">
        <p>product details</p>
      </div>

      <div v-if="generalStore().actualStep === 3" class="application-sale-body-cart">

        <cart-layout
          :entity="entity"
        ></cart-layout>

      </div>

      <div v-if="generalStore().actualStep === 4" class="application-sale-body-checkout">
        <p>checkout</p>
      </div>

      <div v-if="generalStore().actualStep === 5" class="application-sale-body-payment-method">
        <p>Confirmation</p>
      </div>

      <div v-if="generalStore().actualStep === 6" class="application-sale-body-payment-method">
        <p>Error</p>
      </div>

    </div>
  </div>
</template>

<script>
import {Settings} from "../../config/Settings";
import {RequestApi} from "../../utils/RequestApi";
import ProductLayout from "./elements/Product.vue";
import {generalStore} from "../../stores/general.store";
import CartLayout from "./elements/Cart.vue";

export default {
  name: "body-layout",
  components: {CartLayout, ProductLayout},
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
      TimerReloadProducts: null,
      Filters: {
        SearchByName: "",
        OrderBy: "opt0",
        OrderByOptions: [
          { value: "opt0", text: "Default" },
          { value: "opt1", text: "Price <" },
          { value: "opt2", text: "Price >" },
          { value: "opt3", text: "Name a-z" },
          { value: "opt4", text: "Name z-a" }
        ]
      },
      Products: [
        {
          Id: 0,
          Demo: true,
          Name: '',
          Picture: '',
          Price: 0,
        },
        {
          Id: 0,
          Demo: true,
          Name: '',
          Picture: '',
          Price: 0,
        },
        {
          Id: 0,
          Demo: true,
          Name: '',
          Picture: '',
          Price: 0,
        },
        {
          Id: 0,
          Demo: true,
          Name: '',
          Picture: '',
          Price: 0,
        }
      ]
    }
  },
  methods: {
    generalStore,
    async getProducts(){
      let Request = new RequestApi();
      Request.baseUrl = 'http://widget.anvil.test/';
      Request.add_header('Entity', Settings.entity);

      let Data = {};
      if(this.Filters.SearchByName !== ''){
        Data['k'] = this.Filters.SearchByName;
      }

      let response = await Request.doAsync({
        method: "get",
        url: "api/products",
        data: Data
      });

      if(response.Error){
        return false;
      }

      this.Products = response.Message;
    }
  },
  async beforeMount(){
    await this.getProducts();
  },
  watch: {
    'Filters.OrderBy'() {
      switch (this.Filters.OrderBy) {
        case "opt1":
          this.Products.sort((a,b) => a.Price - b.Price);
          break;
        case "opt2":
          this.Products.sort((a,b) => b.Price - a.Price);
          break;
        case "opt4":
          this.Products.sort((a,b) => b.Name.localeCompare(a.Name));
          break;
        default:
          this.Products.sort((a,b) => a.Name.localeCompare(b.Name));
      }
    },
    'Filters.SearchByName'() {
      clearTimeout(this.TimerReloadProducts);
      this.TimerReloadProducts = setTimeout(this.getProducts, 500);
    }
  }
}
</script>

<style scoped>
.application-sale-body-customer-details,
.application-sale-body-payment-method{
  padding: 10px 5px;
}
</style>