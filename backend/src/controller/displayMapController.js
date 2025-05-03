import { fileURLToPath } from 'url';
import path from 'path';
import { exec } from 'child_process';
import selectedCityManager from '../singleton/SelectedCityManager.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const startTileServer = (city) => {
    const cityPath = path.resolve(`ALLtiles/${city}`);
    const command = `python -m http.server 8000`;

    exec(command, { cwd: cityPath }, (error, stdout, stderr) => {
        if (error) {
            console.error("Erreur serveur tuiles :", error.message);
            return;
        }
        if (stderr) console.warn("stderr:", stderr);
        console.log("stdout:", stdout);
    });
};

export const serveCityMap = (req, res) => {
    const city = req.params.city;
    selectedCityManager.setCity(city.toLowerCase());
    
    const safeCity = selectedCityManager.getCity();


    startTileServer(safeCity);

    const mapPath = path.join(__dirname, "../../maps", `${safeCity}_map.html`);

    res.sendFile(mapPath, (err) => {
        if (err) {
            console.error("Erreur envoi fichier HTML :", err.message);
            res.status(404).send("Carte introuvable.");
        }
    });
};
