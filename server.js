const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
  console.log("Corps de la requête :", req.body); // <= AJOUTE CETTE LIGNE

  const prompt = req.body.prompt;
  console.log("Prompt reçu :", prompt); // déjà présent ? sinon ajoute-le aussi

  // ...
});

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Tu es un assistant expert et passionné de la civilisation arabe. Tu réponds avec clarté et détails." },
          { role: "user", content: prompt }
        ]
      })
    });

    const result = await response.json();
    const output = result.choices?.[0]?.message?.content || "❌ Aucune réponse générée.";
    res.json({ response: output });

  } catch (error) {
    console.error("Erreur OpenAI:", error.message);
    res.status(500).json({ error: "Erreur de connexion à OpenAI." });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});
