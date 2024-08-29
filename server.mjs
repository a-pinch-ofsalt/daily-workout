import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

async function fetchWithRetry(url, options, retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            return data;
        } else if (data.error && data.error.includes('currently loading')) {
            console.log(`Model is still loading, retrying in ${delay / 1000} seconds...`);
            await new Promise(res => setTimeout(res, delay));
        } else {
            throw new Error(data.error || 'Unknown error');
        }
    }
    throw new Error('Failed to get a response after multiple attempts');
}

app.post('/sendToChatGPT', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.HUGGING_FACE_API_KEY;

    try {
        const data = await fetchWithRetry('https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6b', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                inputs: 'what is two plus two?',
                parameters: { max_length: 200 },
            }),
        });

        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error sending data to Hugging Face API' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
