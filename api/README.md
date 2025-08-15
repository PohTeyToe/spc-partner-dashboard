# SPC Partner Dashboard API

Flask 3.x API providing authentication and basic resources for the SPC Partner Dashboard.

## Requirements

- Python 3.11
- Poetry 1.8+

## Setup

```bash
cd api
cp .env.example .env
poetry install
```

## Environment

Create `.env` based on:

```
FLASK_ENV=development
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me
DATABASE_URL=sqlite:///spc.db
```

## Run

```bash
poetry run flask --app spc_api:create_app run --port 5000 --debug
```

This uses the app factory `create_app` within `spc_api`.

## Database (Flask-Migrate)

First-time setup:

```bash
poetry run flask --app spc_api:create_app db init
poetry run flask --app spc_api:create_app db migrate -m "init"
poetry run flask --app spc_api:create_app db upgrade
```

Subsequent schema changes:

```bash
poetry run flask --app spc_api:create_app db migrate -m "message"
poetry run flask --app spc_api:create_app db upgrade
```

## Tests

```bash
poetry run pytest -q
```

## Pre-commit

```bash
poetry run pre-commit install
```

## Seed demo data

After running migrations, seed a demo merchant and user:

```bash
poetry run flask --app spc_api:create_app seed
Demo credentials:

Email: demo@merchant.com
Password: Password123!
```

Development notes: Schemas moved to package `spc_api/schemas` (with `__init__.py`); existing imports continue to work.

