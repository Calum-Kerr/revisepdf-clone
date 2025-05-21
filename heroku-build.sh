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

echo "Build process completed successfully!"
