require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Public endpoint: Get current date and time
app.get('/api/time', (req, res) => {
    const now = new Date();
    res.json({
        date: now.toISOString().split('T')[0],
        time: now.toISOString().split('T')[1].split('.')[0]
    });
});

// Private endpoint: Fetch weather, currency, and crypto data
app.get('/api/data', authenticateJWT, async (req, res) => {
    try {
        const cities = ['Kyiv', 'Paris', 'Amsterdam', 'London', 'Rome'];
        const currencies = ['UAH', 'USD', 'EUR', 'CAD', 'AUD'];
        const cryptos = ['bitcoin', 'ethereum', 'solana', 'cardano', 'tron'];

        // Example API URLs (Replace with real APIs)
        const weatherAPI = `https://api.example.com/weather?cities=${cities.join(',')}`;
        const forexAPI = `https://api.example.com/exchange-rates?currencies=${currencies.join(',')}`;
        const cryptoAPI = `https://api.example.com/crypto-rates?cryptos=${cryptos.join(',')}`;

        const [weatherRes, forexRes, cryptoRes] = await Promise.all([
            axios.get(weatherAPI),
            axios.get(forexAPI),
            axios.get(cryptoAPI)
        ]);

        res.json({
            weather: weatherRes.data,
            forex: forexRes.data,
            crypto: cryptoRes.data
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Private endpoint: Sort an array of strings
app.post('/api/sort', authenticateJWT, (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Invalid input, expected an array of strings' });
    }

    const sortedArray = req.body.sort();
    res.json(sortedArray);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
