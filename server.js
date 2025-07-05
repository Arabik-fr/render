const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://arabik-fr.github.io", // pour attribution API
        "X-Title": "Assistant Arabik"
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct:free",
        messages: [
          { role: "system", content: "Tu es un expert captivant et bienveillant de la civilisation arabe. Sois instructif et passionné." },
          { role: "user", content: prompt }
        ]
      }),
    });

    const result = await response.json();
    console.log("Réponse OpenRouter complète :", result);

    const output = result.choices?.[0]?.message?.content || "❌ Aucune réponse générée.";
    res.json({ response: output });

  } catch (error) {
    console.error("Erreur OpenRouter:", error.message);
    res.status(500).json({ error: "Erreur de connexion à OpenRouter." });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur OpenRouter en ligne sur le port ${PORT}`);
});
