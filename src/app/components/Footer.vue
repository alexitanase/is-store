<template>
  <div class="application-sales-footer">
    <b-container class="mt-2 mb-2">
      <b-row>
        <b-col cols="12" md="6">
          Copyright &copy; IronSales. All right reserved.
        </b-col>
        <b-col cols="12" md="6" style="text-align: right">
          v{{ Settings.version }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {Settings} from "../../config/Settings";

export default {
  name: "footer-layout",
  computed: {
    Settings() {
      return Settings
    }
  }
}
</script>

<style scoped>

</style>