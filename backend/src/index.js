import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import changedpoid from "./routes/changedpoid.js";
import mapRoutes from "./routes/mapRoutes.js";
import htmlRoutes from "./routes/htmlRoutes.js";
import shortestPathRoutes from "./routes/shortestPathRoutes.js";
import cors from "cors"; //
import pathRouter from "./routes/pathRouter.js";
import listofcities from "./routes/listofcities.js";
import availableMaps from "./routes/availableMaps.js";


const app = express();

app.use(cors()); // 🛡️ Autoriser toutes les origines
app.use(express.json());
const port = process.env.PORT || 3001;


app.use("/api/auth", authRoutes);
app.use('/api', downloadRoutes);
app.use("/api",changedpoid);
app.use("/api", mapRoutes);
app.use("/api", htmlRoutes);
app.use("/api", shortestPathRoutes);
app.use("/api", pathRouter);
app.use("/api", listofcities);
app.use("/api", availableMaps);
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    connectDB();
});
