import { exec } from "child_process";
import path from "path";




const startTileServer = (city) => {
    const cityPath = path.resolve(`ALLtiles/${city}`);  // Résoudre le chemin absolu directement
    const command = `python -m http.server 8000`;

    exec(command, { cwd: cityPath }, (error, stdout, stderr) => {
        if (error) {
            console.error("Erreur lors du démarrage du serveur :", error.message);
            return;
        }

        if (stderr) {
            console.warn("stderr:", stderr);
        }

        console.log("stdout:", stdout);
    });
};




export const generateMap = async (req, res) => {
    const { city } = req.body;

    if (!city) {
        return res.status(400).json({ message: "Le champ 'ville' est requis." });
    }
    startTileServer(city);

    const command = `python scripts/generate_map.py "${city}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("Erreur de génération:", error.message);
            return res.status(500).json({ message: "Erreur de génération de carte" });
        }

        if (stderr) {
            console.warn("stderr:", stderr);
        }

        console.log("stdout:", stdout);
        res.json({ message: "Carte générée avec succès !" });
    });
};
