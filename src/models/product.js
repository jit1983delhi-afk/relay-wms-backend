const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sku: { type: DataTypes.STRING, unique: true },
  name: { type: DataTypes.TEXT },
  brand: { type: DataTypes.STRING },
  uom: { type: DataTypes.STRING },
  barcode: { type: DataTypes.STRING }
}, { timestamps: true });

module.exports = Product;
