import { exec } from "child_process";

export const handleevent = (req, res) => {
    const targetstreet = req.body;

    if (!targetstreet) {
        return res.status(400).json({ message: "targetrequis est requi." });
    }

    

    command.push(`python scripts/changedpoid2 "${targetstreet}"`);
    

    

    exec(Command, (error, stdout, stderr) => {
        if (error) {
            // ✅ Détection d'une ville invalide dans le message d'erreur
            if (
                stderr.includes("Nominatim did not geocode query") ||
                stderr.includes("returned 0 results")
            ) {
                return res.status(400).json({ message: `street '${targetstreet}' introuvable. Vérifiez l'orthographe.` });
            }

            console.error("Erreur:", error.message);
            return res.status(500).json({ message: "Erreur script Python" });
        }

        console.log("stdout:", stdout);
        if (stderr) console.warn("stderr:", stderr);

        res.json({ message: "Changement met avec succès !" });
    });
};

