# Angular modernization plan

## Executive recommendation

Upgrade this application from Angular 14 to **Angular 22**, the current stable
major verified from the npm registry on 2026-07-25. Do not jump directly to 22
in one dependency edit. Create a short-lived migration branch for each major
(`14 -> 15 -> ... -> 22`), run the Angular CLI migrations at every step, and
keep each step buildable and independently reversible.

Treat the framework upgrade and the visual redesign as separate workstreams.
First establish tests, remove unused/server-side dependencies, replace the
legacy browser plug-ins, and reach Angular 22 without intentional UX changes.
Then adopt standalone APIs, signals and a new Material 3 design system in small
feature slices. This ordering minimizes the chance that a framework regression
is confused with a design regression.

Implementation began in the Angular 22 upgrade change set: the supported Node
toolchain, modern application builder, ESLint, Playwright smoke coverage, CI,
polyfill cleanup, dependency pruning, and the first redesigned login slice are
now in place. The remaining Bootstrap-theme and CKEditor work stays sequenced
below so it can be delivered without destabilizing the upgraded application.

## Current-state findings

### Framework and toolchain

- Angular packages are declared at 14.2 and resolve to a mixture of 14.2 and
  14.3. The CLI resolves to 14.2.11, TypeScript to 4.7.4 and RxJS to 7.5.7.
- The application uses the legacy webpack `browser` builder, an NgModule root,
  `platformBrowserDynamic`, class-based route guards and an NgModule/class-based
  HTTP interceptor.
- The workspace still configures TSLint/codelyzer and Protractor. Both are
  obsolete; `ng lint` has no viable modern builder and Protractor reached end
  of life.
- Karma/Jasmine is configured, but the nine checked-in specs cover only a small
  portion of 33 components. Several specs still use the removed `async` testing
  helper.
- The configured Node range (`>=16.15 <20`) cannot run Angular 22. Angular 22.0.8
  currently declares Node `^22.22.3 || ^24.15.0 || >=26.0.0`; pin Node 24 LTS
  for the migration target rather than relying on a developer's global Node.
- The repository's current Node 20.20.2 is already unsupported by Angular 14,
  despite the application still building far enough to begin bundle generation.
- There is no application build/test/deploy CI workflow; the only workflow is
  an inherited issue auto-closer from the dashboard template.

### Dependency inventory

The browser bundle loads global scripts for jQuery, Popper 1, Bootstrap Material
Design, Arrive, Moment, Perfect Scrollbar, Bootstrap Notify and Chartist. This
creates an interdependent Bootstrap 4-era theme which is the largest obstacle
to modern Angular and Material styling.

| Current package(s) | Evidence/use | Recommendation |
| --- | --- | --- |
| `jquery`, `popper.js`, `bootstrap-material-design`, `arrive` | Loaded globally; jQuery is used by layout initialization and notifications | Remove together after recreating layout behavior with Angular/CDK. Do not upgrade jQuery as an intermediate destination. |
| `bootstrap-notify` | `NotificationsService` calls global `$.notify` | Replace with `MatSnackBar` and an application notification facade. |
| `perfect-scrollbar` | Global asset and imperative layout initialization | Prefer native CSS scrolling; use CDK scrolling only for genuinely large lists. |
| `moment` | Loaded globally but no application TypeScript import was found | Remove after a smoke test; use `Intl.DateTimeFormat`/Angular date pipes for future formatting. |
| `chartist` | Dashboard component import plus global script | Replace with a maintained, typed, ESM chart library only if charts are a real product requirement. Lazy-load it on the dashboard. Consider Apache ECharts or Chart.js after a small accessibility/bundle-size spike. |
| Bootstrap 4 and legacy Material Dashboard SCSS | Core page layout and visual styling | Replace with an app-owned Material 3 theme, design tokens and CDK layout primitives. Remove Bootstrap only after each page slice is migrated. |
| CKEditor 5 build packages | Used by text-asset creation/editing | Keep the Angular integration temporarily, but migrate away from the predefined `ckeditor5-build-classic` packages to CKEditor's current installation method and verify Angular 22 support/licensing before the final framework step. |
| `@angular/elements`, `@angular/localize` | Declared, but no application use found | Remove in the first cleanup PR after confirming no external custom-element/localization build consumes them. |
| `ajv`, `buffer`, `express`, `googleapis` | Declared, but no application import found | Remove from this browser project. Server-side integrations belong in the API, not the SPA. |
| `classlist.js`, `web-animations-js` | Legacy polyfills | Remove when supported browsers are documented; current Angular/browser baselines do not need them. |
| `hammerjs` | Imported by `main.ts` | Remove after verifying no gesture feature depends on it; current Angular Material does not require it. |
| `eslint` in runtime dependencies | Tooling, not runtime code | Replace TSLint/codelyzer with `angular-eslint` and keep all lint packages in `devDependencies`. |

Do not mechanically add every proposed replacement. Native platform and Angular
features are preferable; every added package must have a named use case, ESM
output, current maintenance, Angular 22 compatibility, acceptable licensing and
an explicit bundle cost.

### Application architecture and quality risks

- There are roughly 75 application TypeScript files, 33 components, four
  NgModules, 87 explicit subscriptions and 121 occurrences of `any`. This is a
  manageable incremental migration, but strict mode should not be enabled in a
  single all-or-nothing commit.
- Multiple long-lived components manually subscribe to route and HTTP streams.
  Convert these to `async` pipe/signals or use `takeUntilDestroyed` to prevent
  leaks and simplify teardown.
- Root-relative imports such as `app/...` and `environments/...` rely on the old
  `baseUrl` behavior. Add explicit `paths` or use relative imports before the
  modern builder migration.
- Authentication stores a bearer token in `localStorage`, decodes authorization
  claims client-side and includes the token in a preview URL query string.
  Query strings leak through history, logs and referrers; local-storage tokens
  amplify XSS impact. Coordinate a backend-supported secure, HttpOnly,
  SameSite-cookie/session design. At minimum, replace the preview query token
  with a short-lived, one-time exchange code and enforce HTTPS.
- API and preview URLs are hard-coded in environment/component files. Move all
  environment-specific values to deployment configuration and validate them at
  application startup.
- The production build explicitly disables critical CSS inlining and font
  optimization and does not minify styles. Re-evaluate these overrides after
  adopting the modern application builder.
- Routes eagerly import the admin feature. Introduce route-level lazy loading
  during the standalone migration and use functional guards.

## Safe delivery sequence

### Phase 0 — baseline and safety net

1. Pin tool versions using `.nvmrc` or `.node-version` and `packageManager` in
   `package.json`. Use the Node version supported by each intermediate Angular
   major; use Node 24 LTS at the Angular 22 destination.
2. Add CI on pull requests for clean install (`npm ci`), type checking, lint,
   unit tests, production build, dependency review and a small Playwright smoke
   suite. Cache npm artifacts, never `node_modules`.
3. Capture key journeys: login/logout, auth redirect, admin authorization,
   screen CRUD/publish/preview, menu/media/text asset CRUD, playlist reordering,
   device linking and user/settings administration.
4. Add API contract fixtures or a stable test environment. Record current
   screenshots and Lighthouse/accessibility results for high-value routes.
5. Run `npm audit` and a license/SBOM check, triage findings rather than applying
   `npm audit fix --force`, and define bundle-size budgets.

**Exit gate:** the Angular 14 baseline installs reproducibly and CI can detect a
broken route, API contract, production bundle or visual layout.

### Phase 1 — remove dead weight on Angular 14

1. Prove unused dependencies with `npm explain`, TypeScript/import searches and
   production smoke tests, then remove the unused packages listed above in small
   groups and regenerate the lockfile with the pinned npm version.
2. Replace TSLint/codelyzer with `angular-eslint`. Replace Protractor with
   Playwright; either retain Karma briefly or move unit tests to the Angular
   CLI's supported modern test runner in a later major migration.
3. Replace Bootstrap Notify with `MatSnackBar`, remove unused polyfills and stop
   loading Moment globally.
4. Add explicit path aliases, tighten `noImplicitOverride`,
   `noFallthroughCasesInSwitch` and `forceConsistentCasingInFileNames`, then
   reduce `any` feature-by-feature.

**Exit gate:** no change to product behavior, no unexplained global script and a
clean install/build/test run on the pinned toolchain.

### Phase 2 — migrate one Angular major at a time

For each major `N` from 15 through 22:

```bash
npx @angular/cli@N update @angular/core@N @angular/cli@N
npx @angular/cli@N update @angular/material@N
npm ci
npm run lint
npm test -- --watch=false
npm run build
npm run e2e
```

Before each step, consult the interactive Angular Update Guide and the version
compatibility table. Change Node and TypeScript only to versions supported by
both the current migration source and target. Commit the CLI migration output
without unrelated refactors, review every migration diff, then execute unit,
browser, API-contract and visual-regression gates. Never use `--force` to hide
peer dependency conflicts; upgrade, replace or remove the incompatible package.

Important checkpoints:

- **15:** complete Angular Material's MDC migration and visually inspect every
  Material control; this commonly changes DOM structure, spacing and CSS hooks.
- **16–17:** introduce `takeUntilDestroyed`, convert a low-risk route to
  standalone, adopt the built-in control-flow migration, and migrate to the
  `application` (esbuild/Vite-based development) builder when tests are green.
- **18–20:** continue standalone/lazy-route conversion; replace deprecated
  testing and HTTP/router providers with current functional providers. Trial
  zoneless change detection on a non-critical route, not globally.
- **21–22:** resolve all deprecations before advancing, validate CKEditor and the
  chosen chart package against exact peer ranges, then pin all Angular first-
  party packages to the same 22.x patch line. Angular 22 currently expects
  Zone.js `~0.15` or `~0.16`; keep RxJS 7 unless Angular's migrations and the
  complete dependency graph explicitly support a newer major.

**Exit gate per major:** zero CLI migration warnings left untriaged, tests and
production build pass, bundle budgets hold, and the deployed preview passes the
journey/a11y/visual checklist. Keep the previous deployment artifact available
for rollback.

### Phase 3 — modern Angular architecture

After Angular 22 is stable:

1. Bootstrap with `bootstrapApplication`; convert leaf declarations first and
   delete NgModules only when empty.
2. Use standalone lazy route components, functional guards/interceptors and
   `provideHttpClient`/`provideRouter`.
3. Use signals for local synchronous UI state and computed view state. Keep
   RxJS for HTTP, routing and genuinely asynchronous composition; do not rewrite
   working streams merely to claim signal adoption.
4. Prefer typed reactive forms, immutable typed API DTOs and a thin API client
   layer. Add runtime validation only at untrusted boundaries.
5. Enable strict TypeScript and strict Angular templates one feature at a time.
6. Evaluate zoneless operation only after global scripts and imperative jQuery
   behavior are gone. Benchmark and test it before making it the default.

### Phase 4 — design modernization

Create an accessible Material 3 design system rather than layering another
dashboard theme over the existing CSS:

- Define semantic color, typography, spacing, elevation, shape and motion tokens
  with light/dark/high-contrast themes. Avoid component-internal Material DOM
  selectors so future Material upgrades remain safe.
- Build an application shell with Material/CDK navigation, responsive sidenav,
  command/search affordances, breadcrumbs and consistent page headers.
- Modernize one vertical slice at a time: lists (sorting, filters, pagination,
  empty/loading/error states), detail forms, then creation workflows.
- Meet WCAG 2.2 AA: keyboard navigation, visible focus, landmarks, labeled form
  errors, reduced-motion support, contrast checks and screen-reader announcements.
- Use CDK drag/drop for playlist reordering and add an accessible keyboard
  alternative. Use virtual scrolling only after profiling large collections.
- Add skeleton/progress feedback, optimistic changes only where safely
  reversible, route-level error handling, and unsaved-form navigation guards.

Do not combine the Bootstrap removal, Material 3 restyle and Angular major jump
in one release. Run old and new page shells behind a feature flag if necessary.

## Target dependency posture

The final manifest should be intentionally small:

- Angular core/router/forms/animations (only if animations are used), CDK and
  Material, all on the same exact 22.x patch family.
- RxJS 7 and the Zone.js version required by Angular 22, with Zone.js removable
  only after a successful zoneless rollout.
- CKEditor using its current supported integration, if rich text is still a
  requirement.
- At most one typed ESM chart library, lazy-loaded, if dashboard charts remain.
- `angular-eslint`, Playwright and the chosen unit-test tooling as development
  dependencies only.

Avoid direct dependencies on `webpack`, Vite or esbuild unless custom build
behavior truly requires them; let Angular CLI own compatible build-tool versions.
Use exact versions for Angular packages and automation (Renovate or Dependabot)
to raise tested patch/minor update PRs.

## Release and rollback strategy

- Deploy every major-step artifact to a preview environment backed by a
  non-production tenant. Promote the identical immutable artifact after approval.
- Use feature flags for standalone/design conversions and retain a server-side
  kill switch for risky flows.
- Require monitoring for JavaScript errors, failed API calls, authentication
  failures, Core Web Vitals and key business actions. Compare against the Angular
  14 baseline for at least one representative usage period.
- Roll back the frontend artifact independently. Any API change made during the
  program must be backward compatible for at least the rollback window.
- Prefer small PRs: safety tooling, dead dependency removal, one Angular major,
  one architecture slice, then one design slice.

## Definition of done

- Angular/CLI/CDK/Material are on the latest approved Angular 22 patch with no
  ignored peer conflicts or framework deprecation warnings.
- A clean Node 24 environment can run install, lint, unit, end-to-end and
  production-build commands in CI.
- Legacy global scripts, Bootstrap 4 theme code, TSLint, codelyzer and Protractor
  are removed; every remaining package has an owner and documented purpose.
- Critical journeys, responsive layouts and WCAG 2.2 AA checks pass.
- Strict templates/TypeScript are enabled, subscriptions have clear lifetimes,
  production bundle budgets pass, and rollback has been exercised.
- Tokens are no longer placed in URLs, and the storage/session model has received
  a dedicated security review.

## Authoritative references

- [Angular Update Guide](https://angular.dev/update-guide)
- [Angular version compatibility](https://angular.dev/reference/versions)
- [Build system migration](https://angular.dev/tools/cli/build-system-migration)
- [Standalone component migration](https://angular.dev/reference/migrations/standalone)
- [Built-in control-flow migration](https://angular.dev/reference/migrations/control-flow)
- [Zoneless Angular](https://angular.dev/guide/zoneless)
- [Angular Material 3 theming](https://material.angular.dev/guide/theming)
- [Protractor end-of-life announcement](https://github.com/angular/protractor/issues/5502)

Registry versions are a time-stamped planning input, not a perpetual pin. Re-run
the compatibility and peer-dependency checks immediately before implementation.
