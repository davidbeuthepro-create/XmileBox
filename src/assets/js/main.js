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

  /* ---------- En-tête mobile : compact et légèrement transparent dès qu'on descend ---------- */
  (function () {
    var root = document.documentElement, raf = 0;
    function upd() { raf = 0; root.classList.toggle('hdr-compact', window.scrollY > 40); }
    addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    upd();
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

  /* ---------- « Nos autres cours » : photos chargées dès l'approche de la section ---------- */
  // En loading="lazy", les cartes cachées sur le côté du carrousel mobile ne se chargeaient qu'au glissement (Safari surtout).
  $$('.nx').forEach(function (row) {
    var imgs = $$('img[loading="lazy"]', row); if (!imgs.length) return;
    whenNear(row, function () { imgs.forEach(function (i) { i.loading = 'eager'; }); }, '800px 0px');
  });
  // Trustindex : connexion préparée dès le chargement de la page, widget chargé quand le navigateur est au repos
  // (donc prêt avant que le visiteur n'arrive au bloc), ou plus tôt s'il s'en approche vite.
  var ti = $$('[data-trustindex]');
  if (ti.length) {
    var pc = document.createElement('link'); pc.rel = 'preconnect'; pc.href = 'https://cdn.trustindex.io'; pc.crossOrigin = ''; document.head.appendChild(pc);
    var tiLoad = function (el) {
      if (el.hasAttribute('data-ti-done')) return; el.setAttribute('data-ti-done', '');
      var s = document.createElement('script');
      s.src = 'https://cdn.trustindex.io/loader.js?' + el.getAttribute('data-trustindex'); s.defer = true; s.async = true;
      el.appendChild(s);
    };
    ti.forEach(function (el) { whenNear(el, function () { tiLoad(el); }, '2500px 0px'); });
    var idle = function () { ti.forEach(tiLoad); };
    var afterLoad = function () { if ('requestIdleCallback' in window) requestIdleCallback(idle, { timeout: 1500 }); else setTimeout(idle, 800); };
    if (document.readyState === 'complete') afterLoad(); else addEventListener('load', afterLoad);
  }

  // Script Sportigo : chargé une seule fois par page, que ce soit pour le planning de la page ou pour un pop-up
  var spgQueue = [], spgLoading = false;
  function loadSportigo(cb) {
    if (window.initComponent) { cb(); return; }
    spgQueue.push(cb);
    if (spgLoading) return; spgLoading = true;
    var sc = document.createElement('script');
    sc.src = 'https://standalone.api.sportigo.fr/component-standalone.js';
    sc.onload = function () { spgQueue.splice(0).forEach(function (f) { f(); }); };
    document.body.appendChild(sc);
  }

  // Réservation de la séance d'essai : code officiel Sportigo, à l'identique, une seule fois par page.
  // Aucun filtre ajouté (activities, fromDate) : avec un filtre, le widget affichait la réservation payante.
  var TRIAL_ID = 'sportigo-appointment-container', trialStarted = false;
  function startTrial(el) {
    if (trialStarted) return; trialStarted = true;
    loadSportigo(function () {
      try {
        window.initComponent('Appointment', TRIAL_ID, el.getAttribute('data-widget-id'), {
          theme: { googleFont: { name: 'Inter' } },
          source: { kind: 'widget', ref: 'appointment' },
          readonly: false,
          forceBookBtn: true,
          colored: true,
          planning: parseInt(el.getAttribute('data-planning'), 10),
          displayMode: 'slide'
        });
      } catch (e) {}
    });
  }

  var spg = $('[data-sportigo]');
  if (spg) {
    var box = $('#' + TRIAL_ID, spg);
    var mo = new MutationObserver(function () { if (box.childElementCount) { spg.setAttribute('data-ready', ''); mo.disconnect(); } });
    mo.observe(box, { childList: true, subtree: true });
    var load = function () { startTrial(spg); };
    if (spg.hasAttribute('data-eager')) load(); else whenNear(spg, load);
  }

  /* ---------- Pop-up « séance d'essai » : le planning Sportigo s'ouvre sur la page, sans changer de page ---------- */
  (function () {
    var dlg = $('#trial-dlg'); if (!dlg || location.pathname === '/seance-essai/') return;
    var slot = $('[data-trial-slot]', dlg), last = null, wait = 0, home = null, watched = false;
    function close() {
      dlg.hidden = true; document.documentElement.style.overflow = ''; clearTimeout(wait);
      // Le planning de la page retourne à sa place
      if (home) { var c = document.getElementById(TRIAL_ID); if (c) home.parent.insertBefore(c, home.next); home = null; }
      if (last && last.focus) last.focus();
    }
    function open(from) {
      last = from || document.activeElement;
      var mn = $('#mnav'); if (mn && mn.getAttribute('data-open') === 'true') { mn.setAttribute('data-open', 'false'); mn.setAttribute('aria-hidden', 'true'); mn.setAttribute('inert', ''); document.body.style.overflow = ''; }
      // Un seul widget d'essai par page : on reprend celui du planning de la page s'il existe, sinon on en crée un
      var c = document.getElementById(TRIAL_ID);
      if (c && !slot.contains(c)) { home = { parent: c.parentNode, next: c.nextSibling }; slot.appendChild(c); }
      else if (!c) { c = document.createElement('div'); c.id = TRIAL_ID; slot.appendChild(c); }
      dlg.hidden = false; document.documentElement.style.overflow = 'hidden';
      var x = $('[data-trial-close]', dlg); if (x) x.focus({ preventScroll: true });
      if (c.childElementCount) dlg.setAttribute('data-ready', '');
      else if (!watched) {
        watched = true;
        // Si le planning ne s'affiche pas (réseau, bloqueur), on propose la page dédiée
        wait = setTimeout(function () { var cc = document.getElementById(TRIAL_ID); if (!cc || !cc.childElementCount) $('[data-trial-fallback]', dlg).hidden = false; }, 9000);
        var mo = new MutationObserver(function () { if (c.childElementCount) { dlg.setAttribute('data-ready', ''); clearTimeout(wait); mo.disconnect(); } });
        mo.observe(c, { childList: true, subtree: true });
      }
      startTrial(dlg);
    }
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href="/seance-essai/"]');
      if (a) { e.preventDefault(); open(a); return; }
      if (!dlg.hidden && (e.target.closest('[data-trial-close]') || e.target === $('.trial-scrim', dlg))) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !dlg.hidden) close(); });
    if (location.hash === '#essai') open(null);
  })();

  /* ---------- Pop-up « drop in » : widget Sportigo AppointmentFull (code officiel) ---------- */
  (function () {
    var dlg = $('#drop-dlg'); if (!dlg) return;
    var box = $('#sportigo-appointment-full-container', dlg), inited = false, last = null;
    function close() { dlg.hidden = true; document.documentElement.style.overflow = ''; if (last && last.focus) last.focus(); }
    function open(from) {
      last = from; dlg.hidden = false; document.documentElement.style.overflow = 'hidden';
      var c = $('[data-drop-close]', dlg); if (c) c.focus({ preventScroll: true });
      if (inited) return; inited = true;
      loadSportigo(function () {
        try {
          window.initComponent('AppointmentFull', 'sportigo-appointment-full-container', dlg.getAttribute('data-widget-id'), {
            source: { kind: 'widget', ref: 'appointment-full' },
            activities: JSON.parse(dlg.getAttribute('data-activities') || '[]'),
            displayMode: 'slide'
          });
        } catch (e) {}
      });
      var mo = new MutationObserver(function () { if (box.childElementCount) { dlg.setAttribute('data-ready', ''); mo.disconnect(); } });
      mo.observe(box, { childList: true, subtree: true });
    }
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-drop-open]');
      if (b) { e.preventDefault(); open(b); return; }
      if (!dlg.hidden && (e.target.closest('[data-drop-close]') || e.target === $('.trial-scrim', dlg))) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !dlg.hidden) close(); });
  })();

  /* ---------- Boutons de contact : l'adresse ou le numéro s'affiche au clic, et l'email ou l'appel se lance ---------- */
  $$('a[data-reveal]').forEach(function (a) {
    a.addEventListener('click', function () {
      var t = $('span', a); if (t) t.textContent = a.getAttribute('data-reveal');
    });
  });

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
