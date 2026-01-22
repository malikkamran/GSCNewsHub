import { storage } from "../storage";

async function run() {
  const admin = await storage.getUserByUsername("admin");
  if (!admin) {
    console.error("Admin user not found");
    process.exit(1);
  }
  const canLogin = admin.password === "admin123";
  console.log(JSON.stringify({
    found: true,
    username: admin.username,
    role: admin.role,
    canLoginWithDefaultPassword: canLogin
  }));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
