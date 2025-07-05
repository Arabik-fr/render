const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = "google/flan-t5-small";

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    console.log("Token utilisé :", HF_TOKEN);

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const result = await response.json();

    let output = "";

    if (Array.isArray(result) && result[0]?.generated_text) {
      output = result[0].generated_text;
    } else if (result.generated_text) {
      output = result.generated_text;
    } else if (typeof result === "string") {
      output = result;
    } else {
      output = JSON.stringify(result);
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
