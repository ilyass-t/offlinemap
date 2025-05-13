import { Router } from "express";
import { spawn } from "child_process";

const router = Router();

router.post("/chatbot", (req, res) => {
    const userMessage = req.body.query;

    const py = spawn("python", ["scripts/chatbot/main.py"]);
    let output = "";

    py.stdin.write(userMessage + "\n");
    py.stdin.end();

    py.stdout.on("data", (data) => {
        output += data.toString();
    });

    py.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    py.on("close", (code) => {
        // Trouver la ligne contenant la réponse propre
        const lines = output.split("\n");
        const botLine = lines.find(line => line.startsWith("🤖 Bot:")) || "❌ Réponse non trouvée.";
        res.json({ response: botLine.trim() });
    });
});

export default router;
