<template>
  <div class="application-sale-body-select-product">

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
      <b-row class="mt-4">
        <button  v-if="LoadMoreButton" v-on:click="loadMoreItems()" class="btn btn-outline-primary w-100">Load More</button>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import {generalStore} from "../../../stores/general.store";
import {cartStore} from "../../../stores/cart.store";
import {Settings} from "../../../config/Settings";
import {RequestApi} from "../../../utils/RequestApi";
import Currencies from "../../../utils/Currencies";
import ProductLayout from "../elements/Product.vue";
import AlertAddedToCartLayout from "../elements/AlertAddedToCart.vue";

export default {
  name: "products-page-layout",
  components: {AlertAddedToCartLayout, ProductLayout},
  props: ["entity"],
  computed: {
    Settings() {
      return Settings
    },
    Currencies() {
      return Currencies
    },
    generalStore(){
      return generalStore;
    },
    cartStore(){
      return cartStore;
    }
  },
  data() {
    return {
      MaxItems: 12,
      Page: 1,
      TimerReloadProducts: null,
      LoadMoreButton: false,
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
    async loadMoreItems(){
      this.Page++;
      await this.getProducts();
    },
    async getProducts(){
      let Request = new RequestApi(Settings.endpoint);
      Request.add_header('Entity', Settings.entity);

      let Data = {};
      if(this.Filters.SearchByName !== ''){
        Data['k'] = this.Filters.SearchByName;
      }

      Data['items'] = this.MaxItems;
      Data['page']  = this.Page;

      let response = await Request.doAsync({
        method: "get",
        url: "api/products",
        data: Data
      });

      if(response.Error){
        return false;
      }

      if(this.Page === 1){
        this.Products = response.Message;
      }else{
        this.Products =  [
            ...this.Products,
            ...response.Message
        ];
      }

      if(parseInt(response.Pages) > this.Page){
        this.LoadMoreButton = true;
      }else{
        this.LoadMoreButton = false;
      }
    }
  },
  async beforeMount() {
    // if(parseInt(Settings.product) !== 0){
    //   this.$router.push({ path: '/product/' + Settings.product });
    //   console.debug("Es necesario cargar pagina del producto.");
    // }

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
iframe {
  width: 100%;
  min-height: 600px;
}
</style>