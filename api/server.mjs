import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config(); // Load .env file

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
    baseURL: "https://api.cow.rip/api/v1",
    apiKey: process.env.OPENAI_API_KEY,
});

async function runOpenAI(prompt) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
    });

    return chatCompletion.choices[0].message.content;
}

app.post('/sendToChatGPT', async (req, res) => {
    const { prompt } = req.body;

    console.log(`prompt = ${prompt}`);

    try {
        // Call the OpenAI function
        const result = await runOpenAI(prompt);
        res.json({ message: result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error occurred while processing your request.' });
    }
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
