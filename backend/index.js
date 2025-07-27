const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Load .env file

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Endpoint: Fetch book text from Project Gutenberg
app.get('/api/book/:id', async (req, res) => {
  const { id } = req.params;
  const base = `https://www.gutenberg.org/files/${id}/`;

  const variants = [
    `${id}-0.txt`,
    `${id}.txt`,
    `${id}-8.txt`,
    `${id}-0.txt.utf-8`,
    `${id}-8.txt.utf-8`,
    `${id}.txt.utf-8`
  ];

  for (const variant of variants) {
    try {
      const response = await axios.get(base + variant);
      console.log(`✅ Fetched using: ${base + variant}`);
      return res.send({ text: response.data });
    } catch (e) {
      // Try next variant
    }
  }

  console.error('❌ Failed to fetch book using all known variants');
  res.status(404).send({ error: 'Book not found in available formats' });
});

// Helper: Extract JSON array from LLM response string
function extractJSONArray(str) {
  const match = str.match(/\[\s*{[\s\S]*?}\s*]/);
  return match ? JSON.parse(match[0]) : [];
}

// Endpoint: Analyze characters using OpenRouter
app.post('/api/analyze', async (req, res) => {
  let { text } = req.body;

  if (!text) {
    return res.status(400).send({ error: 'No text provided' });
  }

  const startRegex = /\*\*\* START OF (THIS|THE) PROJECT GUTENBERG EBOOK.*\*\*\*/i;
  const endRegex = /\*\*\* END OF (THIS|THE) PROJECT GUTENBERG EBOOK.*\*\*\*/i;

  const startMatch = text.match(startRegex);
  const endMatch = text.match(endRegex);

  if (startMatch && endMatch) {
    const startIndex = startMatch.index + startMatch[0].length;
    const endIndex = endMatch.index;
    text = text.slice(startIndex, endIndex).trim();
  }

  try {
  const prompt = `
  You are an expert literary text analyst.

  Given the following passage, extract:
  1. A list of named characters mentioned in the text.
  2. Interactions between characters — defined as two characters being mentioned in the same paragraph, dialogue, or scene, and where there is a clear relationship, action, or communication.

  Return a JSON object with the following structure:
  {
    "characters": ["Character1", "Character2", ...],
    "interactions": [
      { "source": "Character1", "target": "Character2", "weight": 1 },
      ...
    ]
  }

  Guidelines:
  - Only include proper names as characters (no pronouns).
  - Count an interaction if two characters are present in the same paragraph and one affects or speaks to the other.
  - If two characters interact multiple times, increase the 'weight'.
  - Ignore narrator commentary unless it describes interactions.

  Text:
  ${text.slice(0, 5000)}
  `;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const raw = response.data.choices?.[0]?.message?.content;

  let characters = [];
  let interactions = [];

  try {
    const parsed = JSON.parse(raw);
    characters = parsed.characters || [];
    interactions = parsed.interactions || [];
  } catch (e) {
    console.warn('Failed to parse JSON object from response:', raw);
    return res.status(500).send({ error: 'Invalid JSON format from LLM' });
  }

  res.send({ characters, interactions });

  } catch (error) {
    console.error('Error from OpenRouter:', error.message);
    res.status(500).send({ error: 'LLM request failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(` Server running on http://literary-character-interactions-production.up.railway.app`);
});
