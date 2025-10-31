// src/server.js
// Load the main app (where routes are set up) and start the server.

const app = require('./app');           // IMPORTANT: load the app that registers routes
const PORT = process.env.PORT || 10000; // fallback port for local testing

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
