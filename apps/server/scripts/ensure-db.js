const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const dbPaths = [
  path.join(root, "data", "dev.db"),
  path.join(root, "prisma", "prisma", "dev.db"),
  path.join(root, "prisma", "dev.db"),
];

const hasDb = dbPaths.some((p) => fs.existsSync(p));

if (!hasDb) {
  console.log("[dev] No local database found — running setup:local …");
  execSync("npm run setup:local", { cwd: root, stdio: "inherit" });
} else {
  const dataDir = path.join(root, "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  for (const p of dbPaths) {
    if (fs.existsSync(p)) {
      try {
        fs.chmodSync(p, 0o664);
        fs.chmodSync(path.dirname(p), 0o775);
      } catch {
        /* ignore permission errors on chmod */
      }
    }
  }
}
