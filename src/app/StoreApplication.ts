import {createApp} from "vue";
import {BootstrapVue3} from "bootstrap-vue-3";
import {BootstrapIconsPlugin} from "bootstrap-icons-vue";
import App from "./App.vue";
import {createPinia, Pinia} from "pinia";
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import {Settings} from "../config/Settings";

export class StoreApplication {

  protected VueApp:           any;
  protected Pinia:            Pinia;

  constructor(settings) {
    try {

      // setting version
      if(settings.version){
        Settings.version = settings.version;
      }

      // setting entity
      if(settings.entity){
        Settings.entity = settings.entity;
      }

      // setting entity
      if(settings.product){
        Settings.product = settings.product;
      }

      // container
      if(settings.container){
        Settings.container = settings.container;
      }

      // Parts
      if(typeof settings.footer !== 'undefined'){
        Settings.footer = settings.footer;
      }

      if(typeof settings.header !== 'undefined'){
        Settings.header = settings.header;
      }

      if(typeof settings.filters !== 'undefined'){
        Settings.filters = settings.filters;
      }

    }catch (e){
      throw Error(e);
    }
  }

  start() {
    if(!Settings.container || Settings.container === ''){
      throw new Error("Undefined container.");
    }

    if(this.VueApp){
      throw new Error("Application already loaded.");
    }

    //create pinia store
    this.Pinia = createPinia();

    //set persisted state
    this.Pinia.use(piniaPluginPersistedState);

    //create vue app
    this.VueApp = createApp(App);
    this.VueApp.use(this.Pinia);
    this.VueApp.use(BootstrapVue3);
    this.VueApp.use(BootstrapIconsPlugin);
    this.VueApp.mount(Settings.container);
  }

}