#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const sourceRoot = path.join(root, "src");

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
const sourceFiles = walk(sourceRoot).filter(
  (file) => /\.(ts|tsx)$/.test(file) && !/\.(test|spec)\.(ts|tsx)$/.test(file),
);
const developerUiFiles = new Set([
  path.join(sourceRoot, "design/examples.tsx"),
  path.join(sourceRoot, "modules/log/components/DevTestButtons.tsx"),
]);
const relative = (file) => path.relative(root, file).replaceAll(path.sep, "/");
const flatten = (value, prefix = "") =>
  Object.entries(value).flatMap(([key, child]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === "object"
      ? flatten(child, next)
      : [[next, child]];
  });

const en = JSON.parse(fs.readFileSync(path.join(sourceRoot, "locales/en.json")));
const my = JSON.parse(fs.readFileSync(path.join(sourceRoot, "locales/my.json")));
const enKeys = new Set(flatten(en).map(([key]) => key));
const myKeys = new Set(flatten(my).map(([key]) => key));
const errors = [];

for (const key of enKeys) if (!myKeys.has(key)) errors.push(`missing-my:${key}`);
for (const key of myKeys) if (!enKeys.has(key)) errors.push(`missing-en:${key}`);

const constantsPath = path.join(sourceRoot, "locales/app_locales.ts");
const constantsSource = fs.readFileSync(constantsPath, "utf8");
const constantsFile = ts.createSourceFile(
  constantsPath,
  constantsSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
const constants = new Map();

const propertyName = (node) =>
  ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : null;
const collectConstants = (object, prefix = []) => {
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = propertyName(property.name);
    if (!name) continue;
    const next = [...prefix, name];
    if (ts.isObjectLiteralExpression(property.initializer)) {
      collectConstants(property.initializer, next);
    } else if (ts.isStringLiteral(property.initializer)) {
      constants.set(`AppLocales.${next.join(".")}`, property.initializer.text);
    }
  }
};
constantsFile.forEachChild((node) => {
  if (!ts.isVariableStatement(node)) return;
  for (const declaration of node.declarationList.declarations) {
    if (
      ts.isIdentifier(declaration.name) &&
      declaration.name.text === "AppLocales" &&
      declaration.initializer &&
      ts.isObjectLiteralExpression(declaration.initializer)
    ) {
      collectConstants(declaration.initializer);
    }
  }
});

for (const [constant, key] of constants) {
  if (!enKeys.has(key)) errors.push(`unknown-key:${constant}:${key}`);
}

const usedConstants = new Set();
const hardcoded = new Set();
const rawKeys = new Set();
const visibleAttributes = new Set([
  "aria-label",
  "label",
  "placeholder",
  "title",
]);

for (const file of sourceFiles) {
  if (file === constantsPath) continue;
  const content = fs.readFileSync(file, "utf8");
  const name = relative(file);
  for (const match of content.matchAll(/AppLocales(?:\.[A-Za-z_$][\w$]*)+/g)) {
    usedConstants.add(match[0]);
  }
  for (const match of content.matchAll(/\b(?:t|translate)\s*\(\s*["']([a-z][a-z0-9_.-]+)["']/g)) {
    rawKeys.add(`${name}:${match[1]}`);
  }

  if (developerUiFiles.has(file)) continue;

  const source = ts.createSourceFile(
    file,
    content,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const inspect = (node) => {
    if (ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, " ").trim();
      if (/[A-Za-z]{2}/.test(text)) {
        hardcoded.add(`${name}:${text}`);
      }
    }
    if (
      ts.isJsxAttribute(node) &&
      visibleAttributes.has(node.name.getText(source)) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer) &&
      /[A-Za-z]{2}/.test(node.initializer.text)
    ) {
      hardcoded.add(`${name}:${node.name.getText(source)}=${node.initializer.text}`);
    }
    ts.forEachChild(node, inspect);
  };
  inspect(source);
}

const unused = new Set(
  [...constants.keys()].filter((constant) => !usedConstants.has(constant)),
);
const findings = {
  hardcoded: [...hardcoded].sort(),
  rawKeys: [...rawKeys].sort(),
  unused: [...unused].sort(),
};

for (const rawKey of findings.rawKeys) errors.push(`raw-key:${rawKey}`);

console.log(
  `Locale report: ${enKeys.size} keys, ${findings.unused.length} unused constants, ` +
    `${findings.rawKeys.length} raw keys, ${findings.hardcoded.length} hardcoded strings.`,
);
if (errors.length) {
  console.error(`Locale checks failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
if (findings.unused.length) {
  console.warn("Unused AppLocales constants:");
  for (const finding of findings.unused) console.warn(`- ${finding}`);
}
if (findings.hardcoded.length) {
  console.warn("User-visible strings to localize:");
  for (const finding of findings.hardcoded) console.warn(`- ${finding}`);
}
console.log("Locale checks passed.");
