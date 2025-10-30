const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  full_name: { type: DataTypes.STRING, allowNull: false },
  email: DataTypes.STRING,
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'operator' }
}, { timestamps: true });

module.exports = User;
