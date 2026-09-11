#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const failures = [];

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });

const sourceFiles = walk(sourceRoot).filter((file) => /\.(ts|tsx)$/.test(file));
const relative = (file) => path.relative(root, file).replaceAll(path.sep, "/");

const exceptions = {
  storage: new Set([
    "src/services/api.service.ts",
    "src/services/atom.service.ts",
    "src/modules/log/log.controller.ts",
    "src/modules/log/components/DevTestButtons.tsx",
  ]),
  fetch: new Set(["src/modules/log/components/DevTestButtons.tsx"]),
  datePresentation: new Set([
    "src/helpers/date.helper.tsx",
    "src/hooks/useBrowserTimeZone.ts",
  ]),
};

for (const file of sourceFiles) {
  const name = relative(file);
  const content = fs.readFileSync(file, "utf8");

  if (/\b(?:localStorage|sessionStorage)\s*\./.test(content) && !exceptions.storage.has(name)) {
    failures.push(`Direct browser storage access: ${name}`);
  }
  if (/\bfetch\s*\(/.test(content) && !name.endsWith(".service.ts") && !exceptions.fetch.has(name)) {
    failures.push(`Direct fetch outside a service: ${name}`);
  }
  if (/\.(?:toLocaleDateString|toLocaleTimeString)\s*\(|new\s+Intl\.(?:DateTimeFormat|RelativeTimeFormat)/.test(content) && !exceptions.datePresentation.has(name)) {
    failures.push(`Raw date/time presentation outside the shared helper: ${name}`);
  }
}

if (failures.length) {
  console.error(`Architecture checks failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Architecture checks passed (${sourceFiles.length} source files).`);
