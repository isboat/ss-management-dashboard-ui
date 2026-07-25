# Angular modernization plan

## Executive recommendation

Upgrade this application incrementally from Angular 14 to the latest stable Angular major that is verified on the day the upgrade starts. Do not jump directly across majors or combine the framework migration with a visual rewrite. Use one pull request per Angular major (`14 -> 15 -> ... -> current`), run the Angular CLI migrations at every step, and keep the application deployable after each pull request.

As of this assessment (25 July 2026), Angular 22 is the expected current stable major based on Angular's six-month release cadence. The exact target and its Node.js, TypeScript, RxJS, Zone.js, Material, and CDK compatibility ranges **must be confirmed** against the official Angular version compatibility table and npm registry before changing dependencies. External registry/documentation access was unavailable in the assessment environment, so this document deliberately does not hard-code unverified patch versions.

## Repository and baseline findings

- The runnable workspace is nested at `src/ss-management-dashboard-ui-app`, rather than the repository root. There is also a second `src/package-lock.json`. Standardize the repository around one workspace and one lockfile before automating upgrades.
- The checked-out branch is `work`; no `origin` remote or local `main` branch is configured. Consequently, `git pull origin main` cannot be performed in this checkout. Configure the canonical remote and merge/rebase the latest `main` before beginning the upgrade.
- The application is Angular 14.2 with Angular Material/CDK 14.2, TypeScript 4.7, RxJS 7.5, Zone.js 0.11, and the legacy Webpack browser builder.
- The UI is based on Material Dashboard 2.8, Bootstrap 4, Bootstrap Material Design, jQuery, Popper 1, Chartist, Moment, Perfect Scrollbar, Bootstrap Notify, Arrive, and global scripts. This legacy stack is the largest modernization and compatibility risk.
- The project still uses TSLint/Codelyzer and Protractor, both retired, alongside Karma/Jasmine. The current `lint` and `e2e` scripts are therefore not a viable modern quality gate.
- The source has 33 components and 13 services, but only 9 spec files. There are approximately 87 explicit subscriptions, only 9 classes implementing `OnDestroy`, and more than 100 explicit `any` occurrences. Strengthen regression coverage and subscription cleanup before broad refactoring.
- TypeScript strictness and Angular strict template checking are disabled. Turning every strict option on during the framework upgrade would make failures difficult to isolate; enable them progressively after reaching the target major.
- Runtime API configuration is compiled into environment files, and the development configuration currently points to a production-hosted API. Move deploy-specific values to runtime configuration and ensure local/test builds cannot accidentally mutate production data.

## Safe delivery strategy

### Phase 0: establish a reproducible baseline

1. Configure `origin`, fetch `main`, and branch from the latest commit. Resolve whether the recently deleted root `appsrc` workspace was an intentional removal; do not resurrect or modify both Angular workspaces.
2. Move the active application to the repository root, or explicitly make `src/ss-management-dashboard-ui-app` the sole workspace. Remove the stray lockfile only after confirming it is not used by deployment automation.
3. Pin a supported Node.js LTS and npm version in `.nvmrc`/`.node-version`, `package.json`, and CI. Use `npm ci`, never a generated lockfile from a different npm generation.
4. Capture baseline production bundle sizes, routes, authentication behavior, API requests, and screenshots for critical flows: login, dashboard, devices, screens, media, playlists, menus, text assets, users, and settings.
5. Add CI gates for clean install, production build, unit tests, linting, and a small browser smoke suite. Add API mocks or a non-production test tenant so tests do not depend on the live service.
6. Add characterization tests around the authentication interceptor/guard, login/logout, permissions, CRUD request shapes, drag-and-drop ordering, file upload, and CKEditor content before changing implementation.

**Exit criterion:** the current Angular 14 application installs and builds reproducibly, critical flows are covered by smoke tests, and baseline bundle/performance data is stored in CI.

### Phase 1: remove obsolete tooling without changing the UI

1. Replace TSLint/Codelyzer with ESLint using `angular-eslint`; initially adopt rules that preserve current behavior, then tighten them separately.
2. Replace Protractor with Playwright for a small, reliable end-to-end suite. Playwright should own cross-browser journey tests; unit/component tests should remain fast and independent.
3. Prefer the current Angular CLI test default for a newly generated target-version workspace. If migrating in place, retain Karma temporarily and migrate the runner only in a dedicated pull request.
4. Remove unused direct dependencies after proving they have no runtime/build references. Initial candidates are `@angular/elements`, `@angular/localize` (unless localization is planned), `express`, `googleapis`, `buffer`, `ajv`, `classlist.js`, and `web-animations-js`. Confirm transitive requirements with `npm explain` before removal.
5. Remove application packages from `dependencies` that are only development tools (for example ESLint) and eliminate unused `@types/*` packages with their legacy libraries.

**Exit criterion:** modern lint and browser tests run on Angular 14, and dependency removal causes no behavior or bundle regression.

### Phase 2: migrate Angular one major at a time

For every major, use a clean branch and repeat this sequence:

```bash
npx ng update @angular/core@<next-major> @angular/cli@<next-major>
npx ng update @angular/material@<next-major>
npm dedupe
npm run lint
npm test -- --watch=false
npm run build -- --configuration production
npx playwright test
```

Review the official Angular Update Guide for that exact transition before running it. Commit CLI migrations separately from manual fixes. Never use `--force` to bypass peer ranges; upgrade, replace, or temporarily isolate the blocking library. Do not skip majors because Angular migrations are version-specific.

Important migration checkpoints:

- **Angular 15:** complete Material's MDC migration and visually review every Material control. Expect CSS selectors that reached into Material internals to break.
- **Angular 16-17:** adopt supported Node/TypeScript versions, move to the application/esbuild builder when the CLI migration offers it, and validate environment replacement, assets, global styles, and CommonJS warnings.
- **Angular 18-current:** run all framework, router, template-control-flow, Material theme, and build-system migrations in order. Recheck supported Node/TypeScript/RxJS ranges at every major rather than preselecting versions.
- Keep `@angular/core`, CLI, compiler CLI, Material, and CDK on the same major. Regenerate the lockfile only through the selected package manager and review it for unexpected duplicate Angular packages.
- At each checkpoint, deploy to a preview environment and compare smoke tests, screenshots, accessibility, Web Vitals, console output, API traffic, and bundle budgets against the baseline.

**Exit criterion:** the app is on the verified latest stable Angular patch, uses only supported runtime/tool versions, has no skipped migrations or peer dependency overrides, and passes preview validation.

### Phase 3: replace the legacy presentation stack

Do this after the Angular upgrade so visual regressions are not confused with framework regressions.

1. Select one component system. Angular Material is already used and is the lowest-risk choice; apply its current Material 3 theming API with design tokens for color, typography, density, spacing, radii, elevation, motion, light/dark mode, and high contrast.
2. Rebuild the application shell with CDK/Material primitives and responsive CSS. Preserve route behavior while replacing the navbar/sidebar/footer a region at a time.
3. Replace Bootstrap Notify with `MatSnackBar`, Bootstrap modal/dropdown behavior with Material/CDK overlays, and Perfect Scrollbar with native scrolling. Then remove jQuery, Arrive, Popper 1, Bootstrap Material Design, and their global scripts.
4. Replace Moment with native `Intl`/Angular date pipes (or a small modern date library only where real date arithmetic requires one).
5. Replace Chartist with an actively maintained, ESM/tree-shakeable chart library after checking accessibility, SSR/browser support, and Angular peer compatibility. Lazy-load dashboard chart code.
6. Upgrade CKEditor through its supported migration path. The predefined classic build packages are a separate compatibility and supply-chain concern; prefer CKEditor's current installation approach and load the editor only on editing routes.
7. Replace external font/icon CDN links with locally managed, privacy-conscious assets or Material Symbols. Remove the `window.global` browser shim after confirming no dependency needs Node globals.
8. Establish accessibility gates: semantic landmarks, keyboard navigation, visible focus, reduced motion, color contrast, form labels/errors, table semantics, responsive zoom, and automated axe checks backed by manual screen-reader testing.

**Exit criterion:** no jQuery-era global scripts remain, the design system is token-driven and accessible, and critical screenshots are approved at phone/tablet/desktop breakpoints.

### Phase 4: adopt modern Angular architecture gradually

1. Convert leaf components to standalone components first, then feature routes, and finally remove NgModules when they no longer add value.
2. Lazy-load each feature route and introduce route-level providers. Keep authentication and API contracts stable during this structural change.
3. Replace constructor injection with `inject()` when touching a class, and use functional interceptors/guards where this improves testability.
4. Replace manual subscription state with `async` pipe, signals, computed state, or `takeUntilDestroyed()` as appropriate. Do not mechanically convert every Observable to a signal; retain Observables for asynchronous streams and cancellation.
5. Adopt built-in template control flow and deferred views on expensive dashboard/editor/chart regions only after measuring the benefit.
6. Introduce typed reactive forms and typed API response/request models. Remove `any` feature by feature while enabling `strict`, `strictTemplates`, `noImplicitReturns`, and related checks one flag at a time.
7. Use `ChangeDetectionStrategy.OnPush` as components become immutable/signal-driven. Profile before considering zoneless change detection, then pilot it on a preview branch with the full browser suite.

**Exit criterion:** features are lazy, state ownership is explicit, subscriptions are lifecycle-safe, strict checking is enabled, and architectural changes show measured bundle or performance improvement.

## Dependency disposition

| Current package/group | Recommendation | Replacement or rationale |
| --- | --- | --- |
| Angular core/CLI/Material/CDK 14 | Upgrade one major at a time | Keep all Angular packages aligned to the verified stable major |
| `jquery`, `arrive`, `popper.js`, `bootstrap-material-design` | Remove | Material/CDK components and overlays; no global DOM mutation |
| Bootstrap 4 | Remove after shell/components migrate | Material 3 plus project-owned layout utilities |
| `bootstrap-notify` | Remove | `MatSnackBar` or a small accessible notification facade |
| `perfect-scrollbar` | Remove | Native CSS overflow/scroll behavior |
| `moment` | Remove | `Intl`, Angular date pipes, or a justified ESM date utility |
| `chartist` | Replace | Select a maintained ESM chart package via a short proof of concept |
| CKEditor 5 v40 packages | Upgrade/repackage separately | Follow current CKEditor Angular integration and lazy-load it |
| TSLint, Codelyzer | Remove immediately | `angular-eslint` |
| Protractor, Jasmine WebDriver types | Remove immediately | Playwright |
| Karma/Jasmine | Keep during framework migration, then reassess | Avoid changing framework, build, and unit runner simultaneously |
| polyfills (`classlist.js`, `web-animations-js`, `hammerjs`) | Remove if browser matrix permits | Modern evergreen browsers and current Material/CDK |
| server/runtime packages (`express`, `googleapis`, `buffer`, `ajv`) | Audit and likely remove | No browser-app ownership unless a documented feature uses them |

Do not replace packages solely because they are old: first identify the user-facing capability, add a regression test, replace or remove it, and compare bundle/security output. Prefer platform and Angular capabilities over adding a new dependency.

## Pull request sequence and rollback

Recommended pull requests:

1. Repository/workspace normalization and reproducible CI.
2. Characterization tests plus Playwright smoke tests.
3. ESLint migration and confirmed unused dependency removal.
4. One pull request for each Angular major, with a preview deployment per major.
5. Current builder/test-runner alignment.
6. Material 3 tokens and shell, followed by one feature area per pull request.
7. Legacy global-script removals.
8. Standalone/lazy route migration.
9. Strictness, lifecycle-safe state, and measured optional features such as zoneless change detection.

Each pull request should be independently revertible. Preserve the previous deployable artifact, database/API compatibility, and feature flags for high-risk UI replacements. Stop the rollout if authentication, API request shapes, error handling, accessibility, bundle budgets, or Web Vitals regress beyond agreed thresholds.

## Definition of done

- Latest stable Angular patch and a supported Node LTS are pinned and documented.
- `npm ci`, lint, unit tests, production build, and Playwright smoke tests pass in CI.
- No `--force`, `legacy-peer-deps`, skipped Angular migrations, or duplicate Angular majors exist.
- No TSLint, Codelyzer, Protractor, jQuery-era global scripts, or unexplained browser polyfills remain.
- Material 3 design tokens, responsive layouts, dark/high-contrast modes, and accessibility checks are in place.
- Strict TypeScript/template checks pass and critical subscriptions are lifecycle-safe.
- Production runtime configuration is environment-safe; preview tests never target production data.
- Bundle, accessibility, error-rate, and Web Vitals results meet or improve the recorded Angular 14 baseline.
