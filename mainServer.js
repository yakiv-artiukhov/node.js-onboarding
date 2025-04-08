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

// Private endpoint: Fetch weather data for cities
app.get('/api/weather', authenticateJWT, async (req, res) => {
  try {
    const weatherApiUrl = 'http://api.weatherapi.com/v1/current.json';
    const weatherApiKey = process.env.WEATHER_API_KEY;
    const cities = ['Kyiv', 'Paris', 'Amsterdam', 'London', 'Rome'];
    
    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const request = `${weatherApiUrl}?key=${weatherApiKey}&q=${city}&aqi=no`;
        const response = await axios.get(request);
        return response.data;
      })
    );

    res.json({
      weather: weatherData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Private endpoint: Fetch cryptocurrency rates
app.get('/api/crypto', authenticateJWT, async (req, res) => {
  try {
    const cryptoApiUrl = 'https://api.binance.com/api/v3/ticker/price';
    const pairs = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT', 'TRXUSDT'];
    
    const cryptoData = await Promise.all(
      pairs.map(async (pair) => {
        const request = `${cryptoApiUrl}?symbol=${pair}`;
        const response = await axios.get(request);
        return response.data;
      })
    );

    res.json({
      crypto: cryptoData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crypto data'});
  }
});

// Private endpoint: Fetch currency exchange rates
app.get('/api/forex', authenticateJWT, async (req, res) => {
  res.status(500).json({ error: 'Unimplemented! Failed to fetch forex data' });
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