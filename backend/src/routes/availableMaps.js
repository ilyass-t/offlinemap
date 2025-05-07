import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get('/available-map', (req, res) => {
    const mapDir = path.join(__dirname, '..', '..', 'maps');
    fs.readdir(mapDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de la lecture du dossier maps' });
      }
  
      const htmlMaps = files
        .filter(f => f.endsWith('_map.html'))
        .map(f => f.replace('_map.html', ''));
  
      if (htmlMaps.length === 0) {
        return res.status(404).json({ error: 'Aucune carte disponible. Veuillez en télécharger une.' });
      }
  
      res.json({ city: htmlMaps[0] });
    });
  });
  
  export default router;
