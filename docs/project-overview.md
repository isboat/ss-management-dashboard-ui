# OnScreenSync management dashboard

The dashboard is the browser workspace for organisations that manage OnScreenSync displays. It gives staff one place to build signage, organise the content they reuse across screens, and decide what each registered TV should show.

## What users can do

- Sign in or register and work with the screens and assets for their organisation. The dashboard restricts administrative areas such as user management by role.
- Create screens from layouts, choose their content, and preview a screen before publishing it. Publish a screen and assign it to a registered display.
- Create menus and maintain reusable images, videos, rich-text assets, and playlists. Arrange the items a display will rotate through.
- Pair TVs with device codes, see registered devices, and manage their assignments. Review item history where available and access tenant settings and help.

## How it is organised

The Angular application lives in [src/ss-management-dashboard-ui-app](../src/ss-management-dashboard-ui-app). Its admin layout supplies shared navigation and the page frame. Feature areas under [src/app](../src/ss-management-dashboard-ui-app/src/app) implement screens, menus, media, playlists, users, and devices. Shared services handle API requests and session state. [Browser tests](../src/ss-management-dashboard-ui-app/e2e) cover login rendering and direct navigation to screen and menu details.

## What it relies on

- **Management Dashboard API** authenticates users and supplies tenant-scoped data, including screens, templates, assets, devices, users, settings, and history. It handles the publish requests the dashboard submits.
- **Management Dashboard Preview** renders selected screens in a separate browser app. Registered TVs fetch published content through the **Display API**.
- **Angular 22**, Angular Material and CDK, RxJS, Bootstrap, and CKEditor support navigation, interface controls, API-driven state, and rich-text editing. The build uses Node 24 and npm. Deployment configuration targets Azure Static Web Apps.
