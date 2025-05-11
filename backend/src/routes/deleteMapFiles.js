import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

router.delete('/:city', (req, res) => {
  const { city } = req.params;

  const graphFile = path.join(__dirname,'..', '..', 'graphs', `ALL${city}.graphml`);
  const mapFile = path.join(__dirname,'..', '..', 'maps', `${city}_map.html`);
  const tileFolder = path.join(__dirname,'..', '..', 'ALLtiles', city);

  const deletedFiles = [];
  const deletedFolders = [];

  // Delete files
  [graphFile, mapFile].forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deletedFiles.push(path.basename(filePath));
    }
  });

  // Delete tile folder
  if (fs.existsSync(tileFolder)) {
    deleteFolderRecursive(tileFolder);
    deletedFolders.push(`${city}/`);
  }

  if (deletedFiles.length === 0 && deletedFolders.length === 0) {
    return res.status(404).json({ message: 'No files or folders found to delete' });
  }

  res.json({ message: 'Deleted items', deletedFiles, deletedFolders });
});

export default router;
