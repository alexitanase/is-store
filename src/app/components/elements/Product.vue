<template>
  <b-col cols="12" md="4" class="application-sales-product mb-3">
    <div v-if="typeof Product.Demo !== 'undefined'">
      <b-skeleton-img animation></b-skeleton-img>
      <p class="application-sales-product-name">
        <b-skeleton animation width="85%" style="margin:auto;"></b-skeleton>
        <span><b-skeleton animation width="55%" style="margin:auto;margin-top:5px;"></b-skeleton></span>
      </p>
    </div>
    <div v-if="typeof Product.Demo === 'undefined'">
      <img v-if="Product.Picture !== '' && Product.Picture !== null" :src="Product.Picture" />
      <img v-if="Product.Picture === '' || Product.Picture === null" :src="'assets/images/product-default.png'" />
      <p class="application-sales-product-name">
        {{ Product.Name }}
        <span>{{ parseFloat(Product.Price).toFixed(parseInt(entity.Currency.Decimal)) }} <i v-html="currencyCodeSymbol(entity.Currency.Code)"></i></span>
      </p>
    </div>
    <b-button v-on:click="addToCart(Product)" variant="warning">
      Add to cart
    </b-button>
  </b-col>
</template>

<script>

import {cartStore} from "../../../stores/cart.store";
import {generalStore} from "../../../stores/general.store";

export default {
  name: "product-layout",
  props: ["Product", "entity"],
  methods: {
    currencyCodeSymbol(code) {
      switch (code) {
        case "EUR":
          return '&euro;';
        default:
          return code;
      }
    },
    addToCart(product){

      let exists = -1;

      cartStore().products.forEach(function (v, i) {
        if(product.Id === v.id){
          exists = i;
        }
      })

      if(exists === -1){
        cartStore().products.push({
          id: product.Id,
          qty: 1,
          name: product.Name,
          price: product.Price,
          picture: product.Picture
        })
      }else{
        cartStore().products[exists].qty++;
      }

      generalStore().showMessageCart = true;

      setTimeout(function(){
        generalStore().showMessageCart = false;
      }, 5000);

    }
  },
  data: function(){
    return {
      Amount: 0
    }
  }
}
</script>

<style scoped>
.application-sales-product > div {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 200px;
  border:1px solid #dcdcdc;
  overflow: hidden;
  cursor: pointer;
}
.application-sales-product .application-sales-product-name {
  position: absolute;
  bottom:0px;
  left:0px;
  width: 100%;
  text-align: center;
  background: rgba(0,0,0,0.5);
  color: #fff;
  margin: 0;
  padding: 5px;
  font-size: 14px;
}
.application-sales-product .application-sales-product-name > span {
  display: block;
  font-size: 16px;
}
.application-sales-product .application-sales-product-name > span > i {
  text-decoration: none;
  font-style: normal;
}
.application-sales-product img {
  display: block;
  height: 100%;
  margin: auto;
}
</style>