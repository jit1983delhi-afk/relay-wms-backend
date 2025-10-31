// redeploy fix
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const importRoutes = require('./routes/imports');
const reportsRoutes = require('./routes/reports');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/import', importRoutes);
app.use('/api/reports', reportsRoutes);

// health
app.get('/api/health', (req,res) => res.json({ ok: true }));

async function init() {
  await sequelize.authenticate();
  await sequelize.sync();
}
init().catch(err => console.error('DB init error', err));

module.exports = app;
