const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const sequelize = require("../config/db");

async function createAdmin() {
  try {
    await sequelize.sync({ alter: true });
    const hashedPassword = await bcrypt.hash("987654321", 10);

    const admin = await Admin.create({
      admin_id: "R3PL-TWBP-2033",
      password: hashedPassword,
    });

    console.log("✅ Default admin created:", admin.admin_id);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
