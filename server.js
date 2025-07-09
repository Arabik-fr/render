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
  const prompt = req.body.prompt;
  console.log("Prompt reçu :", prompt);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Tu es un assistant expert, passionné et bienveillant sur la civilisation arabe. Réponds de manière captivante et instructive." },
          { role: "user", content: prompt }
        ]
      }),
    });

    const result = await response.json();
    console.log("Réponse OpenAI :", result);

    const output = result.choices?.[0]?.message?.content || "❌ Aucune réponse générée.";
    res.json({ response: output });

  } catch (error) {
    console.error("Erreur OpenAI:", error.message);
    res.status(500).json({ error: "Erreur de connexion à OpenAI." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur le port ${PORT}`);
});
