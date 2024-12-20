// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/url_shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Define URL schema and model
const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
}, { timestamps: true });

const Url = mongoose.model('Url', urlSchema);

// Function to generate a short code using MD5 hash
function generateShortCode(url) {
    return crypto.createHash('md5').update(url).digest('hex').substr(0, 7);
}

// Route to create a shortened URL
app.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    try {
        // Check if the URL is already in the database
        let existingUrl = await Url.findOne({ originalUrl });
        if (existingUrl) {
            return res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${existingUrl.shortCode}` });
        }

        // Generate a short code for the new URL
        let shortCode = generateShortCode(originalUrl);
        let urlExists = await Url.findOne({ shortCode });
        while (urlExists) {
            shortCode = generateShortCode(originalUrl + Math.random().toString());
            urlExists = await Url.findOne({ shortCode });
        }
        const newUrl = new Url({ originalUrl, shortCode });
        await newUrl.save();

        res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to handle redirecting short URLs to the original URL
app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    try {
        const url = await Url.findOne({ shortCode });
        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ error: 'Short URL not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// Frontend HTML (in 'public/index.html')
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>URL Shortener</title>
</head>
<body>
    <h1>URL Shortener</h1>
    <form id="shorten-form">
        <input type="text" id="originalUrl" placeholder="Enter URL to shorten" required>
        <button type="submit">Shorten</button>
    </form>
    <div id="result"></div>

    <script>
        document.getElementById('shorten-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalUrl = document.getElementById('originalUrl').value;
            try {
                const response = await fetch('/shorten', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ originalUrl })
                });
                const data = await response.json();
                if (data.shortUrl) {
                    document.getElementById('result').innerHTML = `<p>Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>`;
                } else {
                    document.getElementById('result').innerHTML = `<p>Error: ${data.error}</p>`;
                }
            } catch (error) {
                document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
            }
        });
    </script>
</body>
</html>
*/