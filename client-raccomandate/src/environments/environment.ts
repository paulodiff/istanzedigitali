// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiAtti: 'http://localhost:8010/raccomandatemgr/atti',
  apiConsegna: 'http://localhost:8010/raccomandatemgr/consegna',
  apiInfo: 'http://localhost:8010/raccomandatemgr/info',
  apiInfoLog: 'http://localhost:8010/raccomandatemgr/infolog',
  apiAttiConsegnatari: 'http://localhost:8010/raccomandatemgr/atticonsegnatari',
  apiSse: 'http://localhost:8010/sse',
  apiSocket: 'http://localhost:8010'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
