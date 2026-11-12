// Sirve la app Flutter ya compilada (mobile/web-build) sin necesitar Flutter.
// Uso: node scripts/servir-app.mjs [puerto]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.argv[2] ?? 8765);
const root = resolve(fileURLToPath(new URL('../mobile/web-build', import.meta.url)));

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff2': 'font/woff2',
};

async function fileFor(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^([/\\])+/, '');
  const full = join(root, clean);
  // No dejar salir de la carpeta de la app.
  if (!full.startsWith(root)) return join(root, 'index.html');
  try {
    if ((await stat(full)).isFile()) return full;
  } catch { /* no existe: es una ruta de la app */ }
  return join(root, 'index.html');
}

createServer(async (req, res) => {
  try {
    const file = await fileFor(req.url ?? '/');
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch (e) {
    res.writeHead(500);
    res.end(String(e));
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`App ParqueoÁgil en http://localhost:${port}`);
});
