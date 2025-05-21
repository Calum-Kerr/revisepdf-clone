// Simple Express server for Heroku deployment
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Log environment information
console.log('Starting server...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());

// Check if .next directory exists
try {
  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    console.log('.next directory exists');

    // List files in .next directory
    const files = fs.readdirSync(nextDir);
    console.log('.next directory contents:', files);

    // Check for specific files
    if (fs.existsSync(path.join(nextDir, 'server'))) {
      console.log('.next/server directory exists');
    }

    if (fs.existsSync(path.join(nextDir, 'prerender-manifest.json'))) {
      console.log('prerender-manifest.json exists');
    }
  } else {
    console.error('.next directory does not exist');
  }
} catch (error) {
  console.error('Error checking .next directory:', error);
}

// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Serve the maintenance page as the default route
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'maintenance.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
