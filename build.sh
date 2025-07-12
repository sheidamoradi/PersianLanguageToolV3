#!/bin/bash

# Install dependencies
npm ci

# Build frontend
npm run build

# Run database migrations
npm run db:push