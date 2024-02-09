import {StoreApplication} from "./app/StoreApplication";

export class Loader {

  public static Version;

  protected ApplicationName: string;
  protected StoreApplication: any;

  constructor(application: string) {
    this.ApplicationName = application;
  }

  public init(settings: any): void {

    if(typeof settings === "object"){
      settings = {
        ...settings,
        ...{version: Loader.Version}
      }
    }

    this.StoreApplication = new StoreApplication(settings);
    this.StoreApplication.start();

    console.log(`Application loaded ${this.ApplicationName}`, settings);

  }

}