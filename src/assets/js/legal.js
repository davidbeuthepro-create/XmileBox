// Pages légales : sommaire ouvert sur desktop, replié sur mobile, section en cours surlignée
(function () {
  var toc = document.getElementById('lg-toc'); if (!toc) return;
  var mq = matchMedia('(min-width:961px)');
  function sync() { toc.open = mq.matches; }
  sync();
  if (mq.addEventListener) mq.addEventListener('change', sync); else mq.addListener(sync);
  toc.querySelector('summary').addEventListener('click', function (e) { if (mq.matches) e.preventDefault(); });
  var links = [].slice.call(toc.querySelectorAll('a[href^="#"]')), byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; a.addEventListener('click', function () { if (!mq.matches) toc.open = false; }); });
  var secs = [].slice.call(document.querySelectorAll('.lg-sec')), last = null;
  function spy() {
    var cur = secs[0];
    secs.forEach(function (s) { if (s.getBoundingClientRect().top < 180) cur = s; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = secs[secs.length - 1];
    if (cur === last) return; last = cur;
    links.forEach(function (a) { a.removeAttribute('aria-current'); });
    if (cur && byId[cur.id]) byId[cur.id].setAttribute('aria-current', 'location');
  }
  addEventListener('scroll', spy, { passive: true }); spy();
})();
