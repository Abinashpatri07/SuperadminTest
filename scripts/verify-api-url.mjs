/**
 * Pre-build guard: makes it impossible to ship a frontend bundle that points
 * at a local/dev backend.
 *
 * This is the exact failure that broke the deployed portal - the Vercel
 * project had VITE_API_URL set to http://localhost:5000, and because Vite
 * gives process.env precedence over .env files, the production bundle was
 * built against localhost and every API call failed.
 *
 * Run automatically by `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";

const root = process.cwd();
const mode = process.env.VITE_BUILD_MODE || process.env.MODE || "production";
const isProduction = mode === "production";

const errors = [];

if (isProduction) {
  const env = loadEnv(mode, root);
  const url = (env.VITE_API_URL || "").trim();

  if (!url) {
    errors.push(
      `VITE_API_URL is not set for mode "${mode}".\n` +
        `  Add it to .env.${mode} or set it as a build environment variable.`
    );
  } else if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(url)) {
    errors.push(
      `VITE_API_URL points to a local address: "${url}"\n` +
        `  A production build must point at the deployed backend.\n` +
        `  If this value comes from a hosting provider's environment settings,\n` +
        `  remove/override the VITE_API_URL variable there.`
    );
  } else if (!/^https:\/\//i.test(url)) {
    errors.push(`VITE_API_URL must be an https:// URL in production, got "${url}"`);
  }

  // The runtime override (public/config.js) is what the deployed app actually
  // uses, so validate it too.
  const runtimeConfigPath = path.join(root, "public", "config.js");
  if (!fs.existsSync(runtimeConfigPath)) {
    errors.push("public/config.js is missing - the deployed app would have no API URL.");
  } else {
    const runtimeSource = fs.readFileSync(runtimeConfigPath, "utf8");
    const match = runtimeSource.match(/API_URL:\s*["']([^"']+)["']/);
    if (!match) {
      errors.push('public/config.js does not define an "API_URL" entry.');
    } else if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(match[1])) {
      errors.push(`public/config.js API_URL points to a local address: "${match[1]}"`);
    }
  }
}

if (errors.length) {
  console.error("\n[verify-api-url] Build aborted:\n");
  for (const e of errors) console.error(`  - ${e}\n`);
  process.exit(1);
}

const resolved = loadEnv(mode, root).VITE_API_URL || "(runtime override: public/config.js)";
console.log(`[verify-api-url] mode="${mode}" VITE_API_URL=${resolved}`);
