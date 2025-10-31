const app = require('./app'); // Import your main app with all routes
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('✅ API endpoints ready at /api/auth, /api/import, /api/reports');
});
