import User from "./model/user.js";
import bcrypt from "bcrypt";

export const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL||'asmit342sumit@gmail.com';
    const adinExist = await User.findOne({ email: adminEmail });

    if (!adinExist) {
      const adminName = process.env.ADMIN_NAME;
      const adminPassword = process.env.ADMIN_PASSWORD;
      const encryptedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: adminName,
        email: adminEmail,
        role: "admin",
        password: encryptedPassword,
        verified: true
      });
      console.log("✅ Default admin created successfully");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};
