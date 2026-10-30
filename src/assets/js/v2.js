// Mouvement au scroll des pages hors accueil (body.v2). La lisibilité d'abord :
// chaque section apparaît en 3D une seule fois en entrant à l'écran (< 1 s), puis plus rien ne bouge.
//  head  : titres de section, qui basculent vers l'avant
//  stand : cartes, qui se redressent depuis leur bord bas, l'une après l'autre
//  side  : blocs en deux colonnes, chaque colonne pivote depuis son bord extérieur
//  block : grands blocs, qui se relèvent depuis le haut
// Photos : légère parallaxe à l'intérieur du cadre. Hero : resserrement + parallaxe du fond.
// Les sections reprises de l'accueil (plaques « Nos cours », bande verte) gardent leur propre animation.
// prefers-reduced-motion : fondu seul, sans déplacement.
(() => {
  if (!document.body || !document.body.classList.contains('v2')) return;
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const RULES = [
    ['side', '.pair > *,.split > *,.hxp > *,.duo3 > *,.kid-safe > *,.feature > *,.local-intro > *,.story-v2 > *,.who > *'],
    ['block', '.side-team,.cmp-wrap,.example,.v-media,.final,.qform,.passport,.spg,.beg,.reass-row,.mosaic,.tt-wrap,.zones,.hxp-band'],
    ['stand', '.side-card,.stp-it,.s3-card,.notch,.plan,.plan-mini,.work-it,.nx-card,.coach,.lpill,.tt,.logos > *,.smile-row > li'],
    ['head', '.pq-head,.pq-it,.sec-head,.vals-head,.val,.faq-list details,.tips li,.incl li,.price-notes li'],
  ];
  const GROUP = '.coach-rail,.nx,.lpills,.smile-row';
  const SKIP = '.hero,.dr,.lx,.stk,.coach-pic,.hdr,[data-m-skip]';
  const pars = new Map(), groups = new Map(), seen = new WeakSet();
  let vh = innerHeight, f = 1, raf = 0, heroes = [];
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const docTop = el => { let t = 0; while (el) { t += el.offsetTop; el = el.offsetParent; } return t; };

  const done = el => { el.removeAttribute('data-e'); el.removeAttribute('data-st'); ['--ek', '--eo', '--er'].forEach(p => el.style.removeProperty(p)); };
  const show = (el, k) => { el.style.setProperty('--ek', k); el.dataset.st = '1'; setTimeout(() => done(el), 1000 + k * 90 + 80); };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    const batch = [];
    es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); (groups.get(e.target) || [e.target]).forEach(x => batch.push(x)); groups.delete(e.target); });
    batch.sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left); });
    batch.forEach((el, i) => show(el, Math.min(i, 6)));
  }, { rootMargin: '0px 0px -12% 0px' }) : null;

  function scan() {
    if (RM.matches && !io) return;
    heroes = [...document.querySelectorAll('[data-m="hero"]')];
    if (io) RULES.forEach(([type, sel]) => document.querySelectorAll(sel).forEach(el => {
      if (seen.has(el) || el.closest(SKIP)) return;
      seen.add(el);
      if (el.parentElement.closest('[data-e]')) return;
      if (el.getBoundingClientRect().top < innerHeight * .88) return;
      el.dataset.e = type; el.dataset.st = '0';
      if (type === 'side') {
        const first = el === el.parentElement.firstElementChild;
        el.style.setProperty('--eo', first ? '0%' : '100%');
        el.style.setProperty('--er', first ? '34deg' : '-34deg');
      }
      const g = el.parentElement.closest(GROUP);
      if (g) { if (!groups.has(g)) { groups.set(g, []); io.observe(g); } groups.get(g).push(el); }
      else io.observe(el);
    }));
    if (!RM.matches) document.querySelectorAll('.ph,.slot').forEach(el => {
      if (pars.has(el) || el.closest(SKIP)) return;
      const t = el.querySelector(':scope > picture, :scope > img'); if (t) pars.set(el, { t });
    });
    measure();
  }
  function measure() {
    vh = innerHeight; f = innerWidth < 700 ? .5 : 1;
    pars.forEach((it, el) => { if (!el.isConnected) { pars.delete(el); return; } it.top = docTop(el); it.h = el.offsetHeight; });
    tick();
  }
  function tick() {
    raf = 0;
    if (RM.matches) return;
    const y = scrollY;
    heroes.forEach(h => {
      h.style.setProperty('--p', clamp(y / (vh * .45)).toFixed(3));
      const bg = h.querySelector('.hero-bg');
      if (bg && y < vh * 1.5) bg.style.transform = 'translate3d(0,' + (y * .3).toFixed(1) + 'px,0)';
    });
    pars.forEach(it => {
            const top = it.top - y; if (top > vh * 1.3 || top + it.h < -vh * .3) return;
      const c = (top + it.h / 2 - vh / 2) / (vh / 2 + it.h / 2);
      it.t.style.transform = 'translate3d(0,' + (-c * it.h * .06 * f).toFixed(1) + 'px,0) scale(1.14)';
    });
  }
  const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
  let mt = 0;
  const later = () => { clearTimeout(mt); mt = setTimeout(scan, 120); };
  addEventListener('scroll', on, { passive: true });
  addEventListener('resize', () => { clearTimeout(mt); mt = setTimeout(measure, 120); });
  addEventListener('load', () => { scan(); setTimeout(measure, 800); });
  addEventListener('beforeprint', () => document.querySelectorAll('[data-e]').forEach(done));
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
  if ('ResizeObserver' in window) new ResizeObserver(() => { clearTimeout(mt); mt = setTimeout(measure, 120); }).observe(document.body);
  RM.addEventListener && RM.addEventListener('change', () => { pars.forEach(it => { it.t.style.transform = ''; }); pars.clear(); scan(); });
  scan();
})();

/* Déroulé d'une séance : le fond apparaît en fondu à l'entrée à l'écran */
(() => {
  document.querySelectorAll('[data-pintrack]').forEach(el => {
    if (!('IntersectionObserver' in window)) { el.dataset.in = 'true'; return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { el.dataset.in = 'true'; io.disconnect(); } }), { rootMargin: '0px 0px -18% 0px' });
    io.observe(el);
  });
})();

/* Vidéo en façade (Notre vision) : le fichier mp4 auto-hébergé n'est chargé qu'au clic */
(() => {
  document.querySelectorAll('[data-vfacade]').forEach(f => {
    const v = f.querySelector('video'), b = f.querySelector('[data-vfacade-play]');
    if (!v || !b) return;
    b.addEventListener('click', () => { v.preload = 'auto'; v.controls = true; f.dataset.on = 'true'; const p = v.play(); if (p && p.catch) p.catch(() => {}); v.focus(); });
  });
})();

/* Valeurs : bloc épinglé, une valeur à la fois selon le défilement */
(() => {
  const el = document.querySelector('[data-vsc]'); if (!el) return;
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const items = [...el.querySelectorAll('.vsc-stage li')], btns = [...el.querySelectorAll('[data-vsc-go]')], vid = el.querySelector('video');
  let cur = -1, raf = 0;
  const set = i => {
    if (i === cur) return; cur = i;
    items.forEach((li, k) => { li.dataset.st = k === i ? 'on' : k < i ? 'past' : 'next'; });
    btns.forEach((b, k) => { b.className = k === i ? 'on' : k < i ? 'past' : ''; if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  };
  const tick = () => { raf = 0; const r = el.getBoundingClientRect(), span = el.offsetHeight - innerHeight; const p = span > 0 ? Math.min(.999, Math.max(0, -r.top / span)) : 0; set(Math.floor(p * items.length)); };
  const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', on, { passive: true }); addEventListener('resize', on); tick();
  btns.forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.vscGo, top = el.getBoundingClientRect().top + scrollY, span = el.offsetHeight - innerHeight;
    scrollTo({ top: top + span * (i + .5) / items.length, behavior: RM.matches ? 'auto' : 'smooth' });
  }));
  if (vid && 'IntersectionObserver' in window) {
    vid.muted = true;
    new IntersectionObserver(([e]) => { if (e.isIntersecting && !RM.matches) { const p = vid.play(); if (p && p.catch) p.catch(() => {}); } else vid.pause(); }).observe(vid);
  }
})();

/* Formulaire de devis Team building : envoi vers api/devis.php, confirmation sans rechargement */
(() => {
  const wrap = document.querySelector('[data-quote]'); if (!wrap) return;
  const form = wrap.querySelector('[data-quote-form]'), done = wrap.querySelector('[data-quote-done]'), err = wrap.querySelector('[data-quote-error]');
  const stamp = form.elements.t; stamp.value = Date.now(); // heure d'ouverture : le serveur refuse un envoi trop rapide
  const clear = () => { form.querySelectorAll('.fld[data-invalid]').forEach(f => { f.removeAttribute('data-invalid'); const m = f.querySelector('.fld-msg'); if (m) m.remove(); }); err.hidden = true; };
  const mark = (name, msg) => {
    const input = form.elements[name]; const f = input && input.closest('.fld'); if (!f) return;
    f.setAttribute('data-invalid', ''); input.setAttribute('aria-invalid', 'true');
    const m = document.createElement('span'); m.className = 'fld-msg'; m.textContent = msg; f.appendChild(m);
  };
  form.addEventListener('submit', async e => {
    e.preventDefault(); clear();
    const bad = {};
    ['company', 'name', 'email', 'size'].forEach(k => { if (!form.elements[k].value.trim()) bad[k] = 'Champ requis'; });
    if (form.elements.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.elements.email.value)) bad.email = 'Adresse email invalide';
    if (Object.keys(bad).length) { Object.entries(bad).forEach(([k, m]) => mark(k, m)); form.elements[Object.keys(bad)[0]].focus(); return; }
    const btn = form.querySelector('button[type=submit]'); btn.disabled = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        done.querySelector('[data-q-name]').textContent = form.elements.name.value.trim().split(' ')[0];
        done.querySelector('[data-q-email]').textContent = form.elements.email.value.trim();
        done.querySelector('[data-q-company]').textContent = form.elements.company.value.trim();
        form.hidden = true; done.hidden = false; done.focus && done.setAttribute('tabindex', '-1'); done.focus();
        window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'devis_team_building' });
      } else if (data.errors) {
        Object.entries(data.errors).forEach(([k, m]) => mark(k, m));
      } else {
        err.textContent = data.error || 'L\'envoi a échoué. Réessaie dans un instant ou écris-nous directement par email.'; err.hidden = false;
      }
    } catch (x) {
      err.textContent = 'L\'envoi a échoué. Vérifie ta connexion ou écris-nous directement par email.'; err.hidden = false;
    }
    btn.disabled = false;
  });
})();
