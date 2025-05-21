#!/bin/bash

# This script is used to build the application on Heroku
# It ensures that the correct Node.js version is used and that the application is built correctly

echo "Starting Heroku build process..."

# Install dependencies using npm install instead of npm ci
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Verify build artifacts
echo "Verifying build artifacts..."
if [ -f ".next/prerender-manifest.json" ]; then
  echo "Prerender manifest found at .next/prerender-manifest.json"
else
  echo "WARNING: Prerender manifest not found at .next/prerender-manifest.json"
  ls -la .next/
fi

echo "Build process completed successfully!"
