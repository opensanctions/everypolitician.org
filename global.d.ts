import { Chargebee } from "@chargebee/chargebee-js-types";

declare global {
  interface Window {
    // Note: The types provided by the package are not 100% accurate
    Chargebee: typeof Chargebee;
  }
}
