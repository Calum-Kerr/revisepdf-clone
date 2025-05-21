// This script fetches a PDF icon and saves it as favicon.ico
import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetPath = path.join(__dirname, '../../public/favicon.ico');

// Use a free PDF icon
const url = 'https://ext.same-assets.com/1086108138/496691288.svg';

https.get(url, (response) => {
  const fileStream = fs.createWriteStream(targetPath);
  response.pipe(fileStream);

  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Favicon download completed');
  });
}).on('error', (err) => {
  console.error('Error downloading favicon:', err.message);
});
