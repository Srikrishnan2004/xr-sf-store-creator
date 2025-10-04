// Centralized Cloud Function Endpoints Configuration
// All functions run in asia‑south1 under a single base URL.

// Base URL for every Cloud Function revision
const CLOUD_FUNCTION_BASE_URL = 'https://asia-south1-nodal-vigil-460311-q8.cloudfunctions.net';
/** Helper to build the full URL for a Cloud Function by name */
const fn = (name: string): string => `${CLOUD_FUNCTION_BASE_URL}/${name}`;

/** Helper to check if accessToken exists in URL parameters */
const hasAccessTokenInURL = (): boolean => {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('accessToken');
};

/** Helper to get the correct brand details endpoint based on fromShopify flag */
export const getBrandDetailsEndpoint = (): string => {
  const fromShopify = localStorage.getItem("fromShopify") === "true" || (window as any).fromShopify === true;
  const hasUrlToken = hasAccessTokenInURL();
  return (fromShopify || hasUrlToken) ? fn('app-get-brand-details-via-customurl') : fn('get-brand-details-via-customurl');
};

/** Helper to get the correct Shopify products endpoint based on fromShopify flag */
export const getShopifyProductsEndpoint = (): string => {
  const fromShopify = localStorage.getItem("fromShopify") === "true" || (window as any).fromShopify === true;
  const hasUrlToken = hasAccessTokenInURL();
  return (fromShopify || hasUrlToken) ? fn('app-fetch-shopify-products-bulk') : fn('function-14');
};

/** Helper to get the correct environment data endpoint based on fromShopify flag */
export const getEnvDataEndpoint = (): string => {
  const fromShopify = localStorage.getItem("fromShopify") === "true" || (window as any).fromShopify === true;
  const hasUrlToken = hasAccessTokenInURL();
  return (fromShopify || hasUrlToken) ? fn('app-get-env-data') : fn('get-env-data');
};

export const CLOUD_RUN_ENDPOINTS = {
  // Asset Management API
  ASSETS: {
    UPLOAD: fn('assets-uploading'),
    IMPORT: fn('assets-importing'),
    DELETE: fn('asset-deletion'),
    OWN_STORE: fn('own-store-asset')
  },

  // Brand Form API
  BRAND_FORM: {
    GET_BRAND_DETAILS: getBrandDetailsEndpoint()
  },

  // Environment Store API
  ENV_STORE: {
    GET_ENV_DATA: getEnvDataEndpoint(),
    STORE_ENV_DATA: fn('storeenvdata')
  },

  // Login API
  LOGIN: {
    LOGIN_USER: fn('function-login-dashboard'),
    OAUTH_LOGIN: fn('function-oauth-login'),
    GOOGLE_USER_INFO: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json"
  },

  // Own Store API
  OWN_STORE: {
    FETCH_PRODUCTS: fn('fetch-products-vendor-deploy')
  },

  // Product Fetch API
  PRODUCT_FETCH: {
    SHOPIFY_PRODUCTS: getShopifyProductsEndpoint()
  },

  // Dashboard API
  DASHBOARD: {
    FETCH_BRAND_DETAILS: fn('function-15')
  },

  // Cookie Validation API
  COOKIE: {
    VALIDATE: fn('function-cookie-validate')
  }
}; 