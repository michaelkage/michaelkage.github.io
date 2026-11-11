# MK.SYSTEMS // System Gateway

The root domain is the central launcher for production applications, public repositories, and engineering activity. Its visual system follows an editorial Swiss direction: warm paper, near-black ink, restrained vermilion, expressive serif display type, and precise monospace utility text.

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
- Locally pinned systems, persisted window geometry, and stable per-application identities.
- Application lifecycle tracking (created, running, minimized, closed, faulted), crash recovery, and coordinated window restoration.
- Bounded recent-launch history with one-click relaunch; restored embedded apps wait for an explicit resume action.
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
| `mk.system.session.v1` | Last desktop session, lifecycle states, focus, and window layout |
| `mk.system.session.marker.v1` (session storage) | Detects an interrupted tab session for crash recovery |
| `mk.system.launch-history.v1` | Last 30 application launches |

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

## Visual system and typography

The interface uses Newsreader for display typography and IBM Plex Mono for utility text. Both are loaded from Google Fonts with local serif and monospace fallbacks. The core gateway remains dependency-free and runs as static HTML, CSS, and JavaScript.

The PWA manifest, browser theme color, and maskable SVG icon share the same paper-and-ink palette as the live interface. The desktop workspace intentionally uses a dark, high-contrast counterpart to distinguish the working environment from the editorial launcher.

## Validation and deployment

GitHub Pages publishes the root gateway through its managed deployment workflow. Source pushes trigger structural and JavaScript validation, then wait up to ten minutes for the deployed homepage to match the repository byte-for-byte and the service-worker version to match before checking public routes. Public route checks run in parallel with bounded retries. The workflow has a twenty-minute job ceiling to accommodate GitHub Pages deployment delays. Scheduled and manual runs also check public routes.

The workflow validates:
- HTML structure and unique element IDs.
- Inline JavaScript syntax.
- Service-worker JavaScript syntax.
- Web manifest structure, matching browser/PWA theme colors, editorial design tokens, flat application icon, and required local assets.
- Service-worker cache version alignment.
- Public production routes and repository links, checked concurrently with bounded retries.

The link-health check verifies HTTP reachability. It does not claim to verify application authentication, backend dependencies, or end-to-end behavior inside embedded applications.
