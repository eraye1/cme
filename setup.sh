#!/bin/bash

# Initialize git
git init

# Create workspace directories
mkdir packages
cd packages
mkdir frontend backend

# Setup frontend with Vite + React + TypeScript
cd frontend
bunx create-vite . --template react-ts
cd ..

# Setup backend with NestJS
cd backend
bunx @nestjs/cli new . --package-manager bun

# Create .env file for backend
cat > .env << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cme_tracker?schema=public"
EOL

# Install and initialize Prisma
bun add -d prisma
bun add @prisma/client
bunx prisma init

cd ../..

# Install root dependencies
bun install