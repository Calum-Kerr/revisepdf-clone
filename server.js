// Custom server for Next.js standalone mode on Heroku
const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const { parse } = require('url');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Log environment information
console.log('Starting server...');
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());

// Enable compression
app.use(compression());

// Determine the Next.js server path
const nextServerPath = path.join(process.cwd(), '.next/standalone/server.js');
const publicPath = path.join(process.cwd(), 'public');
const nextStaticPath = path.join(process.cwd(), '.next/static');
const hasNextServer = fs.existsSync(nextServerPath);

console.log(`Next.js standalone server exists: ${hasNextServer}`);

if (hasNextServer) {
  // If we have the Next.js standalone server, use it
  console.log('Using Next.js standalone server');

  // Import the Next.js server
  const nextServer = require(nextServerPath);
  const nextApp = nextServer.nextServer;

  // Serve public files
  app.use('/public', express.static(publicPath));

  // Serve Next.js static files
  app.use('/_next/static', express.static(nextStaticPath));

  // Let Next.js handle all other routes
  app.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    nextApp.getRequestHandler()(req, res, parsedUrl);
  });
} else {
  // Fallback to static file serving if Next.js server is not available
  console.log('Next.js standalone server not found, falling back to static serving');

  // Check for .next directory
  if (fs.existsSync(path.join(process.cwd(), '.next'))) {
    console.log('.next directory exists');

    // List files in .next directory
    const files = fs.readdirSync(path.join(process.cwd(), '.next'));
    console.log('.next directory contents:', files);
  }

  // Serve static files from public directory
  app.use(express.static(publicPath));

  // Serve maintenance page for all routes
  app.get('*', (req, res) => {
    const maintenancePath = path.join(publicPath, 'maintenance.html');
    if (fs.existsSync(maintenancePath)) {
      return res.status(503).sendFile(maintenancePath);
    }

    // If maintenance page doesn't exist, send a simple message
    res.status(503).send('Site is under maintenance. Please check back soon.');
  });
}

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
