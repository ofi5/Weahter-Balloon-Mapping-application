import fs from 'fs';
import path from 'path';
import axios from 'axios';

const REMOTE_BASE = 'https://a.windbornesystems.com';
const OUT_DIR = path.resolve('public/wb/treasure');

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function fetchHour(hourIndex) {
  const hh = String(hourIndex).padStart(2, '0');
  const url = `${REMOTE_BASE}/treasure/${hh}.json`;
  try {
    const res = await axios.get(url, { timeout: 15000 });
    return res.data;
  } catch (err) {
    return null;
  }
}

async function writeJson(filePath, data) {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  await fs.promises.writeFile(filePath, content);
}

async function main() {
  await ensureDir(OUT_DIR);
  const results = await Promise.all(
    Array.from({ length: 24 }, (_, i) => fetchHour(i))
  );

  // Write any successfully fetched files
  let wroteAny = false;
  for (let i = 0; i < results.length; i++) {
    const data = results[i];
    if (data) {
      const hh = String(i).padStart(2, '0');
      const filePath = path.join(OUT_DIR, `${hh}.json`);
      await writeJson(filePath, data);
      wroteAny = true;
    }
  }

  // If none fetched, keep existing files (if any). If some missing, pad missing hours with the latest available.
  const existingFiles = await fs.promises.readdir(OUT_DIR).catch(() => []);
  const available = existingFiles
    .filter(name => /^\d{2}\.json$/.test(name))
    .sort();

  if (available.length > 0) {
    const lastFile = path.join(OUT_DIR, available[available.length - 1]);
    const lastDataRaw = await fs.promises.readFile(lastFile, 'utf-8');
    const lastData = JSON.parse(lastDataRaw);
    for (let i = 0; i < 24; i++) {
      const hh = String(i).padStart(2, '0');
      const f = path.join(OUT_DIR, `${hh}.json`);
      try {
        await fs.promises.access(f, fs.constants.F_OK);
      } catch {
        await writeJson(f, lastData);
      }
    }
  } else if (!wroteAny) {
    // Ensure at least 00.json exists with a placeholder (Palo Alto)
    const fallback = [[37.4419, -122.143, 15.0]];
    await writeJson(path.join(OUT_DIR, '00.json'), fallback);
  }
}

main().catch(() => {
  // Do not fail the build on fetch errors; rely on existing/static files
});


