import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config(); // Load .env file

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Initialize OpenAI with the API key from .env
const openai = new OpenAI({
    baseURL: "https://api.cow.rip/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
});

// Define a function to call OpenAI
async function runOpenAI(prompt) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
    });

    return chatCompletion.choices[0].message.content;
}

// Handle POST requests to /sendToChatGPT
app.post('/sendToChatGPT', async (req, res) => {
    const { prompt } = req.body;

    try {
        const result = await runOpenAI(prompt);
        res.json({ message: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error occurred while processing your request.' });
    }
});

// Handle OPTIONS preflight requests
app.options('/sendToChatGPT', cors(), (req, res) => {
    res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
