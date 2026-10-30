/* Accueil : hero qui se resserre, plaques empilées, vie de la box, galerie. Vanilla, transform / opacity / clip-path seulement. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var clamp = function (v) { return Math.min(1, Math.max(0, v)); };

  /* ---------- Hero : plein cadre au chargement, bloc arrondi au scroll (--p) ---------- */
  (function () {
    var s = $('#hero-slab'), raf = 0; if (!s) return;
    function upd() { raf = 0; s.style.setProperty('--p', clamp(window.scrollY / (window.innerHeight * 0.45)).toFixed(3)); }
    function on() { if (!raf) raf = requestAnimationFrame(upd); }
    upd(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
  })();

  /* ---------- Plaques empilées « Nos cours » : --in (entrée), --cov (recouverte par la suivante) ---------- */
  (function () {
    var root = $('[data-stack]'); if (!root) return;
    $$('[data-stk-ph]', root).forEach(function (ph) {
      ph.addEventListener('click', function () { var a = ph.previousElementSibling; if (a && a.href) a.click(); });
    });
    if (reduced.matches) return;
    var cards = $$('.stk-card', root), tops = [], raf = 0;
    function measure() { tops = cards.map(function (c) { return parseFloat(getComputedStyle(c).top) || 0; }); }
    function upd() {
      raf = 0; var vh = innerHeight, rs = cards.map(function (c) { return c.getBoundingClientRect().top; });
      cards.forEach(function (c, i) {
        c.style.setProperty('--in', clamp((vh - rs[i]) / Math.max(1, vh - tops[i])).toFixed(3));
        c.style.setProperty('--cov', i < cards.length - 1 ? clamp((vh - rs[i + 1]) / Math.max(1, vh - tops[i + 1])).toFixed(3) : '0');
      });
    }
    function on() { if (!raf) raf = requestAnimationFrame(upd); }
    measure(); upd();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', function () { measure(); on(); });
  })();

  /* ---------- La vie de la box : défilement horizontal épinglé sur grand écran, rail à faire défiler ailleurs ---------- */
  (function () {
    var s = $('[data-boxlife]'), t = s && $('[data-lx-track]', s), bar = s && $('[data-lx-bar]', s); if (!s || !t) return;
    var pinEl = $('.lx-pin', s), mq = matchMedia('(min-width: 961px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)');
    var raf = 0, dist = 0, top = 0, pin = false;
    function show(p) { bar.style.transform = 'scaleX(' + p.toFixed(3) + ')'; }
    function measure() {
      pin = mq.matches; s.setAttribute('data-pin', pin ? 'true' : 'false');
      t.style.transform = ''; s.style.height = '';
      if (!pin) return;
      top = parseFloat(getComputedStyle(pinEl).top) || 0;
      var last = t.lastElementChild;
      dist = Math.max(0, last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(t).paddingLeft) - t.clientWidth);
      s.style.height = (pinEl.offsetHeight + dist) + 'px';
    }
    function upd() {
      raf = 0;
      if (pin) { var p = dist ? clamp((top - s.getBoundingClientRect().top) / dist) : 0; t.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)'; show(p); }
      else { var m = t.scrollWidth - t.clientWidth; show(m > 0 ? t.scrollLeft / m : 0); }
    }
    function on() { if (!raf) raf = requestAnimationFrame(upd); }
    function rz() { measure(); on(); }
    measure(); upd();
    addEventListener('scroll', on, { passive: true }); t.addEventListener('scroll', on, { passive: true }); addEventListener('resize', rz);
    addEventListener('load', rz);
    if (mq.addEventListener) mq.addEventListener('change', rz);
  })();

  /* ---------- Galerie : 6 photos, puis « Voir plus de photos » ---------- */
  (function () {
    var sec = $('[data-gallery]'), g = sec && $('.gal', sec), b = sec && $('[data-gal-toggle]', sec); if (!g || !b) return;
    var n = $$('.gal-it', g).length, shown = 6;
    b.addEventListener('click', function () {
      var open = g.getAttribute('data-open') !== 'true';
      if (!open) { var t = sec.getBoundingClientRect().top + scrollY - 100; if (scrollY > t) scrollTo({ top: t }); }
      g.setAttribute('data-open', open ? 'true' : 'false'); b.setAttribute('aria-expanded', open ? 'true' : 'false');
      $('[data-gal-label]', b).textContent = open ? 'Voir moins' : 'Voir plus de photos';
      $('[data-gal-count]', sec).textContent = (open ? n : shown) + ' / ' + n + ' photos';
      var ic = $('[data-gal-ic]', b); ic.style.display = 'inline-flex'; ic.style.transform = open ? 'rotate(180deg)' : '';
    });
  })();
})();
