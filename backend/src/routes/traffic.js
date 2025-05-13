import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const dataPath = path.join('data', 'traffic_data.json');

// Route pour obtenir toutes les données d'embouteillage
router.get('/all', (req, res) => {
    if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath));
        res.json(data);
    } else {
        res.json([]);
    }
});

// Route pour obtenir le total des embouteillages déclarés
router.get('/total', (req, res) => {
    if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath));
        res.json({ total: data.length });
    } else {
        res.json({ total: 0 });
    }
});

// Route pour déclarer un embouteillage
router.post('/declare', (req, res) => {
    const { city, street, from_hour, to_hour } = req.body;

    if (!city || !street || !from_hour || !to_hour) {
        return res.status(400).json({ error: 'Champs manquants' });
    }

    let data = [];
    if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath));
    }

    data.push({ city, street, from_hour, to_hour });
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

    res.json({ message: 'Embouteillage enregistré avec succès !' });
});

router.delete('/delete/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);

    if (fs.existsSync(dataPath)) {
        let data = JSON.parse(fs.readFileSync(dataPath));

        // Vérifier si l'index est valide
        if (index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Emplacement d\'embouteillage invalide' });
        }

        // Supprimer l'entrée d'embouteillage
        data.splice(index, 1);  // Supprimer l'entrée à l'index spécifié
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

        res.json({ message: 'Embouteillage supprimé avec succès' });
    } else {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

router.put('/update/:index', (req, res) => {
    const { city, street, from_hour, to_hour } = req.body;
    const index = parseInt(req.params.index, 10);

    if (!city || !street || !from_hour || !to_hour) {
        return res.status(400).json({ error: 'Champs manquants' });
    }

    if (fs.existsSync(dataPath)) {
        let data = JSON.parse(fs.readFileSync(dataPath));

        // Vérifier si l'index est valide
        if (index < 0 || index >= data.length) {
            return res.status(404).json({ error: 'Emplacement d\'embouteillage invalide' });
        }

        // Mettre à jour l'entrée d'embouteillage
        data[index] = { city, street, from_hour, to_hour };
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

        res.json({ message: 'Embouteillage mis à jour avec succès' });
    } else {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});


export default router;
