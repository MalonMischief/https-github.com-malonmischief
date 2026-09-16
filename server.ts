import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", name: "Albruna - Rheinisches Orakel API" });
});

// Oracle prophecy endpoint
app.post("/api/oracle/prophesy", async (req, res) => {
  try {
    const { question, spreadName, runes, seerName = "Albruna" } = req.body;

    const drawnRunesDescription = (runes || [])
      .map(
        (r: any, idx: number) =>
          `Position ${idx + 1} (${r.positionLabel || "Aspekt"}): Fränkisches Zeichen ${r.name} (${r.symbol}), Fränkische Bedeutung: "${r.meaning}", Lage: ${r.isReversed ? "Umgekehrt (Schattenseite/Herausforderung)" : "Aufrecht (Lichtseite/Kraft)"}, Althochdeutsch/Fränkisch: ${r.frankishOldHighGermanName || ""}`
      )
      .join("\n");

    const prompt = `Du bist ${seerName}, eine weise und verehrte rheinfränkische Seherin an den Ufern des Rheins.
Eine ratsuchende Person tritt an dein Heiligtum im Eichenhain am Strom heran.

WICHTIG: Verwende AUSSCHLIESSLICH rheinfränkische und althochdeutsche Begriffe. Verwende KEINE römischen/lateinischen Namen (kein Tacitus, keine lateinischen Phrasen) und KEINE altnordischen/skandinavischen Namen (keine Völva, kein Odin, kein Thor, kein Freya, kein Seiðr, kein Wyrd).

Frage / Anliegen des Ratsuchenden:
"${question ? question : "Offenbarung der verborgenen Strömungen und des rechten Weges"}"

Legung: ${spreadName}
Gezogene fränkische Loshölzer:
${drawnRunesDescription}

Sprich in der erhabenen, naturverbundenen, feierlichen und weisen Stimme der fränkischen Seherin. Verwende Bilder des Rheintals, der Auenwälder, Nebel, alten Eichen, heiligen Quellen und des Herdfeuers der Sippe.

Formatiere deine Antwort in diesen Abschnitten:
1. **Der Gruß der Seherin & Schau**: Eine kurze visionäre Einstimmung auf die Ratsuchende Person und die Schwingung der Frage.
2. **Die Stimme der Loshölzer**: Gehe tief auf jedes gefallene Zeichen ein und verknüpfe es mit dem Anliegen.
3. **Der Webfaden der Zeit**: Was verbindet das Gewordene, die gegenwärtige Prüfung und das Kommende?
4. **Rat der Seherin für das Handeln**: Ein konkreter, kraftvoller fränkischer Rat für Hof, Sippe und Herz.
5. **Seherinnen-Spruch**: Ein schöner zweizeiliger oder vierzeiliger Reimgesang.`;

    const client = getGeminiClient();

    if (client) {
      try {
        const response = await client.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response && response.text) {
          return res.json({
            text: response.text,
            seer: seerName,
            source: "gemini",
          });
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, using traditional seer synthesis:", geminiError);
      }
    }

    // Traditional historical fallback synthesis if no API key or network error
    const fallbackProphecy = generateTraditionalProphecy(seerName, question, spreadName, runes);
    return res.json({
      text: fallbackProphecy,
      seer: seerName,
      source: "traditional",
    });
  } catch (error: any) {
    console.error("Error in /api/oracle/prophesy:", error);
    res.status(500).json({ error: "Fehler bei der Seherinnen-Befragung", details: error.message });
  }
});

function generateTraditionalProphecy(seerName: string, question: string, spreadName: string, runes: any[] = []): string {
  const qText = question ? `zu deinem Anliegen: „${question}“` : "über das Gewebe deiner Tage";
  const runeSummaries = runes.map((r, i) => {
    const status = r.isReversed ? "im Schatten verborgen" : "im lichten Fluss";
    return `• **${r.positionLabel || `Los ${i + 1}`} - ${r.name} (${r.symbol})**: Zeigt ${r.meaning} (${status}). ${r.isReversed ? r.reversedMeaning || "Hüte dich vor Übereilung oder Verhaftung." : r.uprightMeaning || "Die Kräfte fließen dir zu."}`;
  }).join("\n\n");

  return `### Der Gruß der Seherin & Schau
Ich, ${seerName}, Seherin am Rhein, lausche dem Rauschen des mächtigen Stroms und dem Flüstern der alten Eichen ${qText}. Die Hölzer sind gefallen, das weiße Linnen hat die Zeichen empfangen.

### Die Stimme der Loshölzer
${runeSummaries}

### Der Webfaden der Zeit
In der Legung zeigt sich, dass kein Blatt ohne Wind vom Baum fällt. Was dich einst band, löst sich im steten Wasserlauf des Rheins. Die Gegenwart verlangt Achtsamkeit, Treue und Erdung: Nicht durch Hast, sondern durch die Geduld tiefer Wurzeln wirst du deinen Pfad klären.

### Rat der Seherin für das Handeln
Höre auf deine innere Ahnung, die Weisheit der Mütterinnen und Ahnen in dir. Nimm das dargebotene Los nicht als starres Gesetz, sondern als Faden, den deine eigenen Hände weiterweben. Tritt mutig vor, ehre den Bund deiner Sippe und schütze deinen Herd.

### Seherinnen-Spruch
*„Wo Nebel den Rhein umfängt zur Nacht,*  
*erwacht im Kerbzeichen alte Macht.*  
*Vertrau dem Strome, geh den Schritt,*  
*der Segen der Ahnen wandelt mit.“*`;
}

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const isProduction = process.env.NODE_ENV === "production" || (process.argv[1] && process.argv[1].includes("dist"));

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Albruna Oracle Server running on http://localhost:${PORT}`);
  });
}

startServer();
