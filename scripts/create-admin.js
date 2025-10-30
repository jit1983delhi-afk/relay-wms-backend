const bcrypt = require('bcrypt');
const sequelize = require('../src/config/db');
const User = require('../src/models/user');

async function run() {
  await sequelize.authenticate();
  await sequelize.sync();
  const pw = 'Admin@1234';
  const hash = await bcrypt.hash(pw, 10);
  const [user, created] = await User.findOrCreate({
    where: { employee_id: 'ADMIN-TWBP' },
    defaults: { full_name: 'System Admin', email: 'admin@twbp.in', password_hash: hash, role: 'admin' }
  });
  console.log('Admin created:', user.employee_id, 'password:', pw);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
