const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint for sentiment analysis
app.post('/analyze-sentiment', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    // Spawn the child process (Python script)
    const pythonProcess = spawn('python', ['sentiment_analysis.py', text]);

    let sentiment = '';
    let error = '';

    // Listen for Python script output
    pythonProcess.stdout.on('data', (data) => {
        sentiment += data.toString();
    });

    // Listen for Python script errors
    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    // Listen for Python script exit
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Something went wrong', pythonError: error });
        }

        // Sentiment is received as string from Python, parse it to JSON
        try {
            const sentimentJSON = JSON.parse(sentiment);
            res.json(sentimentJSON);
        } catch (error) {
            res.status(500).json({ error: 'Failed to parse sentiment data', pythonError: error });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
