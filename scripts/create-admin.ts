import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { AdminUser } from "@/models";
import { env } from "@/lib/env";

async function main() {
  await connectDB();

  const email = env.adminEmail.trim().toLowerCase();
  const password = env.adminPassword;

  if (!email || password === "replace-this-before-production") {
    console.warn("Warning: using default admin password. Set ADMIN_PASSWORD in production.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await AdminUser.findOne({ email });

  if (existing) {
    await AdminUser.updateOne(
      { email },
      {
        $set: {
          passwordHash,
          name: existing.name || "Admin",
        },
      },
    );
    console.log(`Updated admin user: ${email}`);
    return;
  }

  await AdminUser.create({
    email,
    passwordHash,
    name: "Admin",
  });

  console.log(`Created admin user: ${email}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
