#!/bin/bash

echo "🔁 Resetting Prisma schema..."

# Reset migrations and schema
npx prisma migrate reset --force --skip-seed

# Regenerate Prisma Client
npx prisma generate

# Seed the database
# npx prisma db seed

echo "✅ Database reset successfully."
