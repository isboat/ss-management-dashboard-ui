// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //apiBaseUrl: 'http://myscreen123service.runasp.net/api' // 'https://localhost:7140/api',
  //apiBaseUrl: 'http://management-dashboard-api.bue5g0hvfpcsdpc5.uksouth.azurecontainer.io/api',
  apiBaseUrl: 'http://localhost:5096/api',
};
