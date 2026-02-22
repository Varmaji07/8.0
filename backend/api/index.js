// Serverless entry point for Vercel
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
require('../config/db');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const userRouter = require('./User');

// Jokes Endpoint
const jokes = [
    { id: 1, title: 'Joke 1', content: 'Joke 1 content' },
    { id: 2, title: 'Joke 2', content: 'Joke 2 content' },
    { id: 3, title: 'Joke 3', content: 'Joke 3 content' }
];

app.get('/jokes', (req, res) => {
    res.send(jokes);
});

// Use Routes
app.use('/user', userRouter);

// Export as serverless function
module.exports = app;
