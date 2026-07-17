# [Material Dashboard Angular - Free Bootstrap Material Design Admin](https://www.creative-tim.com/product/material-dashboard-angular2)[![version][version-badge]][CHANGELOG]

![Product Gif](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/material-dashboard-angular.gif)

**[Material Dashboard Angular](https://www.creative-tim.com/product/material-dashboard-angular2/)** is a free Material Bootstrap Admin with a fresh, new design inspired by Google's Material Design. We are very excited to introduce our take on the material concepts through an easy to use and beautiful set of components. Material Dashboard was built over the popular Bootstrap framework and it comes with a couple of third-party plugins redesigned to fit in with the rest of the elements.

Material Dashboard makes use of light, surface and movement. The general layout resembles sheets of paper following multiple different layers, so that the depth and order is obvious. The navigation stays mainly on the left sidebar and the content is on the right inside the main panel.

This product came as a result of users asking for a material dashboard after we released our successful [Material Kit](http://www.creative-tim.com/product/material-kit). We developed it based on your feedback and it is a powerful bootstrap admin dashboard, which allows you to build products like admin panels, content managements systems and CRMs.

Material Dashboard comes with 5 color filter choices for both the sidebar and the card headers (blue, green, orange, red and purple) and an option to have a background image on the sidebar.

Material Dashboard uses a framework built by our friend [Federico - Bootstrap Material Design](http://fezvrasta.github.io/bootstrap-material-design/), who did an amazing job creating the backbone for the material effects, animations, ripples and transitions. Big thanks to his team for the effort and forward thinking they put into it.

Special thanks go to:
[Robert McIntosh](https://github.com/mouse0270/bootstrap-notify) for the notification system.
[Chartist](https://gionkunz.github.io/chartist-js/) for the wonderful charts.
We are very excited to share this dashboard with you and we look forward to hearing your feedback!

You can find the Github Repo here.

## Project Specific Notes

This repository contains a customized Angular 14 dashboard for managing digital signage content and screens. It is built on the Material Dashboard Angular starter template and extends it with tenant-aware backend integration, role-based routing, and content publishing flows.

Key app-specific features:

- JWT-based authentication with token storage in browser local storage.
- Admin role gating for user, settings, device, and playlist management pages.
- Screen and menu management for digital signage content.
- Media asset and text asset editors plus playlist assignment.
- Device provisioning and TV device authentication flows.
- A screen preview workflow that opens a preview service at `http://localhost:4401/?screenId=<id>&token=<jwt>`.
- Uses a REST API backend configured through `src/environments/environment.ts`.

This app is located in `src/ss-management-dashboard-ui-app` and includes the following important files:

- `package.json` — npm scripts and dependency configuration.
- `angular.json` — Angular CLI build/serve/test configuration.
- `src/app/app.module.ts` — root module and HTTP interceptor registration.
- `src/app/layouts/admin-layout/admin-layout.routing.ts` — main route configuration.
- `src/environments/environment.ts` — development API base URL.

## Table of Contents

* [Versions](#versions)
* [Demo](#demo)
* [Quick Start](#quick-start)
* [Documentation](#documentation)
* [File Structure](#file-structure)
* [Browser Support](#browser-support)
* [Resources](#resources)
* [Reporting Issues](#reporting-issues)
* [Technical Support or Questions](#technical-support-or-questions)
* [Licensing](#licensing)
* [Useful Links](#useful-links)


## Versions

[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/html-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/material-dashboard)
[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/angular-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/material-dashboard-angular2)
[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/vue-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/vue-material-dashboard)
[<img src="https://github.com/creativetimofficial/public-assets/blob/master/logos/react-logo.jpg?raw=true" width="60" height="60" />](https://www.creative-tim.com/product/material-dashboard-react)

| HTML | Angular | Vue | React |
| --- | --- | --- | --- |
| [![Material Dashboard HTML](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-html/material-dashboard.jpg?raw=true)](https://www.creative-tim.com/product/material-dashboard) | [![Material Dashboard Angular](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-angular/material-dashboard-angular.jpg?raw=true)](https://www.creative-tim.com/product/material-dashboard-angular2) | [![Vue Material Dashboard ](https://github.com/creativetimofficial/public-assets/blob/master/vue-material-dashboard/vue-material-dashboard.jpg?raw=true)](https://www.creative-tim.com/product/vue-material-dashboard) | [![Material Dashboard React](https://github.com/creativetimofficial/public-assets/blob/master/material-dashboard-react/material-dashboard-react.jpg?raw=true)](https://www.creative-tim.com/product/material-dashboard-react)

## Demo

| Dashboard | User Profile | Tables | Icons | Notifications |
| --- | --- | --- | --- | --- |
| [![Start page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/dashboard.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/dashboard) | [![User profile page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/user-profile.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/user-profile) | [![Tables page ](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/tables.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/table-list) | [![Icons Page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/icons.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/maps) | [![Notifications page](https://raw.githubusercontent.com/creativetimofficial/public-assets/master/material-dashboard-angular/notifications.png?raw=true)](https://demos.creative-tim.com/material-dashboard-angular2/#/notifications)

[View More](https://demos.creative-tim.com/material-dashboard-angular2/#/dashboard).

## Quick start

This project is a customized implementation of the Material Dashboard Angular starter, located in `src/ss-management-dashboard-ui-app`.

### Development setup

1. Install Node.js (a modern LTS version such as 16.x or 18.x is recommended).
2. Open a terminal in `src/ss-management-dashboard-ui-app`.
3. Run:
   - `npm install`
   - `npm start`
4. Open `http://localhost:4200/` in your browser.

### Build and deploy

- `npm run build` — build the production bundle into `dist`.
- `npm run deploy` — run Azure Static Web Apps deployment using the configured `swa` script.

### Notes

- The application uses `src/environments/environment.ts` to configure the API base URL. The current development URL is `https://managementdapi.azurewebsites.net/api`.
- Authentication tokens are stored in local storage under the key `token`.
- The app includes custom routes for screens, menus, media, text assets, playlists, devices, users, settings, help, login, and registration.
- A preview workflow exists in the screen pages, which opens a local preview service at `http://localhost:4401/?screenId=<id>&token=<jwt>`.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### What's included

Within the download you'll find the following directories and files:

```
material-dashboard-angular
├── CHANGELOG.md
├── LICENSE.md
├── README.md
├── angular-cli.json
├── documentation
├── e2e
├── karma.conf.js
├── package-lock.json
├── package.json
├── protractor.conf.js
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── app.routing.ts
│   │   ├── components
│   │   │   ├── components.module.ts
│   │   │   ├── footer
│   │   │   │   ├── footer.component.css
│   │   │   │   ├── footer.component.html
│   │   │   │   ├── footer.component.spec.ts
│   │   │   │   └── footer.component.ts
│   │   │   ├── navbar
│   │   │   │   ├── navbar.component.css
│   │   │   │   ├── navbar.component.html
│   │   │   │   ├── navbar.component.spec.ts
│   │   │   │   └── navbar.component.ts
│   │   │   └── sidebar
│   │   │       ├── sidebar.component.css
│   │   │       ├── sidebar.component.html
│   │   │       ├── sidebar.component.spec.ts
│   │   │       └── sidebar.component.ts
│   │   ├── dashboard
│   │   │   ├── dashboard.component.css
│   │   │   ├── dashboard.component.html
│   │   │   ├── dashboard.component.spec.ts
│   │   │   └── dashboard.component.ts
│   │   ├── icons
│   │   │   ├── icons.component.css
│   │   │   ├── icons.component.html
│   │   │   ├── icons.component.spec.ts
│   │   │   └── icons.component.ts
│   │   ├── layouts
│   │   │   └── admin-layout
│   │   │       ├── admin-layout.component.html
│   │   │       ├── admin-layout.component.scss
│   │   │       ├── admin-layout.component.spec.ts
│   │   │       ├── admin-layout.component.ts
│   │   │       ├── admin-layout.module.ts
│   │   │       └── admin-layout.routing.ts
│   │   ├── maps
│   │   │   ├── maps.component.css
│   │   │   ├── maps.component.html
│   │   │   ├── maps.component.spec.ts
│   │   │   └── maps.component.ts
│   │   ├── notifications
│   │   │   ├── notifications.component.css
│   │   │   ├── notifications.component.html
│   │   │   ├── notifications.component.spec.ts
│   │   │   └── notifications.component.ts
│   │   ├── table-list
│   │   │   ├── table-list.component.css
│   │   │   ├── table-list.component.html
│   │   │   ├── table-list.component.spec.ts
│   │   │   └── table-list.component.ts
│   │   ├── typography
│   │   │   ├── typography.component.css
│   │   │   ├── typography.component.html
│   │   │   ├── typography.component.spec.ts
│   │   │   └── typography.component.ts
│   │   ├── upgrade
│   │   │   ├── upgrade.component.css
│   │   │   ├── upgrade.component.html
│   │   │   ├── upgrade.component.spec.ts
│   │   │   └── upgrade.component.ts
│   │   └── user-profile
│   │       ├── user-profile.component.css
│   │       ├── user-profile.component.html
│   │       ├── user-profile.component.spec.ts
│   │       └── user-profile.component.ts
│   ├── assets
│   │   ├── css
│   │   │   └── demo.css
│   │   ├── img
│   │   └── scss
│   │       ├── core
│   │       └── material-dashboard.scss
│   ├── environments
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.css
│   ├── test.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   └── typings.d.ts
├── tsconfig.json
├── tslint.json
└── typings

```

## Browser Support

At present, we officially aim to support the last two versions of the following browsers:

<img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/chrome.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/firefox.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/edge.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/safari.png" width="64" height="64"> <img src="https://s3.amazonaws.com/creativetim_bucket/github/browser/opera.png" width="64" height="64">



## Resources
- Demo: <https://demos.creative-tim.com/material-dashboard-angular2/#/dashboard>
- Download Page: <https://www.creative-tim.com/product/material-dashboard-angular2>
- Documentation: <https://demos.creative-tim.com/material-dashboard-angular2/#/documentation/tutorial>
- License Agreement: <https://www.creative-tim.com/license>
- Support: <https://www.creative-tim.com/contact-us>
- Issues: [Github Issues Page](https://github.com/creativetimofficial/material-dashboard-angular2/issues)
- [Material Kit](https://www.creative-tim.com/product/material-kit?ref=github-mda-free) - For Front End Development

## Reporting Issues

We use GitHub Issues as the official bug tracker for the Material Dashboard. Here are some advices for our users that want to report an issue:

1. Make sure that you are using the latest version of the Material Dashboard. Check the CHANGELOG from your dashboard on our [website](https://www.creative-tim.com/).
2. Providing us reproducible steps for the issue will shorten the time it takes for it to be fixed.
3. Some issues may be browser specific, so specifying in what browser you encountered the issue might help.


## Technical Support or Questions

If you have questions or need help integrating the product please [contact us](https://www.creative-tim.com/contact-us) instead of opening an issue.



## Licensing

- Copyright 2018 Creative Tim (https://www.creative-tim.com/)

- Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-angular2/blob/master/LICENSE.md)


## Useful Links

- [More products](https://www.creative-tim.com/bootstrap-themes) from Creative Tim
- [Tutorials](https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w)
- [Freebies](https://www.creative-tim.com/bootstrap-themes/free) from Creative Tim
- [Affiliate Program](https://www.creative-tim.com/affiliates/new) (earn money)

##### Social Media

Twitter: <https://twitter.com/CreativeTim>

Facebook: <https://www.facebook.com/CreativeTim>

Dribbble: <https://dribbble.com/creativetim>

Google+: <https://plus.google.com/+CreativetimPage>

Instagram: <https://www.instagram.com/CreativeTimOfficial>

[CHANGELOG]: ./CHANGELOG.md

[version-badge]: https://img.shields.io/badge/version-2.8.0-blue.svg
