const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'leaderboard.html'));
});

app.get('/onlybalds', (req, res) => {
    res.sendFile(path.join(__dirname, 'onlybalds.html'));
});

app.get('/api/leaderboard', (req, res) => {
    const fs = require('fs');
    const data = fs.readFileSync(path.join(__dirname, 'leaderboard.json'), 'utf-8');
    res.json(JSON.parse(data));
});

app.listen(PORT, () => {
    console.log(`Wigikin running at http://localhost:${PORT}`);
});
