import express from "express";
import { handleDownload } from "../controller/downloadController.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Preserve __dirname compatibility with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📥 POST /api/download
router.post("/download", handleDownload);

// 🌐 GET /api/load-map/:city
router.get("/load-map/:city", (req, res) => {
  const city = req.params.city;
  const sanitizedCity = city;
  const filePath = path.join(__dirname, '..', '..', 'maps-html', `${sanitizedCity}.html`);


  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading map file:", err);
      return res.status(404).send("Map not found");
    }

    res.send(data);
  });
});

export default router;
