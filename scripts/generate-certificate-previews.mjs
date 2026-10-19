import { readdir, mkdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const directory = new URL("../public/assets/certificates/", import.meta.url);
const previews = new URL("previews/", directory);
await mkdir(previews, { recursive: true });
let originalBytes = 0;
let previewBytes = 0;
// Sequential processing bounds encoder memory; this is a build-time task.
for (const name of (await readdir(directory)).filter(name => name.endsWith(".webp"))) {
  const input = new URL(name, directory);
  const output = new URL(name, previews);
  await sharp(fileURLToPath(input))
    .resize({ width: 640, height: 800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85, effort: 6 })
    .toFile(fileURLToPath(output));
  originalBytes += (await stat(input)).size;
  previewBytes += (await stat(output)).size;
}
console.log({ originalBytes, previewBytes });
