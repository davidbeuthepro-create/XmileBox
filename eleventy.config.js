import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import Image from '@11ty/eleventy-img';
import { transform as lightning } from 'lightningcss';

import env from './src/_data/env.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, '_site');
const IMG_DIR = path.join(SRC, 'assets', 'img');
const photos = JSON.parse(fs.readFileSync(path.join(SRC, '_data', 'photos.json'), 'utf8'));

/* ------------------------------------------------------------------ */
/* Bundles CSS et JS : noms versionnés (le .htaccess met 1 an de cache)   */
/* ------------------------------------------------------------------ */
const read = f => fs.readFileSync(path.join(SRC, 'assets', f), 'utf8');
const hash = s => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);

function buildBundles() {
  const cssFiles = fs.readdirSync(path.join(SRC, 'assets', 'css')).filter(f => f.endsWith('.css')).sort();
  const css = cssFiles.map(f => read('css/' + f)).join('\n');
  const minCss = lightning({ filename: 'main.css', code: Buffer.from(css), minify: true }).code.toString();
  const bundles = { 'css/main': { ext: 'css', code: minCss } };
  // JS : chaque fichier de src/assets/js/ est un bundle (main = commun, home, v2 = pages cours...)
  for (const f of fs.readdirSync(path.join(SRC, 'assets', 'js')).filter(f => f.endsWith('.js'))) {
    bundles['js/' + f.replace(/\.js$/, '')] = { ext: 'js', code: read('js/' + f) };
  }
  const urls = {};
  for (const [name, b] of Object.entries(bundles)) {
    b.file = `assets/${name}.${hash(b.code)}.${b.ext}`;
    urls[name.replace('css/', 'css_').replace('js/', 'js_')] = '/' + b.file;
  }
  return { bundles, urls };
}

/* ------------------------------------------------------------------ */
/* Images : @11ty/eleventy-img, AVIF + WebP + JPEG, srcset              */
/* ------------------------------------------------------------------ */
const pending = [];
const used = new Set(); // fichiers images réellement utilisés par les pages (copiés vers _site)
const IMG_CACHE = path.join(ROOT, '.cache', 'img');
const ALPHA = /^(logo-|xm-mark)/; // PNG à fond transparent : le repli reste en PNG
const DEFAULT_WIDTHS = [480, 960, 1440];

function track(md) { for (const list of Object.values(md)) for (const r of list) used.add(r.outputPath); }

function picture({ file, alt = '', sizes = '100vw', widths = DEFAULT_WIDTHS, eager = false, cls = '', pos, style = '', attrs = {} }) {
  const src = path.join(IMG_DIR, file);
  if (!fs.existsSync(src)) throw new Error(`Image introuvable : ${file}`);
  const alpha = ALPHA.test(path.basename(file));
  const opts = {
    widths,
    formats: alpha ? ['avif', 'webp', 'png'] : ['avif', 'webp', 'jpeg'],
    urlPath: '/assets/img/',
    outputDir: IMG_CACHE,
    sharpAvifOptions: { quality: 55, effort: 2 },
    sharpWebpOptions: { quality: 76 },
    sharpJpegOptions: { quality: 78 },
  };
  pending.push(Image(src, opts));
  const md = Image.statsSync(src, opts);
  track(md);
  const st = [pos ? `object-position:${pos}` : '', style].filter(Boolean).join(';');
  return Image.generateHTML(md, {
    alt,
    sizes,
    loading: eager ? 'eager' : 'lazy',
    decoding: eager ? 'sync' : 'async',
    ...(eager ? { fetchpriority: 'high' } : {}),
    ...(cls ? { class: cls } : {}),
    ...(st ? { style: st } : {}),
    ...attrs,
  });
}

// Cadrage laissé dans la maquette (zoom s, décalage x/y en % du cadre) -> object-position approchée
function framePos(entry, fallback) {
  if (!entry || (!entry.x && !entry.y)) return fallback;
  const r = 1.45 * (entry.s || 1);
  const k = 1 / Math.max(0.2, r - 1);
  const clamp = v => Math.min(100, Math.max(0, v));
  return `${clamp(50 - entry.x * k).toFixed(0)}% ${clamp(50 - entry.y * k).toFixed(0)}%`;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// slot : id de cadre de la maquette (photo déposée par David). src : image de la maquette par défaut.
function slotPicture(o) {
  const entry = o.slot ? photos[o.slot] : null;
  let file = o.src || null;
  if (entry && entry.file) file = entry.file;
  if (!file && o.label) return `<div class="ph-empty" role="img" aria-label="${esc(o.alt || o.label)}"><span>${esc(o.label)}</span></div>`;
  if (!file) {
    return `<div class="ph-empty" role="img" aria-label="${esc(o.todo || o.alt || 'Photo à ajouter')}"><span class="todo">[À COMPLÉTER : ${esc(o.todo || o.alt || 'photo')}]</span></div>`;
  }
  return picture({ ...o, file, pos: framePos(entry, o.pos) });
}

/* ------------------------------------------------------------------ */
/* Icônes : lucide-static 0.460.0, SVG inline (aucun appel externe)       */
/* ------------------------------------------------------------------ */
const ICON_MAP = { 'arrow-up-right': 'chevron-right', 'arrow-right': 'chevron-right', 'arrow-down': 'chevron-down' };
const iconCache = {};
function icon(name, size = 18, cls = '') {
  const n = ICON_MAP[name] || name;
  if (!iconCache[n]) {
    const f = path.join(ROOT, 'node_modules', 'lucide-static', 'icons', n + '.svg');
    if (!fs.existsSync(f)) throw new Error(`Icône inconnue : ${n}`);
    iconCache[n] = fs.readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  }
  return `<svg class="ic${cls ? ' ' + cls : ''}" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${iconCache[n]}</svg>`;
}

/* ------------------------------------------------------------------ */
/* Config                                                                */
/* ------------------------------------------------------------------ */
export default function (eleventyConfig) {
  const { bundles, urls } = buildBundles();
  eleventyConfig.addGlobalData('assets', urls);

  eleventyConfig.addShortcode('img', o => picture({ ...o, file: o.src }));
  // URL d'un JPEG généré (attribut poster d'une vidéo)
  eleventyConfig.addShortcode('imgUrl', o => {
    const src = path.join(IMG_DIR, o.src);
    const opts = { widths: o.widths || [960], formats: ['jpeg'], urlPath: '/assets/img/', outputDir: IMG_CACHE, sharpJpegOptions: { quality: 72 } };
    pending.push(Image(src, opts));
    const md = Image.statsSync(src, opts);
    track(md);
    return md.jpeg[md.jpeg.length - 1].url;
  });
  eleventyConfig.addShortcode('slot', o => slotPicture(o));
  eleventyConfig.addShortcode('icon', (name, size, cls) => icon(name, size, cls));
  eleventyConfig.addShortcode('todo', text => `<span class="todo">[${esc(text)}]</span>`);

  // Titres des pages locales : ["début", "mot orange", "fin"] -> HTML ; paragraphes : texte ou liste de textes -> <p>
  eleventyConfig.addFilter('localH', h => Array.isArray(h) ? `${esc(h[0])} <span class="acc">${esc(h[1])}</span>${h[2] ? ' ' + esc(h[2]) : ''}` : esc(h));
  eleventyConfig.addFilter('localP', a => (Array.isArray(a) ? a : [a]).map(t => `<p>${esc(t)}</p>`).join(''));
  eleventyConfig.addFilter('isArray', v => Array.isArray(v));
  eleventyConfig.addFilter('match', (s, re) => new RegExp(re).test(s));
  eleventyConfig.addFilter('json', v => JSON.stringify(v));
  eleventyConfig.addFilter('esc', esc);
  // Jours (0 = dimanche) -> minutes de début des cours, pour ouvrir le widget Sportigo sur le prochain créneau
  eleventyConfig.addFilter('planningJours', (cle, horaires) => {
    const D = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
    const slots = {};
    for (const bloc of horaires.planning[cle] || []) {
      for (const { jour, heures } of horaires.blocs[bloc].lignes) {
        const l = jour.toLowerCase();
        const found = D.filter(d => l.includes(d)).map(d => D.indexOf(d));
        let days = found;
        if (found.length === 2 && /\s-\s/.test(l)) {
          days = [];
          for (let i = found[0]; i !== (found[1] + 1) % 7; i = (i + 1) % 7) days.push(i);
        }
        const mins = heures.map(t => { const m = /^(\d{1,2})h(\d{2})?/.exec(t); return m ? +m[1] * 60 + +(m[2] || 0) : null; }).filter(v => v != null);
        days.forEach(d => { slots[d] = (slots[d] || []).concat(mins); });
      }
    }
    return JSON.stringify(slots);
  });
  eleventyConfig.addFilter('isoDate', d => new Date(d).toISOString().slice(0, 10));

  eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': 'assets/fonts' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/video': 'assets/video' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/img/favicon': 'assets/img/favicon' });
  // robots.txt du pack et dossier api/ : copiés tels quels
  eleventyConfig.addPassthroughCopy('src/robots.txt');
  eleventyConfig.addPassthroughCopy('src/api');

  eleventyConfig.on('eleventy.before', () => { pending.length = 0; used.clear(); });
  eleventyConfig.on('eleventy.after', async () => {
    await Promise.all(pending);
    // images optimisées : cache (.cache/img) -> _site/assets/img, seulement celles que les pages utilisent
    fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });
    for (const f of used) fs.copyFileSync(f, path.join(OUT, 'assets', 'img', path.basename(f)));
    // bundles CSS / JS
    for (const b of Object.values(bundles)) {
      const f = path.join(OUT, b.file);
      fs.mkdirSync(path.dirname(f), { recursive: true });
      fs.writeFileSync(f, b.code);
    }
    // .htaccess : généré à partir du pack, avec les règles propres au domaine de production
    const packFile = path.join(ROOT, '_migration', 'site', '.htaccess');
    if (!fs.existsSync(packFile)) throw new Error('_migration/site/.htaccess introuvable : le .htaccess est généré à partir de ce fichier');
    let ht = fs.readFileSync(packFile, 'utf8');
    // 1. https + sans www : uniquement pour crossfitxmile.com (le domaine de test ne doit jamais être redirigé vers la production)
    ht = ht.replace(
      'RewriteCond %{HTTPS} off [OR]\nRewriteCond %{HTTP_HOST} ^www\\. [NC]\n',
      'RewriteCond %{HTTP_HOST} ^(www\\.)?crossfitxmile\\.com$ [NC]\nRewriteCond %{HTTPS} off [OR]\nRewriteCond %{HTTP_HOST} ^www\\. [NC]\n'
    );
    if (!ht.includes('^(www\\.)?crossfitxmile\\.com$')) throw new Error('.htaccess : bloc https/www du pack non reconnu');
    if (env.isTest) {
      ht = '# SITE_ENV=test : le site ne doit pas être indexé\n<IfModule mod_headers.c>\n  Header set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n\n' + ht;
    }
    fs.writeFileSync(path.join(OUT, '.htaccess'), ht);
  });

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
}
