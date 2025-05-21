// Static Express server for Heroku deployment
const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

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

// Determine the static directory
let staticDir = 'out';
if (!fs.existsSync(path.join(process.cwd(), staticDir))) {
  console.log(`${staticDir} directory not found, falling back to public directory`);
  staticDir = 'public';
}

console.log(`Serving static files from ${staticDir} directory`);

// Serve static files
app.use(express.static(path.join(process.cwd(), staticDir), {
  maxAge: '1y', // Cache static assets for 1 year
  etag: true,
}));

// Handle all routes for SPA
app.get('*', (req, res) => {
  // First try to serve the exact path
  const filePath = path.join(process.cwd(), staticDir, req.path);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }

  // Then try with .html extension
  const htmlPath = path.join(process.cwd(), staticDir, `${req.path}.html`);
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }

  // Then try as a directory index
  const indexPath = path.join(process.cwd(), staticDir, req.path, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  // If all else fails, serve the index.html (for client-side routing)
  const fallbackPath = path.join(process.cwd(), staticDir, 'index.html');
  if (fs.existsSync(fallbackPath)) {
    return res.sendFile(fallbackPath);
  }

  // Last resort: serve maintenance page
  const maintenancePath = path.join(process.cwd(), 'public', 'maintenance.html');
  if (fs.existsSync(maintenancePath)) {
    return res.status(503).sendFile(maintenancePath);
  }

  // If even that fails, send a simple message
  res.status(503).send('Site is under maintenance. Please check back soon.');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
