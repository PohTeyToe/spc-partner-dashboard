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

