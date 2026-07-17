# Project Overview

## Summary

This repository contains the `ss-management-dashboard-ui-app`, a single-page Angular dashboard application for managing screens, menus, media, playlists, devices, users, and tenant settings.

The app is built on Angular 14 and is styled with a Material Dashboard theme plus Bootstrap Material Design. It is designed as a management interface for a backend API and supports user authentication, admin role gating, and TV device provisioning.

## Architecture

- `src/ss-management-dashboard-ui-app/src/app/app.module.ts` is the root module.
- `src/ss-management-dashboard-ui-app/src/app/app.routing.ts` defines top-level routing and bootstraps the `AdminLayoutModule`.
- `src/ss-management-dashboard-ui-app/src/app/layouts/admin-layout/admin-layout.module.ts` declares the dashboard pages and imports Angular Material controls, form handling, CKEditor, and drag-and-drop support.
- `src/ss-management-dashboard-ui-app/src/app/layouts/admin-layout/admin-layout.routing.ts` defines the main app routes.
- The app uses hash-based routing via `RouterModule.forRoot(routes, { useHash: true })`.

## Key Technologies

- Angular 14
- Angular Material (`@angular/material`, `@angular/cdk`)
- CKEditor 5 (`@ckeditor/ckeditor5-angular`)
- Bootstrap Material Design + Bootstrap 4
- jQuery, Popper.js, Chartist, Moment.js, Perfect Scrollbar, Bootstrap Notify
- RxJS 7
- TypeScript 4.7
- Angular CLI build system
- Azure Static Web Apps deploy script available in `package.json`

## UI and Feature Areas

The dashboard supports the following major feature areas:

- Screen management
  - Screen list
  - Screen details
  - New screen creation
  - Publish preview flow for screen playback
- Menu management
  - Menu list
  - Menu create
  - Menu details
- Media management
  - Media assets list
  - Create/edit media asset
  - Media details and playlist assignment
- Text asset management
  - Text assets for ads and informational content
  - Text asset create/edit
- Playlist management
  - Playlist list
  - Playlist details
- Device management
  - TV device list
  - New device provisioning/authentication
- User management
  - User list
  - Create user
  - User details
- Tenant settings and help/support pages
- Login and register flows

## Authentication and Authorization

- `AuthService` stores JWT tokens in local storage and exposes:
  - `isAuthenticated()`
  - `isAdminUser()`
  - `authUserEmail()`
  - `redirectToLogin()`
- `LoginService` sends credentials to `/authentication/login` and `/authentication/register`, then stores the returned JWT to local storage.
- `AuthInterceptor` appends `Authorization: Bearer <token>` to outgoing API requests and redirects to `/login` on HTTP 401 responses.
- Route guards in `can-activate-route.service.ts` protect authenticated pages and admin-only pages:
  - `canActivateRoute` for general authenticated access
  - `canActivateUserRoute` for admin-only pages
  - `canActivateLoginRoute` prevents authenticated users from visiting login/register pages
- The sidebar hides login links for authenticated users and filters admin-only menu items based on the JWT `role` claim.

## Routes and Pages

The application defines a dashboard layout with the following routes:

- `/dashboard`
- `/screens`
- `/screen-details/:id`
- `/screen-create`
- `/menus`
- `/menu-create`
- `/menu-details/:id`
- `/media-new`
- `/media-list`
- `/text-asset-list`
- `/media-details/:id`
- `/text-asset-new`
- `/text-asset/:id`
- `/users`
- `/settings`
- `/user-create`
- `/user-details/:id`
- `/device/auth`
- `/devices`
- `/playlists`
- `/playlists/:id`
- `/help-and-support`
- `/login`
- `/register`

Most routes are rendered under the `AdminLayoutComponent` and are guarded by the layout route module.

## Application Behavior and UX Flows

- Login collects username/email and password, then stores the returned JWT under the `token` key in local storage.
- The app uses the JWT payload to determine the current user email and whether the user has the `Admin` role.
- The `ScreenDetailsComponent` loads templates, menus, devices, playlists, media assets, and text assets, and it updates screen layout metadata before saving.
- Screen preview is launched by opening a local preview site at `http://localhost:4401/?screenId=<id>&token=<jwt>`.
- The `ScreenListComponent` includes publish and delete actions and can link a published screen to a selected device.
- Many components handle 401 errors by forcing a redirect to the login page via `AuthService.redirectToLogin(true)`.

## API Integration

- The app is a frontend client for a REST API based on `environment.apiBaseUrl`.
- Default development API base URL is:
  - `https://managementdapi.azurewebsites.net/api`
- Key services use the API for tenant-scoped resources:
  - `DataService` for screens and templates
  - `DeviceService` for devices and device auth
  - `MenuService` for menus
  - `MediaService` for media assets
  - `PlaylistService` for playlists
  - `TextAssetService` for text assets
  - `UserService` for users
  - `TenantService` for tenant settings
  - `HistoryService` for audit/history data
  - `LoginService` for authentication and registration

API endpoints follow the pattern:

- `/authentication/login`
- `/authentication/register`
- `/v1/tenant/screens`
- `/v1/tenant/menus`
- `/v1/tenant/media-assets`
- `/v1/tenant/playlists`
- `/v1/tenant/text-assets`
- `/v1/tenant/devices`
- `/v1/tenant/users`
- `/v1/tenant/settings`

## Build and Deployment

- Run `npm install` to install dependencies.
- Run `npm start` to launch the development server with `ng serve`.
- Run `npm run build` to create a production build.
- Production build replaces `src/environments/environment.ts` with `src/environments/environment.prod.ts`.
- Deployment is configured for Azure Static Web Apps via the npm script:
  - `npm run deploy`
- The `angular.json` configures output to `dist` and includes custom scripts/styles used by the dashboard theme.

## Notes

- The repository currently targets Node 6.11.1 and npm 3.10.9 via `package.json` engines, though the Angular toolchain itself is modern enough that a newer Node version may also work.
- The app is organized around a dashboard-style layout with a persistent sidebar, and uses a mix of Angular Material components and legacy UI libraries for charts and notifications.

## Files of Interest

- `src/ss-management-dashboard-ui-app/package.json`
- `src/ss-management-dashboard-ui-app/angular.json`
- `src/ss-management-dashboard-ui-app/src/app/app.module.ts`
- `src/ss-management-dashboard-ui-app/src/app/app.routing.ts`
- `src/ss-management-dashboard-ui-app/src/app/layouts/admin-layout/admin-layout.module.ts`
- `src/ss-management-dashboard-ui-app/src/app/layouts/admin-layout/admin-layout.routing.ts`
- `src/ss-management-dashboard-ui-app/src/app/services/auth.service.ts`
- `src/ss-management-dashboard-ui-app/src/app/app.component.ts`
- `src/ss-management-dashboard-ui-app/src/app/http-interceptors/auth.interceptor.ts`
- `src/ss-management-dashboard-ui-app/src/environments/environment.ts`
- `src/ss-management-dashboard-ui-app/src/environments/environment.prod.ts`
