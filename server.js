const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.1";

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const result = await response.json();

    // Extraction du texte généré
    let output = "";

    if (Array.isArray(result) && result[0]?.generated_text) {
      output = result[0].generated_text;
    } else if (result.generated_text) {
      output = result.generated_text;
    } else {
      output = JSON.stringify(result); // fallback brut si structure inattendue
    }

    res.json({ response: output });

  } catch (error) {
    console.error("Erreur HuggingFace:", error.message);
    res.status(500).json({ error: 'Erreur serveur HuggingFace.' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});
