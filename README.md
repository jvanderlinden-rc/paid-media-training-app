# Paid Media Training Web App

## Overview
Interactive training app for paid media onboarding. Sections are organized by difficulty level. Each module contains concept content, practice exercises, and a graded test. Each section ends with a final exam.

## Stack
- Next.js (App Router)
- React + TypeScript
- Prisma + Postgres

## Local Setup
1. Install dependencies
2. Copy `.env.example` to `.env` and set `DATABASE_URL`
3. Run Prisma generate + migrate
4. Start dev server

## Content & Exercises
Content blocks are stored as structured JSON:
- `text`
- `callout`
- `diagram` (Mermaid syntax, rendered as code block placeholder)
- `table`
- `example`

Exercise types:
- `mcq`
- `short_text`
- `drag_drop`

## API Endpoints
- `GET /api/sections`
- `GET /api/modules?sectionId=`
- `GET /api/modules/:id`
- `POST /api/attempts`
- `GET /api/reports`
- `POST /api/admin/content/upload`
- `PATCH /api/admin/module/:id`

## Notes
- Auth is stubbed; integrate OIDC/SAML for SSO.
- PDF/Doc parsing is stubbed; plug in extraction pipeline to create draft modules.
