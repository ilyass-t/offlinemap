import express from "express";
import { handleevent } from "../controller/changedpoidcontroller.js";


const router = express.Router();
router.post("/changedpoid", handleevent);
export default router;