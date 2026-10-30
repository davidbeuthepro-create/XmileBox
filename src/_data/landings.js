// Pages locales conservées, absentes de la maquette : texte de _migration/landings/ (copié dans src/_landings/).
// Chaque fichier : front matter (url, title, description), puis un kicker, un H1 et des sections.
// Une ligne courte isolée juste avant un H2 est un sur-titre de section (pas un titre).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '_landings');
const md = new MarkdownIt({ html: false, typographer: false });

function parse(file) {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm = {};
  for (const line of m[1].split('\n')) {
    const k = line.match(/^(\w+): "?(.*?)"?$/);
    if (k) fm[k[1]] = k[2];
  }
  const blocks = m[2].split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  let kicker = '', h1 = '';
  const sections = [];
  let cur = null, eyebrow = '';
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const next = blocks[i + 1] || '';
    if (/^# /.test(b)) { h1 = b.slice(2).trim(); continue; }
    const isLabel = !/^(#|-|\d+\.)/.test(b) && !b.includes('\n') && b.length <= 60 && /^##? /.test(next);
    if (isLabel) {
      if (!h1) kicker = b; else eyebrow = b;
      continue;
    }
    if (/^## /.test(b)) {
      cur = { eyebrow, title: b.slice(3).trim(), md: [] };
      eyebrow = '';
      sections.push(cur);
      continue;
    }
    if (cur) cur.md.push(b);
  }
  for (const s of sections) {
    const e = s.eyebrow.toLowerCase();
    s.kind = e === 'nos horaires' ? 'horaires' : e === 'témoignages' ? 'avis' : e === 'inscription' ? 'inscription' : 'texte';
    s.html = md.render(s.md.join('\n\n'));
    s.text = s.md.filter(x => !/^(#|-)/.test(x)).join(' ');
  }
  return { url: fm.url, metaTitle: fm.title, metaDesc: fm.description, kicker, h1, sections };
}

export default fs.readdirSync(DIR).filter(f => f.endsWith('.md')).sort().map(parse);
