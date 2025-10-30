const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Inward = sequelize.define('inward', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  inward_date: DataTypes.DATE,
  warehouse_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.NUMERIC,
  supplier: DataTypes.STRING,
  po_number: DataTypes.STRING,
  grn_file: DataTypes.STRING,
  financial_year: DataTypes.STRING,
  created_by: DataTypes.INTEGER,
  remarks: DataTypes.TEXT
}, { timestamps: true });

module.exports = Inward;
