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
      const t = el.querySelector(':scope > image-slot, :scope > img'); if (t) pars.set(el, { t });
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
      if (it.t.hasAttribute('data-editable')) { if (it.t.style.transform) it.t.style.transform = ''; return; }
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
