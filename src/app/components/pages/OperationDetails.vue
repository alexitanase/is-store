<template>
  <div class="application-sale-body-payment-method">
    <b-container>
      <b-row>
        <b-col>
          <div v-if="Operation.Status === 'PENDING'" class="alert alert-info" role="alert">
            Pending payment. Waiting for payment...
          </div>
          <div v-if="Operation.Status === 'COMPLETED'" class="alert alert-success" role="alert">
            The payment has been received correctly.
          </div>
          <div v-if="Operation.Status === 'CANCELED'" class="alert alert-danger" role="alert">
            The operation has been cancelled.
          </div>
        </b-col>
      </b-row>
      <b-row>

        <b-col col="12" md="6">
          <h3>Operation <b>#{{ Operation.Id }}</b></h3>
          <p class="text-muted mb-0">Token: <b>{{ Operation.Token }}</b></p>
          <p class="mt-0 mb-0">Date & time: <b>{{ Operation.Datetime }}</b></p>
          <p class="mt-0 mb-0">Status: <b>{{ Operation.Status }}</b></p>
          <p class="mt-0">Payment method: <b>{{ Operation.PaymentMethod.Name }}</b></p>
        </b-col>

        <b-col col="12" md="6">
          <table class="w-100 table table-bordered">
            <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="Product in Operation.Products">
              <th>{{ Product.Product.Name }}</th>
              <th>{{ parseFloat(Product.Price).toFixed(entity.Currency.Decimal) }} <span v-html="Currencies.symbolFormat(entity.Currency.Code)"></span></th>
              <th>{{ Product.Quantity }}</th>
            </tr>
            </tbody>
          </table>
        </b-col>

      </b-row>

      <b-row>

        <b-col col="12" md="12">
          <h3>Options</h3>
        </b-col>

        <b-col col="12" md="3">
          <div class="card operation-option not-available">
            <div class="card-body text-center">
              <BIconServer class="main-icon-option" />
              Request refund <BIconCaretRight />
            </div>
            <span class="lbl-not-available">Not available</span>
          </div>
        </b-col>

        <b-col col="12" md="3">
          <div v-on:click="openPaymentGateway()" class="card operation-option" :class="Operation.Status !== 'PENDING' ? 'not-available' : ''">
            <div class="card-body text-center">
              <BIconCreditCard class="main-icon-option" />
              Retry payment <BIconCaretRight />
            </div>
            <span class="lbl-not-available">Not available</span>
          </div>
        </b-col>

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

export default {
  name: "operation-details-layout",
  components: {},
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
      Operation: {
        Id: 0,
        Token: "",
        Status: "",
        PaymentMethod: {},
        Datetime: 0,
        Products: []
      },
      timerOperationChecker: null
    }
  },
  methods: {
    async checkOperationStatus(){
      let Request = new RequestApi(Settings.endpoint);
      Request.add_header('Entity', Settings.entity);
      let response = await Request.doAsync({
        method: "get",
        url: "api/operations/" + this.$route.params.token,
      });

      if(response.Error){
        this.$router.push({ path: '/' });
        return false;
      }

      this.Operation = response.Message;

      if(this.Operation.Status !== 'PENDING'){
        clearInterval(this.timerOperationChecker);
      }
    },
    openPaymentGateway(){
      if(this.Operation.Status === 'PENDING'){
        window.location=Settings.endpoint + 'api/payment/' + this.Operation.Token;
      }
    }
  },
  async beforeMount() {
    await this.checkOperationStatus();
    this.timerOperationChecker = setInterval(this.checkOperationStatus.bind(this), 10000);
  },
  beforeUnmount() {
    clearInterval(this.timerOperationChecker);
  }
}
</script>

<style scoped>
.operation-option {
  position: relative;
  cursor: pointer;
}
.operation-option span.lbl-not-available {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, 10px);
  font-size: 12px;
  background: orange;
  padding: 0 10px;
  border-radius: 5px;
  display: none;
}
.operation-option .main-icon-option {
  width: 64px;
  height: 64px;
  display: block;
  margin: auto;
  margin-bottom: 15px;
}
.operation-option.not-available .card-body {
  opacity: 0.75;
}
.operation-option.not-available span.lbl-not-available {
  display: block;
}
</style>