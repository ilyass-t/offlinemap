import { exec } from "child_process";
import path from "path";

const startTileServer = (city) => {
    const cityPath = path.resolve(`ALLtiles/${city}`);
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

export const handleDownload = (req, res) => {
    const { city, type } = req.body;

    if (!city || !type) {
        return res.status(400).json({ message: "Ville et type sont requis." });
    }

    let commands = [];

    if (type === "graphml" || type === "both") {
        commands.push(`python scripts/download_graph.py "${city}"`);
    }

    if (type === "tiles" || type === "both") {
        commands.push(`python scripts/download_tiles.py "${city}"`);
    }

    const downloadCommand = commands.join(" && ");

    console.log("Téléchargement en cours...");
    exec(downloadCommand, (downloadError, downloadStdout, downloadStderr) => {
        if (downloadError) {
            if (
                downloadStderr.includes("Nominatim did not geocode query") ||
                downloadStderr.includes("returned 0 results")
            ) {
                return res.status(400).json({ message: `Ville '${city}' introuvable. Vérifiez l'orthographe.` });
            }
            console.error("Erreur de téléchargement :", downloadError.message);
            return res.status(500).json({ message: "Erreur script de téléchargement" });
        }

        console.log("Téléchargement terminé.");
        console.log("stdout:", downloadStdout);
        if (downloadStderr) console.warn("stderr:", downloadStderr);

        console.log("Génération de la carte...");
        const generateCommand = `python scripts/generate_map.py "${city}"`;
        startTileServer(city);

        exec(generateCommand, (genError, genStdout, genStderr) => {
            if (genError) {
                console.error("Erreur de génération:", genError.message);
                return res.status(500).json({ message: "Erreur de génération de carte" });
            }

            if (genStderr) {
                console.warn("stderr:", genStderr);
            }

            console.log("stdout:", genStdout);
            

            res.json({ message: "Carte générée avec succès après téléchargement !" });
        });
    });
};
