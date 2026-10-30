/* Xmile CrossFit : JavaScript commun (vanilla). Menu, bandeau cookies, carte, widgets tiers, vidéos, rails. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var canHover = function () { return matchMedia('(hover:hover)').matches; };

  /* ---------- Menu « Nos cours » + menu mobile ---------- */
  (function () {
    var dd = $('.nav-dd'); if (!dd) return;
    var btn = $('.nav-dd-btn', dd), t = 0;
    function set(v) { dd.setAttribute('data-open', v ? 'true' : 'false'); btn.setAttribute('aria-expanded', v ? 'true' : 'false'); $$('.dd-card', dd).forEach(function (a) { a.tabIndex = v ? 0 : -1; }); }
    set(false);
    btn.addEventListener('click', function () { set(dd.getAttribute('data-open') !== 'true'); });
    dd.addEventListener('mouseenter', function () { if (!canHover()) return; clearTimeout(t); set(true); });
    dd.addEventListener('mouseleave', function () { if (!canHover()) return; clearTimeout(t); t = setTimeout(function () { set(false); }, 280); });
    dd.addEventListener('focusin', function () { set(true); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); closeMobile(); } });

    var mnav = $('#mnav'), opener = $('[data-mnav-open]');
    function openMobile() { mnav.setAttribute('data-open', 'true'); mnav.setAttribute('aria-hidden', 'false'); mnav.removeAttribute('inert'); opener.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; var c = $('[data-mnav-close]', mnav); if (c) c.focus(); }
    function closeMobile() { if (!mnav || mnav.getAttribute('data-open') !== 'true') return; mnav.setAttribute('data-open', 'false'); mnav.setAttribute('aria-hidden', 'true'); mnav.setAttribute('inert', ''); opener.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; opener.focus(); }
    if (mnav && opener) {
      opener.addEventListener('click', openMobile);
      $('[data-mnav-close]', mnav).addEventListener('click', closeMobile);
      $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { document.body.style.overflow = ''; }); });
    }
  })();

  /* ---------- Bandeau cookies + panneau « Gérer mes cookies » ---------- */
  (function () {
    var C = window.xmConsent, pop = $('#ck-pop'), dlg = $('#ck-dlg'); if (!C || !pop || !dlg) return;
    var panel = $('.ck-panel', dlg), draft = { analytics: false, ads: false }, lastFocus = null;
    function lockScroll(on) { document.documentElement.style.overflow = on ? 'hidden' : ''; }
    function sync() { $$('[data-ck-cat]', dlg).forEach(function (b) { b.setAttribute('aria-checked', draft[b.getAttribute('data-ck-cat')] ? 'true' : 'false'); }); }
    function closeAll() { pop.hidden = true; dlg.hidden = true; lockScroll(false); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
    function save(a, b) { C.save(a, b); closeAll(); }
    function openPanel(from) {
      var cur = C.read(); draft = { analytics: !!(cur && cur.analytics), ads: !!(cur && cur.ads) }; sync();
      lastFocus = from || document.activeElement; pop.hidden = true; dlg.hidden = false; lockScroll(true);
      var f = $('[data-ck-save]', dlg); if (f) f.focus();
    }
    document.addEventListener('click', function (e) {
      var o = e.target.closest && e.target.closest('[data-consent-open]'); if (o) { e.preventDefault(); openPanel(o); return; }
      if (e.target.closest('[data-ck-all]')) save(true, true);
      else if (e.target.closest('[data-ck-none]')) save(false, false);
      else if (e.target.closest('[data-ck-save]')) save(draft.analytics, draft.ads);
      else if (e.target.closest('[data-ck-cat]')) { var b = e.target.closest('[data-ck-cat]'), k = b.getAttribute('data-ck-cat'); draft[k] = !draft[k]; sync(); }
      else if (!dlg.hidden && (e.target.closest('button[data-ck-close]') || e.target === $('.ck-scrim', dlg))) { dlg.hidden = true; lockScroll(false); if (!C.read()) { pop.hidden = false; lockScroll(true); } else if (lastFocus && lastFocus.focus) lastFocus.focus(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !dlg.hidden) { dlg.hidden = true; lockScroll(false); if (!C.read()) { pop.hidden = false; lockScroll(true); } }
    });
    // Premier passage (ou choix expiré après 6 mois) : le bandeau s'affiche
    if (!C.read()) { pop.hidden = false; lockScroll(true); var y = $('.ck-yes', pop); if (y) setTimeout(function () { y.focus({ preventScroll: true }); }, 60); }
  })();

  /* ---------- Carte Google Maps : chargée seulement au clic ---------- */
  $$('[data-map]').forEach(function (m) {
    var b = $('[data-map-open]', m); if (!b) return;
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.title = m.getAttribute('data-title'); f.referrerPolicy = 'no-referrer-when-downgrade'; f.src = m.getAttribute('data-src');
      m.innerHTML = ''; m.appendChild(f);
    });
  });

  /* ---------- Widgets tiers chargés à l'approche (Trustindex, Sportigo) ---------- */
  function whenNear(el, fn, margin) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); } }, { rootMargin: margin || '600px 0px' });
    io.observe(el);
  }
  $$('[data-trustindex]').forEach(function (el) {
    whenNear(el, function () {
      var s = document.createElement('script');
      s.src = 'https://cdn.trustindex.io/loader.js?' + el.getAttribute('data-trustindex'); s.defer = true; s.async = true;
      el.appendChild(s);
    });
  });

  var spg = $('[data-sportigo]');
  if (spg) {
    var box = $('#sportigo-planning', spg);
    var nextDate = function () {
      try {
        var slots = JSON.parse(spg.getAttribute('data-slots') || '{}'), now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
        for (var i = 0; i < 8; i++) {
          var d = new Date(now); d.setDate(now.getDate() + i);
          var s = slots[d.getDay()]; if (!s || !s.length) continue;
          if (i === 0 && !s.some(function (m) { return m > nowMin; })) continue;
          return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        }
      } catch (e) {}
      return null;
    };
    var load = function () {
      var s = document.createElement('script');
      s.src = 'https://standalone.api.sportigo.fr/component-standalone.js';
      s.onload = function () {
        var o = { colored: true, readonly: false }, a = spg.getAttribute('data-activities'), f = nextDate();
        if (a) o.activities = JSON.parse(a);
        if (f) o.fromDate = f;
        try { window.initComponent('Appointment', 'sportigo-planning', spg.getAttribute('data-widget-id'), o); } catch (e) {}
      };
      document.body.appendChild(s);
    };
    var mo = new MutationObserver(function () { if (box.childElementCount) { spg.setAttribute('data-ready', ''); mo.disconnect(); } });
    mo.observe(box, { childList: true, subtree: true });
    if (spg.hasAttribute('data-eager')) load(); else whenNear(spg, load);
  }

  /* ---------- Vidéos lues au clic (lecteur auto-hébergé) ---------- */
  $$('[data-cvid]').forEach(function (w) {
    var v = $('video', w), start = $('[data-cvid-start]', w), bar = $('.cvid-bar', w), pl = $('[data-cvid-play]', w), mu = $('[data-cvid-mute]', w), vol = $('[data-cvid-vol]', w);
    function icons() {
      $('[data-ic-play]', w).hidden = !v.paused; $('[data-ic-pause]', w).hidden = v.paused;
      pl.setAttribute('aria-label', v.paused ? 'Lecture' : 'Pause');
      $('[data-ic-vol]', w).hidden = v.muted || v.volume === 0; $('[data-ic-mute]', w).hidden = !(v.muted || v.volume === 0);
      mu.setAttribute('aria-label', v.muted ? 'Réactiver le son' : 'Couper le son');
    }
    function toggle() { if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); }
    v.volume = 0.8;
    start.addEventListener('click', function () { start.hidden = true; bar.hidden = false; toggle(); });
    pl.addEventListener('click', toggle);
    v.addEventListener('click', function () { if (!start.hidden) return; toggle(); });
    mu.addEventListener('click', function () { v.muted = !v.muted; icons(); });
    vol.addEventListener('input', function () { v.volume = +vol.value; v.muted = false; icons(); });
    ['play', 'pause', 'ended', 'volumechange'].forEach(function (ev) { v.addEventListener(ev, icons); });
    icons();
  });

  /* ---------- Rails de coachs ---------- */
  $$('[data-rail]').forEach(function (b) {
    b.addEventListener('click', function () {
      var rail = $('[data-rail-list]', b.closest('section')); if (!rail) return;
      var card = $('.coach', rail), step = card ? card.getBoundingClientRect().width + 16 : 300;
      rail.scrollBy({ left: +b.getAttribute('data-rail') * step * 2, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Vidéo d'ambiance du hero : relance si le navigateur a suspendu l'autoplay ---------- */
  $$('.hero-bg video').forEach(function (v) { v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function () {}); });
})();
