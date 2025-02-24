// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  cloudFunctions : {
    createOrder: 'YOUR_CREATE_ORDER_CLOUD_FUNCTION_URL',
    capturePayment: 'YOUR_CAPTURE_PAYMENT_CLOUD_FUNCTION_URL'
  },
  RAZORPAY_KEY_ID: 'RAZORPAY_KEY_ID_VALUE'
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *rzp_test_0wzrsNDtOxDPKP
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
