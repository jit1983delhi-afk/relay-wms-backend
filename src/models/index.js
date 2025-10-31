const sequelize = require('../config/db');
const User = require('./user');
const Warehouse = require('./warehouse');
const Product = require('./product');
const Stock = require('./stock');
const Inward = require('./inward');
const Outward = require('./outward');
const Admin = require("./admin");

Warehouse.hasMany(Stock, { foreignKey: 'warehouse_id' });
Product.hasMany(Stock, { foreignKey: 'product_id' });
Stock.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });
Stock.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = { sequelize, User, Warehouse, Product, Stock, Inward, Outward };
module.exports = { sequelize, User, Warehouse, Product, Stock, Inward, Outward, Admin };

