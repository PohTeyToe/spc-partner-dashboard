# SPC Partner Dashboard

[![Expo SDK][badge-expo]][link-expo] [![React Native][badge-rn]][link-rn] [![Flask][badge-flask]][link-flask] [![Python][badge-python]][link-python]

A portfolio‑grade full‑stack demo inspired by SPC Student Price Card. Mobile app built with React Native (Expo) and a Flask API. Manage merchant deals end‑to‑end with real authentication, seed data, and a polished mobile UX.

## Highlights

- Mobile: Expo SDK 51, React Navigation, React Query, AsyncStorage, Axios, Gesture Handler with swipe actions and toasts.
- API: Flask, SQLAlchemy, Alembic, Marshmallow, Flask‑JWT‑Extended with a proper “sub is string” fix.
- Features: Login with token persistence, API health check, Deals list with search, create, edit, swipe‑to‑delete, pull‑to‑refresh, loading/empty/error states.
- Android emulator networking solved: automatic API base URL detection (10.0.2.2), plus manual override via app.json.

## Quick Start

Prereqs: Node 20+, Git, Android Emulator (or a device with Expo Go), Python 3.12/3.13, Poetry.

1) API

cd api
poetry install
poetry run flask --app spc_api:create_app db upgrade
poetry run flask --app spc_api:create_app seed
poetry run flask --app spc_api:create_app run --port 5000 --debug


2) Mobile (Android emulator uses 10.0.2.2 to reach the host)

cd mobile
npm install
npx expo install expo-device
npx expo start -c

press "a" to open Android, or scan the QR in Expo Go

Login with: demo@merchant.com / Password123!

## Feature Overview

### Mobile (Expo)

| Feature | Status | Notes |
| --- | --- | --- |
| Login + token persistence | ✅ | Stored in AsyncStorage; auto‑restore on app launch |
| API health check | ✅ | “Test API” shows {"status":"ok"} |
| Deals list | ✅ | Fetches from Flask API; pull‑to‑refresh |
| Search | ✅ | Client‑side filter over fetched list |
| Create deal | ✅ | POST /deals; success toast + list refresh |
| Edit deal | ✅ | PATCH /deals/:id via Edit screen |
| Delete deal | ✅ | Swipe‑to‑delete with confirm, or from Edit screen |
| Loading/empty/error states | ✅ | Activity indicator, empty view, retry |
| Toasts | ✅ | Cross‑platform (ToastAndroid/Alert) |
| Auto API base URL | ✅ | Android emulator → 10.0.2.2; iOS sim → 127.0.0.1; devices → LAN IP |
| Gesture config | ✅ | GestureHandlerRootView + first import of react-native-gesture-handler |
| Pagination / infinite scroll | 🟡 Planned | See Roadmap |
| Profile / Sign out screen | 🟡 Planned | Shows merchant info and sign out |

### API (Flask)

| Feature | Status | Notes |
| --- | --- | --- |
| Health endpoint | ✅ | GET /health returns {"status":"ok"} |
| Auth (JWT) | ✅ | Login issues tokens; “sub” serialized as string |
| Deals CRUD | ✅ | GET list/detail, POST, PATCH, DELETE |
| Data models + Marshmallow | ✅ | SQLAlchemy models and schemas package |
| Alembic migrations + seed | ✅ | CLI seed creates demo merchant, user, and deals |
| Tests (pytest) | 🟡 Planned | See Roadmap |
| Hosted demo | 🟡 Planned | Render/Railway/Fly |

## Project Structure

- api/ — Flask API, models, routes, schemas (as a package), Alembic migrations, CLI seed.
- mobile/ — Expo app, navigation, screens, services, toast helper, gesture configuration.

## Notable Implementation Details

- JWT subject (“sub”) must be a string in PyJWT; tokens are issued with identity as string and cast to int on use.
- Gesture handler is configured correctly: app wrapped in GestureHandlerRootView and the entry imports react-native-gesture-handler first.
- Auto API base URL prefers 10.0.2.2 on Android emulators, 127.0.0.1 on iOS simulator, and LAN IP on devices; supports manual override via app.json extra.apiUrl.

## Screenshots

Add screenshots or a short GIF in docs/screenshots and reference them here.

- Login → Deals list (search, pull‑to‑refresh).
- Edit deal and swipe‑to‑delete.

Example (update paths once images exist):




## Troubleshooting

- Android emulator cannot reach 127.0.0.1 — use 10.0.2.2. The app auto‑detects this; you can also set expo.extra.apiUrl in app.json to force a value.
- If gestures error, ensure App is wrapped in GestureHandlerRootView and react-native-gesture-handler is the first import in the entry file.
- If you see “Subject must be a string” from the API, ensure tokens are created with identity as str(...) and cast back to int with get_jwt_identity().

## Roadmap

- Tests: pytest for API (auth + deals) and one RN component test (Deals list).
- CI: GitHub Actions to run lint, typecheck, and tests on pull requests.
- Pagination for deals, Profile screen with sign out, and a hosted demo API.

## License

MIT

<!--
Badge references – replace these placeholders after pushing to GitHub.
Examples: use shields from img.shields.io and link to your project pages.
-->
[badge-expo]: https://img.shields.io/badge/Expo-SDK%2051-4630EB?logo=expo&logoColor=white
[link-expo]: https://docs.expo.dev

[badge-rn]: https://img.shields.io/badge/React%20Native-0.74-61DAFB?logo=react&logoColor=white
[link-rn]: https://reactnative.dev

[badge-flask]: https://img.shields.io/badge/Flask-3.x-000000?logo=flask&logoColor=white
[link-flask]: https://flask.palletsprojects.com

[badge-python]: https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB?logo=python&logoColor=white
[link-python]: https://www.python.org

[badge-license]: https://img.shields.io/github/license/OWNER/REPO
[link-license]: https://github.com/OWNER/REPO/blob/main/LICENSE

[badge-ci]: https://img.shields.io/github/actions/workflow/status/OWNER/REPO/ci-mobile.yml?branch=main&label=CI
[link-ci]: https://github.com/OWNER/REPO/actions
# spc-partner-dashboard

A portfolio-grade monorepo containing:

- Mobile: React Native Expo app for merchants to manage deals and view analytics
- API: Flask service providing auth, merchant, and deal endpoints

This repository is structured for scalability, developer experience, and CI. It ships with end-to-end connectivity: the mobile app calls the API `/health` endpoint from the Login screen via a "Test API" action.

## Tech Stack

- Mobile (Expo SDK 51, TypeScript): React Navigation v6, TanStack Query, axios, AsyncStorage, NetInfo, react-hook-form, zod
- API (Flask 3.x): Flask-JWT-Extended, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS, Marshmallow, python-dotenv, passlib[bcrypt]
- Tooling: ESLint + Prettier, black + isort + flake8, Husky + lint-staged (mobile), pre-commit (api)

## Repository Structure

```
spc-partner-dashboard/
  .editorconfig
  .gitignore
  README.md
  LICENSE (MIT)
  mobile/
    app.json
    package.json
    tsconfig.json
    babel.config.js
    .eslintrc.js
    .prettierrc
    .env.example
    src/
      App.tsx
      theme/colors.ts
      theme/index.ts
      navigation/RootNavigator.tsx
      navigation/AuthStack.tsx
      navigation/MainTabs.tsx
      screens/auth/LoginScreen.tsx
      screens/main/DashboardScreen.tsx
      screens/main/DealsScreen.tsx
      screens/main/SettingsScreen.tsx
      components/common/Button.tsx
      components/cards/DealCard.tsx
      context/AuthContext.tsx
      services/api.ts
      hooks/useOnlineStatus.ts
      utils/storage.ts
  api/
    pyproject.toml
    README.md
    .env.example
    .flake8
    .pre-commit-config.yaml
    src/
      spc_api/
        __init__.py
        config.py
        extensions.py
        models.py
        schemas.py
        routes/
          __init__.py
          health.py
          auth.py
        wsgi.py
    tests/
      test_health.py
  .github/
    workflows/
      ci-api.yml
      ci-mobile.yml
```

## Prerequisites (macOS)

- Node.js 20 LTS
- Xcode with iOS Simulator
- Python 3.11
- Poetry 1.8+

## Getting Started

### 1) Run the API (Flask)

```bash
cd api
cp .env.example .env
poetry install
poetry run flask --app spc_api:create_app db init  # first time only
poetry run flask --app spc_api:create_app db migrate -m "init"
poetry run flask --app spc_api:create_app db upgrade
poetry run flask --app spc_api:create_app run --port 5000 --debug
```

Environment variables are configured via `.env`. Default DB is SQLite at `sqlite:///spc.db`.

### 2) Run the Mobile app (Expo)

```bash
cd mobile
cp .env.example .env
npm install
npm run prepare  # sets up Husky
npx expo start --ios
```

The app reads the API base URL from `app.json` under `expo.extra.apiUrl` or from `.env` `API_URL`. For iOS Simulator, `http://127.0.0.1:5000` maps to your Mac localhost.

## Validation: End-to-End Health Check

1. After running migrations, seed demo data:
   - `cd api && poetry run flask --app spc_api:create_app seed`
   - Demo credentials — Email: `demo@merchant.com`, Password: `Password123!`
2. With the API running on port 5000, launch the iOS Simulator via `npx expo start --ios`.
3. On the Login screen, tap "Test API" and confirm `{ "status": "ok" }` appears.
4. Enter the demo credentials and tap "Sign In". You should see a success alert and be navigated into the app.

## CI

GitHub Actions validate both projects:

- API: formatting (black), imports (isort), linting (flake8), and tests (pytest)
- Mobile: ESLint and TypeScript type checks

## License

MIT

## Networking (Dev)

The mobile app auto-detects the API base URL:
- If `expo.extra.apiUrl` is set in `mobile/app.json`, that value is used.
- Otherwise it tries to use the Expo LAN IP from the development session.
- If no LAN IP is available, it falls back to:
  - iOS Simulator: http://127.0.0.1:5000
  - Android Emulator: http://10.0.2.2:5000

If you run on a physical device and auto-detect doesn’t pick your LAN IP, set `expo.extra.apiUrl` in `mobile/app.json` to `http://<YOUR_PC_LAN_IP>:5000`.

## Deals API

- Base: `/deals`
- Auth: Bearer JWT (from `/auth/login`)

Endpoints:
- `GET /deals` — list with pagination and filters
  - query: `page` (default 1), `per_page` (default 20, max 50), `q` (search), `active` (true/false)
  - response: `{ items, page, per_page, total, has_next, has_prev }`
- `GET /deals/:id` — fetch a single deal (scoped to your merchant)
- `POST /deals` — create
- `PATCH /deals/:id` — partial update
- `DELETE /deals/:id` — delete

## Mobile Deals

- Deals tab: search with debounce, pull-to-refresh, infinite scroll.
- Create Deal: basic form (title, description), errors surfaced via alerts; list invalidated on success.
- Seed adds demo deals for the demo merchant.

