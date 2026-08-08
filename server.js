const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/content', express.static(path.join(__dirname, 'content')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/recommendations', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recommendations.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
