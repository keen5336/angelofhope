# PetTrack

A production-ready pet adoption management system for nonprofits. Built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- **Public site**: Browse adoptable pets with search and filtering by species, status, location, and tags
- **Pet detail pages**: Full pet profiles with photos, description, and attributes
- **Admin dashboard**: Summary metrics and quick navigation
- **Admin pet management**: Create, edit, archive pets; manage tags and photos
- **Admin location management**: Shelters, pet stores, and foster homes
- **Admin tag management**: Categorized tags with optional color coding
- **Credential-based auth**: Secure staff login with session management
- **Location history tracking**: Automatic history when a pet's location changes

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing
- [jose](https://github.com/panva/jose) for JWT session tokens

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Secret key for JWT signing (min 32 chars) |

Generate a secure `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

Example `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pettrack"
AUTH_SECRET="your-generated-32-char-secret-here"
```

### Install Dependencies

```bash
npm install
```

### Set Up PostgreSQL

Create the database:

```bash
createdb pettrack
```

Or using psql:

```sql
CREATE DATABASE pettrack;
```

### Run Prisma Migrations

```bash
npx prisma migrate dev --name init
```

Or for production:

```bash
npx prisma migrate deploy
```

### Seed the Database

```bash
npx prisma db seed
```

This creates:
- Admin user
- Staff user
- 5 locations (shelters, pet store, foster homes)
- 10 tags
- 12 sample pets with photos

### Start the App

**Development:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Production build:**

```bash
npm run build
npm start
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@pettrack.org` | `admin123` |
| Staff | `staff@pettrack.org` | `staff123` |

> **Important:** Change these credentials before deploying to production.

## App Structure

```
app/
  page.tsx                    # Public homepage (pet grid)
  pets/[id]/page.tsx          # Public pet detail page
  login/                      # Login page
  admin/                      # Protected admin area
    page.tsx                  # Dashboard
    pets/                     # Pet management
    locations/                # Location management
    tags/                     # Tag management
  actions/                    # Server actions
components/
  ui/                         # Base UI components
  pet-form.tsx                # Pet create/edit form
  location-form.tsx           # Location create/edit form
  tag-form.tsx                # Tag create/edit form
  admin-nav.tsx               # Admin navigation
  public-nav.tsx              # Public navigation
  pet-filters.tsx             # Public pet filter bar
lib/
  prisma.ts                   # Prisma client singleton
  auth.ts                     # Session/JWT utilities
  constants.ts                # Enum display labels
  utils.ts                    # Utility functions
prisma/
  schema.prisma               # Database schema
  seed.ts                     # Seed script
  migrations/                 # Migration files
proxy.ts                 # Auth middleware for admin routes
```

## Public Routes

| Route | Description |
|-------|-------------|
| `/` | Pet adoption listings |
| `/pets/[id]` | Pet detail page |
| `/login` | Staff login |

## Admin Routes (Requires Auth)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard |
| `/admin/pets` | Pet list |
| `/admin/pets/new` | Create pet |
| `/admin/pets/[id]/edit` | Edit pet |
| `/admin/locations` | Location list |
| `/admin/locations/new` | Create location |
| `/admin/locations/[id]/edit` | Edit location |
| `/admin/tags` | Tag list |
| `/admin/tags/new` | Create tag |
| `/admin/tags/[id]/edit` | Edit tag |
