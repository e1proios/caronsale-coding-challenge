// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  passwordHashIterations: 5,
  apiBase: 'https://caronsale-backend-service-dev.herokuapp.com/api/',
  pollingInterval: 20000,
  getAuthEndpoint: () => {
    return `${environment.apiBase}v1/authentication/`;
  },
  getDataEndpoint: (userId, filter) => {
    return `${environment.apiBase}v2/auction/seller/${userId}/running?filter=${filter}`;
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
