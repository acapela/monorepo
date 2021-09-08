import crypto from "crypto";
import fs from "fs";
import path from "path";

import tempDir from "temp-dir";
import { globby } from "zx";

function getTempFilePathForGlob(glob: string) {
  const tempPath = path.resolve(tempDir, normalizeGlob(glob));

  return tempPath;
}

function readFile(path: string): string | null {
  if (!fs.existsSync(path)) {
    return null;
  }

  return fs.readFileSync(path).toString();
}

function writeFile(path: string, content: string) {
  return fs.writeFileSync(path, content);
}

function getGlobCurrentHash(glob: string) {
  const path = getTempFilePathForGlob(glob);

  const hash = readFile(path);

  return hash;
}

function saveGlobHash(glob: string, hash: string) {
  const path = getTempFilePathForGlob(glob);
  return writeFile(path, hash);
}

function getFilesHash(files: string[]) {
  const sortedFiles = [...files].sort();
  const hashSum = crypto.createHash("md5");

  for (const file of sortedFiles) {
    const fileBuffer = fs.readFileSync(file);
    hashSum.update(fileBuffer);
  }

  const hash = hashSum.digest("hex");

  return hash;
}

function normalizeGlob(glob: string) {
  return glob.replace(/[^a-zA-Z\d\s:]/g, "_");
}

export async function getDidFilesChange(glob: string) {
  const files = await globby(glob);

  const currentHash = getFilesHash(files);

  const previousHash = getGlobCurrentHash(glob);

  return currentHash !== previousHash;
}

export async function updateFilesHash(glob: string) {
  const files = await globby(glob);

  const hash = getFilesHash(files);

  saveGlobHash(glob, hash);
}
