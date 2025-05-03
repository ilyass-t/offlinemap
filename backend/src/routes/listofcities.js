import fs from 'fs';

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';





const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Adjust the path to your maps folder.
// Example: if __dirname is located in backend/backend/routes, then maps are located one level up into maps:
const mapsDir = join(__dirname, '..', '..', 'maps');
router.get('/cities', (req, res) => {
  fs.readdir(mapsDir, (err, files) => {
    if (err) {
      console.error('Erreur lors de la lecture du dossier maps :', err);
      return res.status(500).json({ error: 'Impossible de lister les maps' });
    }
    // Filter only files matching the pattern "<city>_map.html"
    const places = files
      .filter((file) => file.endsWith('_map.html'))
      .map((filename, index) => {
        // Remove the "_map.html" portion to extract the city name
        const city = filename.replace('_map.html', '');
        // Optional: Define a function that returns a country if needed
        return {
          id: `${index + 1}`,
          city,
          
        };
      });
    res.json(places);
  });
});



export default router;
