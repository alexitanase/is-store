<template>
  <b-container>
    <b-row>
      <b-col>
        <b-table v-if="cartStore().products.length > 0" bordered="" :fields="fields" :items="cartStore().products" style="vertical-align: middle;">

          <template #cell(picture)="data">
            <img :src="data.value !== '' && data.value !== null ? data.value : 'assets/images/product-default.png'" style="height:80px;" />
          </template>

          <template #cell(price)="data">
            {{ parseFloat(data.value).toFixed(entity.Currency.Decimal) }} <span v-html="Currencies.symbolFormat(entity.Currency.Code)"></span>
          </template>

          <template #cell(id)="data">
            <b-button v-on:click="removeCartItem(data.value)" variant="light"><BIconTrash /></b-button>
          </template>

        </b-table>
        <div v-if="cartStore().products.length === 0" class="alert alert-info">
          There are no items in the cart.
        </div>
      </b-col>
    </b-row>
    <hr />
    <b-row class="mt-4">
      <b-col cols="12" md="4">
        <h3>Order summary</h3>
        <table class="w-100">
          <tr>
            <td>Subtotal</td>
            <td style="text-align: right;">{{ totalAmountCart().toFixed(entity.Currency.Decimal) }} <span v-html="Currencies.symbolFormat(entity.Currency.Code)"></span></td>
          </tr>
          <tr>
            <td>Shipping costs</td>
            <td style="text-align: right;">0.00 <span v-html="Currencies.symbolFormat(entity.Currency.Code)"></span></td>
          </tr>
          <tr style="font-size:24px;font-weight: bold;" class="text-danger">
            <td>Total</td>
            <td style="text-align: right;">{{ totalAmountCart().toFixed(entity.Currency.Decimal) }} <span v-html="Currencies.symbolFormat(entity.Currency.Code)"></span></td>
          </tr>
        </table>
      </b-col>
      <b-col cols="12" md="4"></b-col>
      <b-col cols="12" md="4" style="text-align: right;">
        <b-button v-on:click="generalStore().actualStep = 4" variant="primary" class="mb-3 w-50">Checkout <BIconCart /></b-button>
        <br />
        <b-button v-on:click="generalStore().actualStep = 1" class="w-50">Continue shopping</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {generalStore} from "../../../stores/general.store";
import {cartStore} from "../../../stores/cart.store";
import Currencies from "../../../utils/Currencies";

export default {
  name: "cart-layout",
  components: {},
  props: ["entity"],
  computed: {
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
      fields: [
        { key: 'picture', label: 'Picture', class: 'text-center' },
        { key: 'name', label: 'Product name' },
        { key: 'price', label: 'Price', class: 'text-center' },
        { key: 'qty', label: 'Quantity', class: 'text-center' },
        { key: 'id', label: 'Actions', class: 'text-center' }
      ]
    }
  },
  methods: {
    removeCartItem(id){
      let cartDetails = cartStore().products;
      let newCart = [];
      cartDetails.forEach(function(v){
        if(v.id === id){
          if(v.qty > 1){
            v.qty = (v.qty - 1);
            newCart.push(v)
          }
        }else{
          newCart.push(v);
        }
      })
      cartStore().products = newCart;
    },
    totalAmountCart(){
      let totalAmount = 0;
      let cartDetails = cartStore().products;
      cartDetails.forEach(function(v){
        totalAmount = (totalAmount + (parseFloat(v.price) * parseInt(v.qty)));
      })
      return totalAmount;
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