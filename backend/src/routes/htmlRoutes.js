import express from "express";
import { serveCityMap } from "../controller/displayMapController.js";

const router = express.Router();

router.get("/city-map/:city", serveCityMap);

export default router;