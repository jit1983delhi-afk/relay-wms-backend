const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Warehouse = sequelize.define('warehouse', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, unique: true },
  name: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING }
}, { timestamps: true });

module.exports = Warehouse;
