# 🧾 Expense Management System

![Status: Active](https://img.shields.io/badge/status-active-brightgreen?style=flat-square)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange?style=flat-square)
![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Built with React + Node](https://img.shields.io/badge/stack-React%20%2B%20Node-blueviolet?style=flat-square)

An open-source Expense Management System showcasing a full-stack example: React + Vite frontend, Node/Express backend, and PostgreSQL for persistence. It's designed for demos, hackathons, and as a starting point for production-ready expense workflows.

---

## Table of contents

- Overview
- Quick start (developers)
- Architecture and components
- Detailed setup (DB, backend, frontend)
- API reference (important endpoints)
- Data model & example schemas
- Common operations & CLI scripts
- Testing and CI
- Troubleshooting & tips
- Contribution guide
- License

---

## Overview

This repository implements a lightweight expense management platform with the following goals:

- Demonstrate role-based access (Admin, Manager, Employee).
- Provide a configurable approval workflow (category rules, minimum approvals, approver assignment).
- Support receipt uploads and optional OCR extraction.
- Handle multi-currency submissions with server-side conversion for reporting.
- Ship an easy-to-run dev environment for reviewers and contributors.

The app is organized into `frontend/`, `backend/`, and `database/` folders to keep concerns separated.

---

## Quick start (for reviewers)

If you want to spin up the app quickly and explore the UI, follow these minimal steps.

Prerequisites

- Node.js 16+ (LTS recommended)
- PostgreSQL 12+
- Git

Fast run

1. Clone the repo

```powershell
Fast run

1. Clone the repo

    ```powershell
    git clone https://github.com/KunjShah01/odoo-hackathon.git
    cd odoo-hackathon
    ```

2. Start the database (use your preferred Postgres service) and run the SQL bootstrap scripts

    ```powershell
    cd database
    psql -f db/init.sql -U postgres
    psql -f db/seed.sql -U postgres
    ```

3. Start the backend (default: http://localhost:3001)

    ```powershell
    cd ..\backend
    npm install
    copy .env.example .env
    # edit .env to set DB connection values if necessary
    npm start
    ```

4. Start the frontend (default: http://localhost:5175)

    ```powershell
    cd ..\frontend
    npm install
    npm run dev -- --port 5175
    ```

5. Open the frontend in your browser and login with demo accounts (see Demo credentials section below).
```

2. Start the database (use your preferred Postgres service) and run the SQL bootstrap scripts

```
cd database
psql -f db/init.sql -U postgres
psql -f db/seed.sql -U postgres
```

3. Start the backend (default: http://localhost:3001)

```powershell
cd ..\backend
npm install
copy .env.example .env
# edit .env to set DB connection values if necessary
npm start
```

4. Start the frontend (default: http://localhost:5175)

```powershell
cd ..\frontend
npm install
npm run dev -- --port 5175
```

5. Open the frontend in your browser and login with demo accounts (see Demo credentials section below).

---

## Architecture and components

- frontend/: React + TypeScript + Vite
  - UI components in `src/components` and pages in `src/pages`.
  - API service helpers in `src/services`.

- backend/: Node.js + Express
  - Controllers in `src/controllers` handle routing and business rules.
  - `src/models/database.js` contains the DB client wiring.
  - Middleware for auth and error handling in `src/middleware`.

- database/: SQL scripts to initialize and seed demo data.

Integrations

- Currency conversion is implemented via an external API in `backend` (see `currencyController.js`).
- Optional OCR flow implemented in `ocrController.js` which can be toggled or stubbed for testing.

---

## Detailed setup

1) Database

- Edit `database/README.md` for platform-specific instructions. Basic flow:
  - Create a database (e.g., `expense_db`).
  - Run `database/db/init.sql` to create tables.
  - Run `database/db/seed.sql` to insert demo users, companies, and expenses.

2) Backend

- Copy `.env.example` to `.env` and set these variables:

- DATABASE_URL=postgres://user:password@localhost:5432/expense_db
- PORT=3001
- JWT_SECRET=your_jwt_secret

- Install and run

```powershell
cd backend
npm install
npm start
```

3) Frontend

- Ensure the backend is running and the `.env` in frontend (if used) points to the API.
- Install and run the dev server

```powershell
cd frontend
npm install
npm run dev -- --port 5175
```

---

## API reference (selected endpoints)

Below are the most-used endpoints to interact with the backend. Paths assume base URL `http://localhost:3001/api`.

- POST /api/auth/login
  - Request: { email, password }
  - Response: { token, user }

- GET /api/expenses
  - Query: ?status=pending&assignedTo=managerId
  - Returns a list of expenses filtered by query parameters

- POST /api/expenses
  - Request: { description, amount, currency, category, receipt } (multipart/form-data if file)
  - Creates an expense in DRAFT state

- POST /api/expenses/:id/submit
  - Moves expense from DRAFT to WAITING_APPROVAL and notifies approvers

- POST /api/expenses/:id/approve
  - Body: { approverId, comment }
  - Registers an approval and recalculates status

- GET /api/currency/rates?base=USD&symbols=EUR,GBP
  - Returns latest conversion rates

For a full list, inspect `backend/src/routes`.

---

## Data model (detailed)

Here are the key tables & example schemas (simplified):

- users

  - id: uuid (PK)
  - name: varchar
  - email: varchar (unique)
  - password_hash: varchar
  - role: enum('admin','manager','employee')
  - manager_id: uuid (nullable)
  - company_id: uuid

- companies

  - id: uuid
  - name: varchar
  - base_currency: varchar(3)

- expenses

  - id: uuid
  - employee_id: uuid
  - amount: numeric
  - currency: varchar(3)
  - amount_in_base: numeric
  - category: varchar
  - receipt_url: varchar
  - status: enum('draft','waiting_approval','approved','rejected')
  - created_at, updated_at

- approval_rules

  - id: uuid
  - company_id: uuid
  - category: varchar
  - approvers: jsonb (array of user ids)
  - min_approval_pct: numeric

- approval_records

  - id: uuid
  - expense_id: uuid
  - approver_id: uuid
  - status: enum('approved','rejected')
  - comment: text
  - timestamp: timestamptz

---

## Common operations & scripts

- List seeded users

```powershell
node backend/scripts/list_users.js
```

- Run auth flow script (sanity check)

```powershell
node backend/scripts/test_auth_flow.js
```

---

## Testing and CI

- Backend uses Jest. Run from `backend/`:

```powershell
cd backend
npm test
```

- Frontend unit tests (if present) can be run similarly; see `frontend/package.json`.

CI recommendations

- Add GitHub Actions to run backend tests and ESLint/TypeScript checks on PRs.

---

## Troubleshooting & tips

- Database connection issues
  - Ensure `DATABASE_URL` is correct and Postgres is accepting connections.
  - Use `psql` to confirm connectivity: `psql postgresql://user:pass@localhost:5432/expense_db`.

- Frontend CORS / API errors
  - Confirm backend `CORS` settings allow the frontend origin (http://localhost:5175).

- OCR not returning results
  - OCR controller can be stubbed for offline testing. See `backend/src/controllers/ocrController.js`.

---

## Demo credentials (for reviewers)

Use the seeded demo accounts for quick access. Passwords are all `password` in the seed data.

- Admin: sarah.admin@techcorp.com
- Manager: mike.manager@techcorp.com
- Employee: alice.employee@techcorp.com

---

## Contribution

We welcome contributions — small fixes, issues, and PRs are all appreciated. A good contribution workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Add tests where appropriate
4. Run lint and tests
5. Open a PR describing the change

Guidelines

- Keep PRs focused and small.
- Add tests for new logic in the backend controllers.
- Document public API changes in this README.

Security

- Do not commit secrets. Use `.env` and make sure `.env` is in `.gitignore`.

---

## License

MIT License — see the `LICENSE` file.

---

If you'd like, I can also:

- add a `CONTRIBUTING.md` with explicit PR and branch rules,
- add a `CODE_OF_CONDUCT.md`,
- commit this README and open a PR with the changes.

Would you like me to commit the change now (git commit + push) or just update the file locally? 
 
---

## Environment variables (.env)

The backend expects a `.env` file with the following variables (example):

```
DATABASE_URL=postgres://user:password@localhost:5432/expense_db
PORT=3001
JWT_SECRET=replace_with_a_secure_secret
NODE_ENV=development
CURRENCY_API_KEY=your_currency_api_key_if_used
OCR_API_KEY=your_ocr_api_key_if_used
```

Place `.env` in `backend/` and ensure it's listed in `.gitignore`.

---

## Optional: Docker (quick demo)

This repo includes SQL and app code suitable for containerization. For a quick Docker demo, you can:

1. Build the backend image from `backend/` (add a Dockerfile if not present).
2. Use a Postgres official image and mount `database/db/init.sql`/`seed.sql` on initialization.
3. Start the frontend using a simple static server (or `npm run build` + serve).

Example (high level):

```powershell
# Start Postgres with a named volume
docker run --name expense-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=expense_db -d postgres:13
# Exec seed SQL (adjust for host/mapping)
docker exec -i expense-postgres psql -U postgres -d expense_db < database/db/init.sql
docker exec -i expense-postgres psql -U postgres -d expense_db < database/db/seed.sql
```

---

## Maintainers

This project is maintained by the contributors listed in the repository. If you're joining as a reviewer, open issues or PRs and tag maintainers in the review.

---

## Changelog & release notes

Keep a short `CHANGELOG.md` or use GitHub releases for significant updates. Example entries:

- v0.1.0 — Initial hackathon demo with core expense flows and seeded demo data.

---

If you'd like me to also add a lean `CHANGELOG.md`, a `CONTRIBUTING.md`, or a `CODE_OF_CONDUCT.md`, I can add them and commit everything in one PR.
