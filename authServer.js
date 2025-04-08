require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT_AUTH || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

// Public endpoint: Authentication
app.post('/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Dummy authentication logic
  if (username === 'user' && password === 'password') {
    const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/echo', (req, res) => {
  res.json({ message: 'Hello from the auth server!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});