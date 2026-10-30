function Header({ current }) {
  const cur = h => current === h ? 'page' : undefined;
  const inCourses = XM_COURSES.some(x => x.href === current);
  const { Icon, IconButton } = XM;
  const [dd, setDd] = React.useState(false);
  const [mob, setMob] = React.useState(false);
  const ddRef = React.useRef(null);
  const ddT = React.useRef(0);
  const canHover = () => matchMedia('(hover:hover)').matches;
  const ddOpen = () => { if (!canHover()) return; clearTimeout(ddT.current); setDd(true); };
  const ddClose = () => { if (!canHover()) return; clearTimeout(ddT.current); ddT.current = setTimeout(() => setDd(false), 280); };
  React.useEffect(() => {
    const close = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setDd(false); };
    const esc = e => { if (e.key === 'Escape') { setDd(false); setMob(false); } };
    document.addEventListener('click', close); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', esc); };
  }, []);
  React.useEffect(() => { document.body.style.overflow = mob ? 'hidden' : ''; }, [mob]);
  return <>
    <header className="hdr">
      <div className="wrap hdr-in">
        <a className="hdr-logo" href="/" aria-label="Xmile CrossFit, accueil"><img src="assets/logo-orange.png" alt="Logo Xmile CrossFit" /></a>
        <nav className="nav" aria-label="Navigation principale">
          <div className="nav-dd" ref={ddRef} data-open={dd} onMouseEnter={ddOpen} onMouseLeave={ddClose} onFocus={() => setDd(true)}>
            <button type="button" className="nav-dd-btn" data-current={inCourses} aria-expanded={dd} aria-controls="dd-cours" onClick={() => setDd(v => !v)}>Nos cours <Icon name="chevron-down" size={16} style={{ transition: 'transform 200ms var(--ease-out)', transform: dd ? 'rotate(180deg)' : 'none' }} /></button>
            <div className="dd-panel" id="dd-cours">
              <ul className="wrap dd-grid">{XM_COURSES.map((c, i) => <li key={c.href} style={{ '--i': i }}><a className="dd-card" href={c.href} aria-current={cur(c.href)} onClick={xmSlotGuard} onDragStart={xmSlotGuard} tabIndex={dd ? 0 : -1}>
                <span className="dd-ph"><Photo id={'nav-' + c.key} src={c.img[0]} alt={c.img[1]} /></span>
                <span className="dd-name">{c.name}<Icon name="chevron-right" size={18} /></span>
                <span className="dd-desc">{c.desc}</span>
              </a></li>)}</ul>
            </div>
          </div>
          <a href="/notre-vision/" aria-current={cur('/notre-vision/')}>Notre vision</a>
          <a href="/team-building/" aria-current={cur('/team-building/')}>Team building</a>
          <a href={XM_FACTS.healthLab} target="_blank" rel="noopener">Health Lab <Icon name="arrow-up-right" size={15} /></a>
        </nav>
        <div className="hdr-cta">
          <div className="hdr-social">
            <a href={XM_FACTS.instagram} target="_blank" rel="noopener" aria-label="Instagram de Xmile"><Icon name="instagram" size={18} /></a>
            <a href={XM_FACTS.facebook} target="_blank" rel="noopener" aria-label="Facebook de Xmile"><Icon name="facebook" size={18} /></a>
          </div>
          <BtnLink href="/seance-essai/">Séance d'essai</BtnLink>
          <span className="burger"><IconButton icon="menu" variant="dark" size={48} label="Ouvrir le menu" onClick={() => setMob(true)} /></span>
        </div>
      </div>
    </header>
    <div className="mnav" data-open={mob} aria-hidden={!mob} role="dialog" aria-label="Menu">
      <div className="mnav-top"><img src="assets/logo-white.png" alt="Logo Xmile CrossFit" /><IconButton icon="x" variant="light" size={48} label="Fermer le menu" onClick={() => setMob(false)} /></div>
      <div className="mnav-label">Nos cours</div>
      <div className="mnav-sub">{XM_COURSES.map(c => <a key={c.href} href={c.href}>{c.name}<Icon name="arrow-up-right" size={18} /></a>)}</div>
      <a href="/notre-vision/">Notre vision</a>
      <a href="/team-building/">Team building</a>
      <a href={XM_FACTS.healthLab} target="_blank" rel="noopener">Health Lab<Icon name="arrow-up-right" size={26} /></a>
      <a href="/seance-essai/">Séance d'essai<Icon name="arrow-up-right" size={26} color="var(--xm-orange-500)" /></a>
      <div className="mnav-social">
        <a href={XM_FACTS.instagram} target="_blank" rel="noopener"><Icon name="instagram" size={20} />Instagram</a>
        <a href={XM_FACTS.facebook} target="_blank" rel="noopener"><Icon name="facebook" size={20} />Facebook</a>
      </div>
    </div>
    <div className="sticky-cta"><BtnLink href="/seance-essai/" full icon="arrow-up-right">Séance d'essai gratuite</BtnLink></div>
  </>;
}

function Footer() {
  const { Icon } = XM;
  const pages = [['/', 'Accueil'], ...XM_COURSES.map(c => [c.href, c.name]), ['/notre-vision/', 'Notre vision'], ['/team-building/', 'Team building'], ['/seance-essai/', 'Séance d\'essai']];
  return <><footer className="ftr">
    <div className="wrap">
      <div className="slab ftr-slab on-dark">
        <div className="ftr-top">
          <div className="ftr-brand">
            <img src="assets/logo-white.png" alt="Logo Xmile CrossFit" />
            <p style={{ font: '500 16px/1.45 var(--font-body)', color: 'var(--text-on-dark)', maxWidth: '26ch' }}>Une box de CrossFit, Hyrox et haltérophilie à Woluwe, à l'est de Bruxelles.</p>
            <GoogleBadge />
          </div>
          <div className="ftr-col">
            <h2>Nous trouver</h2>
            <address>Xmile CrossFit<br />{XM_FACTS.street} ({XM_FACTS.streetNl})<br />{XM_FACTS.city}<br />Belgique</address>
            <p style={{ marginTop: 10 }}>{XM_FACTS.parking}</p>
            <p style={{ marginTop: 10 }}><a href={XM_FACTS.googleFiche} target="_blank" rel="noopener">Itinéraire Google Maps</a></p>
          </div>
          <div className="ftr-col">
            <h2>Contact</h2>
            <ul>
              <li><a href={XM_FACTS.phoneHref}>{XM_FACTS.phone}</a></li>
              <li><a href={'mailto:' + XM_FACTS.email}>{XM_FACTS.email}</a></li>
            </ul>
            <div className="social" style={{ marginTop: 16 }}>
              <a href={XM_FACTS.instagram} target="_blank" rel="noopener" aria-label="Instagram @crossfit_xmile"><Icon name="instagram" size={18} />@crossfit_xmile</a>
              <a href={XM_FACTS.facebook} target="_blank" rel="noopener" aria-label="Facebook CrossFit Xmile"><Icon name="facebook" size={18} />CrossFit Xmile</a>
            </div>
            <h2 style={{ marginTop: 28 }}>Le site</h2>
            <ul>{pages.map(([h, l]) => <li key={h}><a href={h}>{l}</a></li>)}<li><a href={XM_FACTS.buy} target="_blank" rel="noopener">Je m'abonne</a></li></ul>
          </div>
          <div className="ftr-col">
            <h2>Ouverture</h2>
            <div className="ftr-hours">{XM_FACTS.hours.map(([d, h]) => <React.Fragment key={d}><span style={{ color: 'var(--text-on-dark)', font: '500 15px/1.6 var(--font-body)' }}>{d}</span><span style={{ font: '400 15px/1.6 var(--font-body)', color: 'var(--text-on-dark-muted)' }}>{h}</span></React.Fragment>)}</div>
            <h2 style={{ marginTop: 28 }}>À côté de la box</h2>
            <p><a href={XM_FACTS.healthLab} target="_blank" rel="noopener">Xmile Health Lab <Icon name="arrow-up-right" size={14} /></a><br />Kiné, soins sportifs et récupération, même adresse.</p>
          </div>
        </div>
        <details className="ftr-local">
          <summary><span>CrossFit et Hyrox près de chez toi</span><Icon name="chevron-down" size={20} /></summary>
          <div className="ftr-local-cols">
            <div><h2>CrossFit</h2><ul>{XM_LOCAL.map(([h, l]) => <li key={h}><a href={h}>{l}</a></li>)}</ul></div>
            <div><h2>Hyrox</h2><ul>{XM_LOCAL_HYROX.map(([h, l]) => <li key={h}><a href={h}>{l}</a></li>)}</ul></div>
          </div>
        </details>
        <div className="ftr-bottom">
          <span>© Xmile CrossFit · N° d'entreprise {XM_FACTS.vat}</span>
          <ul><li><a href="/mentions-legales/">Mentions légales</a></li><li><a href="/politique-de-confidentialite/">Politique de confidentialité</a></li><li><a href="/politique-de-cookies/">Politique de cookies</a></li><li><a href="/conditions-generales/">Conditions générales</a></li><li><button type="button" className="ftr-ck" data-consent-open="">Gérer mes cookies</button></li></ul>
        </div>
      </div>
    </div>
  </footer><ConsentManager /></>;
}

// Consentement cookies : cookie xmile_consent, 6 mois. Rien de Google ni Meta avant accord.
// Intégration : écouter window 'xm:consent' (detail = { analytics, ads }) pour mettre à jour Consent Mode v2 / GTM.
const XM_CONSENT_DAYS = 182;
function xmReadConsent() {
  try {
    const m = document.cookie.match(/(?:^|; )xmile_consent=([^;]*)/);
    const raw = m ? decodeURIComponent(m[1]) : localStorage.getItem('xmile_consent');
    const c = raw ? JSON.parse(raw) : null;
    return c && c.t && Date.now() - c.t < XM_CONSENT_DAYS * 864e5 ? c : null;
  } catch (e) { return null; }
}
function xmSaveConsent(analytics, ads) {
  const c = { v: 1, t: Date.now(), analytics: !!analytics, ads: !!ads }, s = JSON.stringify(c);
  try { document.cookie = 'xmile_consent=' + encodeURIComponent(s) + '; max-age=' + XM_CONSENT_DAYS * 86400 + '; path=/; SameSite=Lax'; } catch (e) {}
  try { localStorage.setItem('xmile_consent', s); } catch (e) {}
  window.dispatchEvent(new CustomEvent('xm:consent', { detail: c }));
  return c;
}
function ConsentSwitch({ on, label, locked, onChange }) {
  const { Switch } = XM;
  return <button type="button" className="ck-sw" role="switch" aria-checked={on} aria-label={label} disabled={locked} onClick={() => onChange && onChange(!on)}><span aria-hidden="true"><Switch checked={on} disabled={locked} /></span></button>;
}
const XM_CONSENT_CATS = [
  ['need', 'Strictement nécessaires', ' (toujours actifs) : fonctionnement du site, réservation des cours, mémorisation de ton choix.'],
  ['analytics', 'Mesure d\'audience', ' : pages vues et provenance des visites, pour améliorer le site (Google Analytics).'],
  ['ads', 'Publicité', ' : mesurer l\'efficacité de nos pubs et montrer nos offres sur Google, Facebook et Instagram.'],
];
function ConsentManager() {
  const { Dialog } = XM;
  const [c, setC] = React.useState(xmReadConsent);
  const [panel, setPanel] = React.useState(false);
  const [d, setD] = React.useState({ analytics: false, ads: false });
  React.useEffect(() => {
    const click = e => {
      const b = e.target.closest && e.target.closest('[data-consent-open]'); if (!b) return;
      e.preventDefault();
      const cur = xmReadConsent(); setD({ analytics: !!(cur && cur.analytics), ads: !!(cur && cur.ads) }); setPanel(true);
    };
    document.addEventListener('click', click); return () => document.removeEventListener('click', click);
  }, []);
  React.useEffect(() => {
    if (!panel) return;
    const esc = e => { if (e.key === 'Escape') setPanel(false); };
    document.addEventListener('keydown', esc); return () => document.removeEventListener('keydown', esc);
  }, [panel]);
  const save = (a, b) => { setC(xmSaveConsent(a, b)); setPanel(false); };
  const pop = !c && !panel, yes = React.useRef(null);
  React.useEffect(() => {
    if (!pop) return;
    const h = document.documentElement, prev = h.style.overflow; h.style.overflow = 'hidden';
    const t = setTimeout(() => yes.current && yes.current.focus({ preventScroll: true }), 60);
    return () => { h.style.overflow = prev; clearTimeout(t); };
  }, [pop]);
  return ReactDOM.createPortal(<>
    {pop && <div className="ck-pop"><div className="ck-bar on-dark" role="dialog" aria-modal="true" aria-labelledby="ck-t" aria-describedby="ck-x">
      <p className="ck-t" id="ck-t">Des cookies, seulement si tu es d'accord</p>
      <p className="ck-x" id="ck-x">On aimerait savoir comment tu utilises le site et montrer nos pubs aux bonnes personnes. Les cookies de mesure et de pub ne se déclenchent qu'avec ton accord.</p>
      <div className="ck-btns">
        <button type="button" ref={yes} className="btn btn-primary ck-yes" onClick={() => save(true, true)}>Tout accepter</button>
        <button type="button" className="btn btn-light" onClick={() => save(false, false)}>Tout refuser</button>
        <button type="button" className="btn btn-light" data-consent-open="">Personnaliser</button>
      </div>
      <a className="tlink" href="/politique-de-cookies/">Politique de cookies</a>
    </div></div>}
    <div className="ck-dlg"><Dialog open={panel} onClose={() => setPanel(false)} title="Gérer mes cookies" width={580} footer={<div className="ck-foot">
      <button type="button" className="btn btn-dark" onClick={() => save(d.analytics, d.ads)}>Enregistrer mes choix</button>
      <button type="button" className="btn btn-dark" onClick={() => save(false, false)}>Tout refuser</button>
      <button type="button" className="btn btn-dark" onClick={() => save(true, true)}>Tout accepter</button>
    </div>}>
      <p>Choisis ce que tu acceptes. Ton choix est gardé 6 mois et tu peux le changer à tout moment en bas de chaque page.</p>
      <ul className="ck-cats">{XM_CONSENT_CATS.map(([k, n, t]) => <li key={k}><p><strong>{n}</strong>{t}</p><ConsentSwitch on={k === 'need' ? true : d[k]} locked={k === 'need'} label={n} onChange={v => setD(o => ({ ...o, [k]: v }))} /></li>)}</ul>
    </Dialog></div>
  </>, document.body);
}

// Pages sans contenu React (pages légales) : header + footer seuls
function mountChrome(current) {
  ReactDOM.createRoot(document.getElementById('hdr-root')).render(<Header current={current} />);
  ReactDOM.createRoot(document.getElementById('ftr-root')).render(<Footer />);
}

Object.assign(window, { Header, Footer, ConsentManager, mountChrome, xmReadConsent });
