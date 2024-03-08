<template>
  <div class="application-sale-body-cart">
    <b-container>
      <b-row>
        <b-col>
          <b-table v-if="cartStore().products.length > 0" bordered="" :fields="fields" :items="formatCart()" style="vertical-align: middle;">

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
          <div v-if="stockAlert" class="alert alert-warning">
            <b>
              Some of the products selected in the cart are no longer available.
            </b>
            <br /><br />
            If you continue with the payment process, these products will be removed from the cart.
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
          <b-button v-on:click="this.$router.push({ path: '/checkout' })" variant="primary" class="mb-3 w-50">Checkout <BIconCart /></b-button>
          <br />
          <b-button v-on:click="this.$router.push({ path: '/' })" class="w-50">Continue shopping</b-button>
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
      stockAlert: false,
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
    formatCart(){
      let products = cartStore().products;

      products.forEach(function (product, index) {
        if (parseInt(product.available) === 0){
          products[index]['_rowVariant'] = 'danger';
        }else if (10 >= parseInt(product.available) && parseInt(product.available) !== -1){
          products[index]['_rowVariant'] = 'warning';
        }else{
          delete products[index]['_rowVariant'];
        }
      });

      return products;
    },
    async checkStock(){
      let cartDetails = cartStore().products;
      let Request = new RequestApi(Settings.endpoint);
      Request.add_header('Entity', Settings.entity);

      let products =  '';
      cartDetails.forEach(function(v, i){
        if(i === 0)
          products = v.id;
        else
          products += ','+v.id;
      })

      let response = await Request.doAsync({
        method: "get",
        url: "api/products/check-stock/" + products
      });

      if(response.Error){
        // TODO: message error
        return false;
      }

      let stockAlert = false;
      response.Message.forEach(function(stock){
        let cart_product = cartDetails.find(x => x.id === stock.Id);
        let cart_product_index = cartDetails.findIndex(x => x.id === stock.Id);
        if(!stock.Status || stock.Stock !== -1 && cart_product.qty > parseInt(stock.Stock)){
          cartDetails[cart_product_index].available = 0;
          stockAlert = true;
        }else if(stock.Stock !== -1 && parseInt(stock.Stock) >= cart_product.qty){
          cartDetails[cart_product_index].available = stock.Stock;
        }
      });

      this.stockAlert = stockAlert;
    },
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
  },
  async beforeMount() {
    await this.checkStock();
  }
}
</script>

<style scoped>
.application-sale-body-customer-details,
.application-sale-body-payment-method{
  padding: 10px 5px;
}
</style>