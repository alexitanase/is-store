<template>
  <div class="application-sales-body">

    <div class="application-sales-body-form">

      <div v-if="generalStore().actualStep === 1" class="application-sale-body-select-product">

        <b-container>
          <alert-added-to-cart-layout />
        </b-container>

        <b-container>
          <b-row v-if="Settings.filters">
            <b-col cols="12" md="4">
              <label style="text-align: right;">Search product <BIconSearch /></label>
              <b-input-group prepend="@" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input v-model="Filters.SearchByName" placeholder="Search..."></b-form-input>
              </b-input-group>
            </b-col>
            <b-col cols="12" md="4">

            </b-col>
            <b-col cols="12" md="4">
              <label style="text-align: right;">Order by <BIconFilter /></label>
              <b-form-select v-model="Filters.OrderBy" :options="Filters.OrderByOptions"></b-form-select>
            </b-col>
          </b-row>
          <b-row class="mt-4">
            <product-layout v-for="Product in Products" v-bind:Product="Product" :entity="entity"></product-layout>
          </b-row>
        </b-container>

      </div>

      <div v-if="generalStore().actualStep === 2" class="application-sale-body-product-details">

        <product-details-layout
          :entity="entity"
        ></product-details-layout>

      </div>

      <div v-if="generalStore().actualStep === 3" class="application-sale-body-cart">

        <cart-layout
          :entity="entity"
        ></cart-layout>

      </div>

      <div v-if="generalStore().actualStep === 4" class="application-sale-body-checkout">

        <checkout-layout
          :entity="entity"
        ></checkout-layout>

      </div>

      <div v-if="generalStore().actualStep === 6" class="application-sale-body-payment-method">

        <payment-layout
          :entity="entity"
        ></payment-layout>

      </div>

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
import {Settings} from "../../config/Settings";
import {RequestApi} from "../../utils/RequestApi";
import ProductLayout from "./elements/Product.vue";
import {generalStore} from "../../stores/general.store";
import CartLayout from "./elements/Cart.vue";
import CheckoutLayout from "./elements/Checkout.vue";
import ProductDetailsLayout from "./elements/ProductDetails.vue";
import AlertAddedToCartLayout from "./elements/AlertAddedToCart.vue";
import PaymentLayout from "./elements/Payment.vue";

export default {
  name: "body-layout",
  components: {PaymentLayout, AlertAddedToCartLayout, ProductDetailsLayout, CheckoutLayout, CartLayout, ProductLayout},
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
          MinPerSale: 0,
          MaxPerSale: 0
        },
        {
          Id: 0,
          Demo: true,
          Name: '',
          Picture: '',
          Price: 0,
          MinPerSale: 0,
          MaxPerSale: 0
        },
        {
          Id: 0,
          Demo: true,
          Name: '',
          Picture: '',
          Price: 0,
          MinPerSale: 0,
          MaxPerSale: 0
        },
        {
          Id: 0,
          Demo: true,
          Name: '',
          Picture: '',
          Price: 0,
          MinPerSale: 0,
          MaxPerSale: 0
        }
      ]
    }
  },
  methods: {
    async getProducts(){
      let Request = new RequestApi(Settings.endpoint);
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
    if(parseInt(Settings.product) !== 0){
      generalStore().actualStep = 2;
      console.debug("Es necesario cargar pagina del producto.");
    }

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