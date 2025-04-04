const jwt = require('jsonwebtoken');
console.log(jwt.sign({ user: 'test' }, 'random-string-here', { expiresIn: '1h' }));