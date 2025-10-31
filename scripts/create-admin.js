require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});

(async () => {
  try {
    // Create users table if not exists
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(100),
        role VARCHAR(50),
        password_hash VARCHAR(255) NOT NULL
      );
    `);

    // Create default admin user
    const password = '987654321';
    const hash = await bcrypt.hash(password, 10);

    await sequelize.query(`
      INSERT INTO users (employee_id, full_name, role, password_hash)
      VALUES ('R3PL-TWBP-2033', 'Admin User', 'admin', '${hash}')
      ON CONFLICT (employee_id) DO NOTHING;
    `);

    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
    process.exit(1);
  }
})();
