<template>
  <div class="application-sale-body-product-details">

    <b-container v-show="!Loading">
      <b-row>
        <b-col col="12" md="4">
          <div class="picture-image">
            <img class="first-picture-product" v-if="Product.Picture !== '' && Product.Picture !== null" :src="Product.Picture" />
            <img class="first-picture-product" v-if="Product.Picture === '' || Product.Picture === null" :src="'assets/images/product-default.png'" />
          </div>
        </b-col>
        <b-col col="12" md="8">
          <h3>{{ Product.Name }}</h3>
          <span style="font-size:14px;">SKU: <b>{{ Product.ShortName }}</b></span>
          <br/>
          <span style="font-size:14px;">Category: <b>{{ Product.Category }}</b></span>
          <p class="product-price">
            {{ parseFloat(Product.SalePrice).toFixed(entity.Currency.Decimal) }} <span v-html="Currencies.symbolFormat(entity.Currency.Code)"></span>
          </p>
          <p class="text-success" v-if="Product.Stock > 0 || Product.Stock === -1">In stock</p>
          <div v-if="Product.MaxPerSale > 1">
            <b-form-select v-model="qtySelected" :options="qtyOptions" class="mb-3"></b-form-select>
          </div>
          <alert-added-to-cart-layout />
          <div>
            <b-button variant="warning" v-on:click="addToCart(Product)">Add to cart</b-button>
            &nbsp;
            <b-button variant="primary" v-on:click="addToCart(Product, 1)">Buy now</b-button>
          </div>
          <p class="mt-3">
            <BIconShare /> &nbsp; Share: &nbsp;
            <a :href="'https://twitter.com/share?url=' + getProductUrl()"  target="_blank"><BIconTwitterX /></a> &nbsp;
            <a :href="'https://www.facebook.com/sharer.php?u=' + getProductUrl()" target="_blank"><BIconFacebook /></a> &nbsp;
            <a :href="'https://telegram.me/share/?url=' + getProductUrl()" target="_blank"><BIconTelegram /></a> &nbsp;
            <!--          <a href="https://plus.google.com/share?url=http://localhost:8080/" target="_blank"><BIconGoogle /></a>-->
          </p>
          <div class="card mt-3">
            <div class="card-body text-center">
              <img :src="'assets/images/payment-icons.png'" />
              <br />
              Guaranteed Safe And Secure Checkout
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a class="nav-link active" href="#">Description</a>
            </li>
          </ul>
          <div  class="mb-4" v-html="Product.Description"></div>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-show="Loading">
      <b-row>
        <b-col col="12" md="6">
          <div class="picture-image">
            <b-skeleton-img aspect="3:1"></b-skeleton-img>
          </div>
        </b-col>
        <b-col col="12" md="6">
          <b-skeleton animation="wave" width="85%"></b-skeleton>
          <b-skeleton animation="wave" width="55%"></b-skeleton>
          <b-skeleton animation="wave" width="70%"></b-skeleton>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <b-skeleton animation="fade" width="85%"></b-skeleton>
          <b-skeleton animation="fade" width="55%"></b-skeleton>
          <b-skeleton animation="fade" width="70%"></b-skeleton>
        </b-col>
      </b-row>
    </b-container>

  </div>
</template>

<script>
import {generalStore} from "../../../stores/general.store";
import {cartStore} from "../../../stores/cart.store";
import Currencies from "../../../utils/Currencies";
import {RequestApi} from "../../../utils/RequestApi";
import {Settings} from "../../../config/Settings";
import AlertAddedToCartLayout from "../elements/AlertAddedToCart.vue";

export default {
  name: "product-details-layout",
  components: {AlertAddedToCartLayout},
  props: ["entity"],
  computed: {
    product() {
      return product
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
      qtySelected: 1,
      qtyOptions: [],
      Loading: false,
      Product: {
        Name: '',
        ShortName: '',
        Description: '',
        Picture: null,
        SalePrice: 0,
        Status: '',
        Category: '',
        MinPerSale: 1,
        MaxPerSale: 1,
        Stock: -1,
      }
    }
  },
  methods: {
    async getProductDetails() {
      let Request = new RequestApi(Settings.endpoint);
      Request.add_header('Entity', Settings.entity);
      let response = await Request.doAsync({
        method: "get",
        url: "api/products/" + this.$route.params.id,
      });

      if(response.Error){
        this.Loading = false;
        this.$router.push({ path: '/' });
        return false;
      }

      this.Product = response.Message;

      for (let mx = 0; mx < parseInt(this.Product.MaxPerSale); mx++){
        this.qtyOptions.push({
          value: (mx + 1),
          text: (mx + 1)
        })
      }

      this.Loading = false;
    },
    addToCart(product, checkout){

      let exists = -1;

      cartStore().products.forEach(function (v, i) {
        if(product.Id === v.id){
          exists = i;
        }
      })

      if(exists === -1){
        if(this.qtySelected >= product.MinPerSale && this.qtySelected <= product.MaxPerSale){
          cartStore().products.push({
            id: product.Id,
            qty: parseInt(this.qtySelected),
            name: product.Name,
            price: product.SalePrice,
            picture: product.Picture,
            available: -1
          })
        }else{
          cartStore().products.push({
            id: product.Id,
            qty: product.MinPerSale,
            name: product.Name,
            price: product.SalePrice,
            picture: product.Picture,
            available: -1
          })
        }
      }else{
        if(parseInt(product.MaxPerSale) > parseInt(cartStore().products[exists].qty)){
          cartStore().products[exists].qty++;
        }
      }

      generalStore().showMessageCart = true;

      if(typeof checkout !== 'undefined'){
        this.$router.push({ path: '/checkout' });
      }

      setTimeout(function(){
        generalStore().showMessageCart = false;
      }, 5000);

    },
    getProductUrl(){
      return window.location.toString();
    }
  },
  async beforeMount() {
    this.Loading = true;
    await this.getProductDetails();
  }
}
</script>

<style scoped>
p.product-price {
  font-size: 24px;
  font-weight: bold;
}
.picture-image {
  width: 100%;
  border: 1px solid #dcdcdc;
  border-radius: 7.5px;
  padding: 25px;
}
.picture-image > img {
  width: 100%;
}
</style>