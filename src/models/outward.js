const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Outward = sequelize.define('outward', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  outward_date: DataTypes.DATE,
  warehouse_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.NUMERIC,
  destination: DataTypes.STRING,
  channel: DataTypes.STRING,
  dispatch_doc: DataTypes.STRING,
  financial_year: DataTypes.STRING,
  created_by: DataTypes.INTEGER,
  remarks: DataTypes.TEXT
}, { timestamps: true });

module.exports = Outward;
