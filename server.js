const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle POST requests
app.post('/test', (req, res) => {
    console.log('Received data:', req.body);
    res.json({
        message: 'Data received successfully!',
        receivedData: req.body
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Test server running at http://localhost:${port}`);
});
