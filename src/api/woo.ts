import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// @ts-ignore
const api = new (WooCommerceRestApi.default || WooCommerceRestApi)({
  url: "https://nepaleseartgallery.com",
  consumerKey: import.meta.env.VITE_WC_CONSUMER_KEY,
  consumerSecret: import.meta.env.VITE_WC_CONSUMER_SECRET,
  version: "wc/v3"
});

export default api;
