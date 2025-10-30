const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stock = sequelize.define('stock', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  warehouse_id: { type: DataTypes.INTEGER },
  product_id: { type: DataTypes.INTEGER },
  qty: { type: DataTypes.NUMERIC, defaultValue: 0 },

  opening_balance: { type: DataTypes.NUMERIC, defaultValue: 0 },
  total_in: { type: DataTypes.NUMERIC, defaultValue: 0 },
  total_out: { type: DataTypes.NUMERIC, defaultValue: 0 },

  fresh_qty: { type: DataTypes.NUMERIC, defaultValue: 0 },
  box_damage_qty: { type: DataTypes.NUMERIC, defaultValue: 0 },
  material_damage_qty: { type: DataTypes.NUMERIC, defaultValue: 0 },
  wrong_product_qty: { type: DataTypes.NUMERIC, defaultValue: 0 },
  reject_qty: { type: DataTypes.NUMERIC, defaultValue: 0 },

  last_updated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  indexes: [{ unique: true, fields: ['warehouse_id', 'product_id'] }]
});

module.exports = Stock;
