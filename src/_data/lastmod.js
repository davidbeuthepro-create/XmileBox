// Date de dernière modification Git d'un fichier source (repli : date du build). Sert au <lastmod> du sitemap
// pour les pages générées depuis des données (pages locales).
import { execSync } from 'node:child_process';

const git = f => {
  try { return execSync(`git log -1 --format=%cs -- ${f}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null; } catch { return null; }
};
const today = new Date().toISOString().slice(0, 10);

export default {
  locales: git('src/_data/locales.json') || today,
  landings: git('src/_landings') || today,
};
