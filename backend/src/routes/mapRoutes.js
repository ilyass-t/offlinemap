import express from "express";
import { generateMap } from "../controller/generateMapController.js";

const router = express.Router();

router.post("/generate-map", generateMap);

export default router;
