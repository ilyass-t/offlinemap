import { exec } from 'child_process';

export const calculateShortestPath = (req, res) => {
    const { start_lat, start_lon, end_street, graphml_file } = req.body; // ← ajouter graphml_file

    if (!start_lat || !start_lon || !end_street || !graphml_file) {
        return res.status(400).send('Champs manquants');
    }

    // Construire la commande avec 4 arguments
    const command = `python scripts/calculate_path_gps.py ${start_lat} ${start_lon} "${end_street}" "${graphml_file}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur d'exécution: ${error.message}`);
            return res.status(500).send('Erreur serveur');
        }
        if (stderr) {
            console.error(`Erreur stderr: ${stderr}`);
            return res.status(500).send('Erreur script');
        }

        console.log(`✅ Script Python exécuté :\n${stdout}`);
        res.send('Chemin calculé');
    });
};
