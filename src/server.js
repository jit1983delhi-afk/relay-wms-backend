// src/server.js

const dotenv = require('dotenv');
dotenv.config();

const app = require('./app'); // ✅ correct path — not ./src/app

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('✅ Routes active: /api/auth, /api/import, /api/reports');
});
