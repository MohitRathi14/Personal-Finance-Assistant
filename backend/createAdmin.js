import { user } from "./model/user.js";
import bcrypt from "bcrypt";

export const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adinExist = await user.findOne({ email: adminEmail });

    if (!adinExist) {
      const adminName = process.env.ADMIN_NAME;
      const adminPassword = process.env.ADMIN_PASSWORD;
      const encriptidPassword = await bcrypt.hash(adminPassword, 10);

      await user.create({
        name: adminName,
        email: adminEmail,
        role: "admin",
        passord: encriptidPassword,
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
