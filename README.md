# Raryard Next

## Prerequisites

1. Node.js 22.14.0
2. pnpm
3. Docker
4. infisical-cli

## Setup

1. Clone the repository
2. Run `pnpm install`
3. Run `pnpm secret:login` to login to infisical
    - choose `EU` as the region
4. Run `pnpm db:start` to start supabase locally
5. Run `pnpm db:reset` to reset the database and generate the types
6. Configure the `.env.example` file with the correct values to `.env`
7. Run `pnpm dev` to start the development server

## Database

The database is managed by supabase.

### Creating a new migration

Run `supabase migration new <name>` to create a new migration.

If you don't have supabase installed, you can use the following command to create a new migration:

```bash
pnpm dlx supabase migration new <name>
```

### Applying migrations

Run `pnpm db:reset` to apply the migrations to the database.