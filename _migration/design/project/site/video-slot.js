// Vidéos remplaçables en mode édition : <video data-vslot="id">. Chaque vidéo déposée a son propre fichier .vid-<id>.state.json
// (indépendant du code). Limite de la plateforme : ~2 Mo par fichier, donc vidéo de 1,4 Mo max ; au-delà, l'envoyer dans le chat.
(() => {
  const FILE = '.video-slots.state.json', MAX = 1.4 * 1024 * 1024;
  const fileOf = id => '.vid-' + String(id).replace(/[^a-zA-Z0-9-]/g, '-') + '.state.json';
  const asked = new Set();
  let state = {}, ready = false;
  const canEdit = () => !!(window.omelette && window.omelette.writeFile);
  const css = document.createElement('style');
  css.textContent = '.vs-ui{position:absolute;right:12px;bottom:12px;z-index:60;display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity 160ms ease-out}' +
    '[data-vs-host].vs-drag > .vs-ui{opacity:1}' +
    '.vs-ui button{font:600 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;border:0;border-radius:999px;padding:9px 14px;background:#F97316;color:#11261F;cursor:pointer}' +
    '.vs-ui button.vs-alt{background:rgba(11,26,21,.85);color:#fff}.vs-ui button:active{transform:scale(.97)}' +
    '.vs-msg{position:absolute;right:12px;bottom:52px;z-index:60;max-width:260px;font:500 12px/1.35 Barlow,sans-serif;background:#11261F;color:#fff;padding:8px 10px;border-radius:10px}' +
    '[data-vs-host].vs-drag{outline:3px dashed #F97316;outline-offset:-6px}';
  document.head.appendChild(css);
  const apply = v => {
    const id = v.dataset.vslot, u = state[id];
    if (!('vsOrig' in v.dataset)) v.dataset.vsOrig = v.getAttribute('src') || '';
    const want = u || v.dataset.vsOrig;
    if ((v.getAttribute('src') || '') !== want) { if (want) v.setAttribute('src', want); else v.removeAttribute('src'); v.load(); if (want && v.autoplay) v.play().catch(() => {}); }
    ui(v);
  };
  const save = id => Promise.resolve(window.omelette.writeFile(fileOf(id), JSON.stringify(state[id] ? { u: state[id] } : { cleared: true })));
  const fetchOne = id => { if (asked.has(id)) return; asked.add(id); fetch(fileOf(id), { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null).then(j => { if (j && j.u) { state[id] = j.u; all(); } else if (j && j.cleared) { delete state[id]; all(); } }); };
  const msg = (host, t) => { let m = host.querySelector(':scope > .vs-msg'); if (!m) { m = document.createElement('div'); m.className = 'vs-msg'; host.appendChild(m); } m.textContent = t; clearTimeout(m._t); m._t = setTimeout(() => m.remove(), 5000); };
  const ingest = (v, f) => {
    const host = hostOf(v);
    if (!f || !/^video\//.test(f.type)) return msg(host, 'Dépose un fichier vidéo (MP4 conseillé).');
    if (f.size > MAX) return msg(host, 'Vidéo trop lourde (' + Math.round(f.size / 1048576) + ' Mo, max 1,4 Mo). Envoie-la plutôt dans le chat, je l\'intègre au site.');
    msg(host, 'Enregistrement de la vidéo…');
    const r = new FileReader();
    r.onload = () => { state[v.dataset.vslot] = r.result; save(v.dataset.vslot).then(() => msg(host, 'Vidéo enregistrée.')).catch(e => msg(host, 'Échec de l\'enregistrement : ' + (e && e.message || 'erreur'))); all(); };
    r.readAsDataURL(f);
  };
  const hostOf = v => v.closest('[data-vs-host]') || v.parentElement;
  function ui(v) {
    const host = hostOf(v); if (!host) return;
    host.setAttribute('data-vs-host', '');
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    let box = host.querySelector(':scope > .vs-ui');
    if (!canEdit()) { if (box) box.remove(); return; }
    if (!box) {
      box = document.createElement('div'); box.className = 'vs-ui';
      box.innerHTML = '<button type="button" class="vs-pick">Changer la vidéo</button><button type="button" class="vs-alt vs-reset">Vidéo d\'origine</button><input type="file" accept="video/*" hidden>';
      const inp = box.querySelector('input');
      box.querySelector('.vs-pick').onclick = e => { e.preventDefault(); e.stopPropagation(); inp.click(); };
      inp.onchange = () => { ingest(v, inp.files[0]); inp.value = ''; };
      box.querySelector('.vs-reset').onclick = e => { e.preventDefault(); e.stopPropagation(); delete state[v.dataset.vslot]; save(v.dataset.vslot); all(); };
      ['click', 'pointerdown'].forEach(t => box.addEventListener(t, e => e.stopPropagation()));
      host.appendChild(box);
      host.addEventListener('dragover', e => { if (canEdit() && [...e.dataTransfer.types].includes('Files')) { e.preventDefault(); host.classList.add('vs-drag'); } });
      host.addEventListener('dragleave', e => { if (!host.contains(e.relatedTarget)) host.classList.remove('vs-drag'); });
      host.addEventListener('drop', e => { const f = e.dataTransfer.files[0]; host.classList.remove('vs-drag'); if (canEdit() && f && /^video\//.test(f.type)) { e.preventDefault(); e.stopPropagation(); ingest(v, f); } }, true);
    }
    box.querySelector('.vs-reset').hidden = !state[v.dataset.vslot];
  }
  const all = () => { if (ready) document.querySelectorAll('video[data-vslot]').forEach(v => { fetchOne(v.dataset.vslot); apply(v); }); };
  fetch(FILE).then(r => r.ok ? r.json() : {}).catch(() => ({})).then(j => { state = j || {}; ready = true; all(); });
  let q = 0;
  new MutationObserver(() => { clearTimeout(q); q = setTimeout(all, 50); }).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('load', () => { all(); setTimeout(all, 1500); });
  document.addEventListener('pointerover', e => { if (canEdit() && e.target.closest && e.target.closest('[data-vs-host]') && !e.target.closest('[data-vs-host]').querySelector(':scope > .vs-ui')) all(); });
})();
