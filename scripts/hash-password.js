// Utility untuk generate bcrypt hash dari password admin.
// Pakai: npm run hash:password -- "password-kamu"
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error('Cara pakai: npm run hash:password -- "password-kamu"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nHASH PASSWORD KAMU (salin ke ADMIN_PASSWORD_HASH di .env):\n");
console.log(hash);
console.log("");
