import express from 'express';
import { calculateShortestPath } from '../controller/shortestPathController.js';

const router = express.Router();


router.post('/shortest-path', calculateShortestPath);

export default router;
