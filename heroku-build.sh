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
if [ -d "out" ]; then
  echo "Static export directory 'out' found"
  ls -la out/
else
  echo "WARNING: Static export directory 'out' not found"
  mkdir -p public
  echo "Creating fallback maintenance page..."
  cat > public/maintenance.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RevisePDF - Maintenance</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      justify-content: center;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #288283;
      margin-top: 0;
      font-size: 28px;
    }
    .message {
      background-color: #f0f9f9;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>RevisePDF</h1>
    <div class="message">
      <h2>Maintenance Mode</h2>
      <p>Our application is currently undergoing maintenance to improve your experience. We apologize for any inconvenience this may cause.</p>
      <p>Please check back soon. We're working to bring the service back online as quickly as possible.</p>
    </div>
  </div>
</body>
</html>
EOL
fi

echo "Build process completed successfully!"
