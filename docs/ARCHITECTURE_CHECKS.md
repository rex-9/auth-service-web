# Architecture checks

Run either `./scripts/check_architecture.sh` or `npm run check:architecture` locally. Web CI uses the npm command before the build and test suite; both entry points execute the same checker from the repository root.

The check turns the mechanically enforceable parts of [`LAW.md`](../LAW.md) into a fast guardrail:

- English and Burmese locale trees must have identical keys.
- Every value registered by `AppLocales` must exist in the locale files.
- Translation calls cannot bypass `AppLocales` with raw key strings.
- User-visible JSX text and accessibility labels are reported for localization; developer-facing logs and exceptions remain English.
- Browser storage access stays behind the centralized storage services.
- Network `fetch` calls stay in services.
- Date/time presentation stays behind the centralized UTC-to-local helper.

The telemetry controller and development telemetry buttons are explicitly exempt because their purpose is to inspect or trigger malformed storage and network behavior. New exceptions should be rare, named in `scripts/check_architecture.mjs`, and justified in code review.

The locale checker uses the TypeScript AST and limits visible-copy detection to rendered JSX text plus visible/accessibility attributes. It has no debt baseline or generated allow-list: findings remain visible until the UI copy is localized or removed.
