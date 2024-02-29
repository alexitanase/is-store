<template>
  <div class="application-sale-body-checkout">
    <b-container>
      <b-row v-show="errorMessage !== ''">
        <b-col class="mb-3">
          <div class="alert alert-warning" role="alert">
            <BIconExclamationTriangle /> {{ errorMessage }}
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col col="12" md="6" v-for="Input in requiredData" class="mb-4">

          <div class="mb-3">
            <label class="form-label">{{ Input.Label }} <span v-if="Input.Required" class="text-danger">*</span></label>
            <input v-if="Input.Type === 'input:text'" :name="Input.Name" v-model="modelData[Input.Name]" type="text" class="form-control" :placeholder="Input.Label" />
            <input v-if="Input.Type === 'input:email'" :name="Input.Name" v-model="modelData[Input.Name]" type="email" class="form-control" :placeholder="Input.Label" />
          </div>

        </b-col>
      </b-row>
      <b-row>
        <b-col class="mb-3">
          <table class="w-100 table table-bordered">
            <tr>
              <td>Subtotal ({{ totalItemsCart() }} products)</td>
              <td style="text-align: right;">{{ totalAmountCart().toFixed(entity.Currency.Decimal) }} <span v-html="Currencies.symbolFormat(entity.Currency.Code)"></span></td>
            </tr>
            <tr>
              <td>Total</td>
              <td style="text-align: right;">{{ totalAmountCart().toFixed(entity.Currency.Decimal) }} <span v-html="Currencies.symbolFormat(entity.Currency.Code)"></span></td>
            </tr>
          </table>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-show="paymentMethods.length > 1" class="mb-5">
          <div class="list-group">
            <a v-for="Payment in paymentMethods" v-on:click="selectPaymentMethod(Payment.Id)" href="#" class="list-group-item list-group-item-action" :class="typeof Payment.Selected !== 'undefined' && Payment.Selected ? 'active' : ''">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{{ Payment.Name }}</h5>
                <small>Card debit & credit</small>
              </div>
              <p class="mb-1">Some placeholder content in a paragraph.</p>
              <small>And some small print.</small>
            </a>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col col="12" md="8">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" v-model="termsAccepted" id="terms-more">
            <label class="form-check-label" for="terms-more">
              By completing your order you accept our Conditions of use and sale. See our Privacy Notice, our Cookies Notice.
            </label>
          </div>
        </b-col>
        <b-col col="12" md="4" style="text-align: right;">
          <b-button v-on:click="placeOrder()" :disabled="disableButtonContinue" variant="primary">Continue <BIconShieldFillCheck /></b-button>
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
import {toRaw} from "vue";

export default {
  name: "checkout-layout",
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
      requiredData: [],
      paymentMethods: [],
      modelData: {},
      errorMessage: '',
      errorMessageTimer: null,
      termsAccepted: false,
      disableButtonContinue: false
    }
  },
  methods: {
    async getRequiredData(){
      let Request = new RequestApi(Settings.endpoint);
      Request.add_header('Entity', Settings.entity);
      let response = await Request.doAsync({
        method: "get",
        url: "api/details/required-data",
      });

      if(response.Error){
        this.$router.push({ path: '/' })
        return false;
      }

      this.requiredData = response.Message;
    },
    async getPaymentMethods(){
      let Request = new RequestApi(Settings.endpoint);
      Request.add_header('Entity', Settings.entity);
      let response = await Request.doAsync({
        method: "get",
        url: "api/payment",
      });

      if(response.Error){
        this.$router.push({ path: '/' })
        return false;
      }

      this.paymentMethods = response.Message;
      if(this.paymentMethods.length > 0 && this.paymentMethods.length === 1){
        this.paymentMethods[0].Selected = true;
      }
    },
    totalAmountCart(){
      let totalAmount = 0;
      let cartDetails = cartStore().products;
      cartDetails.forEach(function(v){
        totalAmount = (totalAmount + (parseFloat(v.price) * parseInt(v.qty)));
      })
      return totalAmount;
    },
    totalItemsCart() {
      let total = 0;
      cartStore().products.forEach(function(v){
        total = parseInt(total + v.qty);
      })
      return total;
    },
    selectPaymentMethod(id){
      this.paymentMethods.forEach(function (value) {
        if(value.Id === id){
          value.Selected = true;
        }else{
          value.Selected = false;
        }
      })
    },
    async placeOrder(){
      this.disableButtonContinue = true;

      if (cartStore().products.length === 0){
        this.showErrorMessage('There are no items in the cart.');
        this.disableButtonContinue = false;
        return false;
      }

      this.requiredData.forEach(function (v) {
        if((typeof this.modelData[v.Name] === 'undefined' && v.Required) || (this.modelData[v.Name] === '' && v.Required)){
          this.showErrorMessage('Complete the required fields before submitting the order.');
          this.disableButtonContinue = false;
          return false;
        }
      }.bind(this));

      if(!this.termsAccepted){
        this.showErrorMessage('You must accept the terms and conditions and policies to continue.');
        this.disableButtonContinue = false;
        return false;
      }

      let PaymentSelected = -1;
      this.paymentMethods.forEach(function (value,index) {
        if(value.Selected === true){
          PaymentSelected = index;
        }
      })

      if(PaymentSelected === -1){
        this.showErrorMessage('The payment method has not been specified.');
        this.disableButtonContinue = false;
      }

      let products = [];
      cartStore().products.forEach(function (v) {
        products.push({
          id: v.id,
          name: v.name,
          price: v.price,
          qty: v.qty
        });
      })

      let customer = toRaw(this.modelData);

      let Data = {
        customer: customer,
        products: products,
        payment: this.paymentMethods[PaymentSelected].Id,
      };

      console.debug(Data);

      let Request = new RequestApi(Settings.endpoint);
      Request.add_header('Entity', Settings.entity);
      Request.add_header('Content-Type', 'application/json');
      let response = await Request.doAsync({
        method: "put",
        url: "api/operations",
        data: Data
      });

      if(response.Error){
        this.showErrorMessage(response.Message);
        this.disableButtonContinue = false;
        return false;
      }

      cartStore().checkoutToken = response.Message.Token;
      cartStore().products = [];
      this.$router.push({ path: '/operation/'+response.Message.Token });
      this.disableButtonContinue = false;

      if(response.Message.Status === 'PENDING'){
        setTimeout(function(){
          window.location = Settings.endpoint + 'api/payment/' + response.Message.Token;
        }, 500);
      }

    },
    showErrorMessage(message){
      this.errorMessage = message;
      clearTimeout(this.errorMessageTimer);
      this.errorMessageTimer = setTimeout(function () {
        this.errorMessage = '';
      }.bind(this), 5000);
    }
  },
  async beforeMount() {
    await this.getRequiredData();
    await this.getPaymentMethods();
  }
}
</script>

<style scoped>
table.table-bordered {
  border: 1px solid #dcdcdc;
}
table.table-bordered td {
  padding:10px;
}
</style>