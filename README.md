# MK.SYSTEMS // Root Gateway

The root domain is the central launcher for production applications, public repositories, and engineering activity.

**Live:** https://michaelkage.github.io/

This project intentionally uses plain HTML, CSS, and JavaScript. It has no framework, build step, package manager, or runtime dependency.

## Application routes

| Destination | Route |
|---|---|
| Root gateway | `/` |
| Campus Plug | `/campus-plug67/` |
| OmniPocket | `/OmniPocket/` |
| WasteLens dashboard prototype | `/wastelens-dashboard-prototype/` |

The root gateway links to the public repository directory and keeps manually maintained project-stage information separate from automatically fetched GitHub activity.

## Gateway features

- First-visit boot sequence with a local replay setting.
- Six primary application shortcuts and a searchable command palette.
- Repository directory with search and sorting.
- GitHub repository telemetry and recent public activity.
- System monitor for GitHub API, activity feed, and production-route reachability.
- Desktop environment with live same-origin previews for Campus Plug and OmniPocket.
- Window controls: drag, resize, minimize, maximize, restore, and close.
- Locally pinned systems and persisted window geometry.
- Settings for compact layout and reduced motion.
- System tray with health state, persistent notifications, and quick settings.
- Installable/offline-ready root shell where browser support permits.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `1` to `6` | Launch a primary application |
| `Ctrl+K` / `Cmd+K` | Open command palette |
| `Ctrl+,` / `Cmd+,` | Open settings |
| `Ctrl+Shift+D` / `Cmd+Shift+D` | Toggle desktop environment |
| `Escape` | Close the active overlay or panel |

## Offline and install behavior

The root gateway is a progressive web app. Its service worker caches only the root shell, web manifest, and application icon.

It deliberately does **not** intercept:
- Campus Plug or OmniPocket routes.
- Other production sub-application paths.
- GitHub API requests or other dynamic network data.

When offline, the cached gateway can still load, but GitHub telemetry, recent activity, and live route checks require a network connection. A waiting service-worker update is applied from **Quick settings**.

When changing the service worker's cache contents or caching behavior, increment `CACHE_NAME` in `sw.js` so clients receive a new cache version.

## Browser-local preferences

The gateway stores preferences in the current browser profile. These values are not synchronized across devices.

| Key | Purpose |
|---|---|
| `mk.system.booted.v1` | Whether the first-visit boot sequence has completed |
| `mk.system.settings.v1` | Compact layout and motion preferences |
| `mk.system.pinned.v1` | Pinned application and repository links |
| `mk.system.notifications.v1` | Recent system notifications and read state |
| `mk.system.windows.v1` | Per-application window geometry |

Clearing browser storage resets these local preferences. It does not change deployed application data.

## Repository structure

```text
.
├── .github/
│   └── workflows/
│       └── portfolio-link-health.yml
├── icons/
│   └── mk-system.svg
├── index.html
├── manifest.webmanifest
├── sw.js
└── README.md
```

## Validation and deployment

GitHub Pages publishes the root gateway through its managed deployment workflow. The link-health workflow runs on relevant source changes, on its scheduled cadence, and manually.

The workflow validates:
- HTML structure and unique element IDs.
- Inline JavaScript syntax.
- Service-worker JavaScript syntax.
- Web manifest structure and required local assets.
- Public production routes and repository links.

The link-health check verifies HTTP reachability. It does not claim to verify application authentication, backend dependencies, or end-to-end behavior inside embedded applications.
