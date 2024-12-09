// src/server.js
const app = require('./app');
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});
