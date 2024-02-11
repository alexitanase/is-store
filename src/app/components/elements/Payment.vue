<template>
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
  </b-container>
</template>

<script>
import {generalStore} from "../../../stores/general.store";
import {cartStore} from "../../../stores/cart.store";
import {Settings} from "../../../config/Settings";
import {RequestApi} from "../../../utils/RequestApi";
import Currencies from "../../../utils/Currencies";

export default {
  name: "payment-layout",
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
        url: "api/operations/" + cartStore().checkoutToken,
      });

      if(response.Error){
        generalStore().actualStep = 1;
        return false;
      }

      this.Operation = response.Message;

      if(this.Operation.Status === 'COMPLETED'){
        clearInterval(this.timerOperationChecker);
      }
    }
  },
  async beforeMount() {
    if(cartStore().checkoutToken !== ''){
      await this.checkOperationStatus();
      this.timerOperationChecker = setInterval(this.checkOperationStatus.bind(this), 10000);
    }else{
      generalStore().actualStep = 1;
    }
  },
  beforeUnmount() {
    clearInterval(this.timerOperationChecker);
  }
}
</script>

<style scoped>
iframe {
  width: 100%;
  min-height: 600px;
}
</style>