import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/path-map/:mapName', (req, res) => {
    let { mapName } = req.params;

    mapName = mapName.replace(/\s+/g, '');

    const filePath = path.join('paths', `${mapName}.html`);
    res.sendFile(filePath, { root: process.cwd() });
});

export default router;
