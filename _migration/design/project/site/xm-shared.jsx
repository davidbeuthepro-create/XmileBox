const XM_DS = window.XmileDesignSystem_8e8c40;
// Flèches : chevrons partout (choix utilisateur : les flèches droites et diagonales font « gabarit IA »)
const XM_ICON_MAP = { 'arrow-up-right': 'chevron-right', 'arrow-right': 'chevron-right', 'arrow-down': 'chevron-down' };
const XM = Object.assign({}, XM_DS, { Icon: props => React.createElement(XM_DS.Icon, Object.assign({}, props, { name: XM_ICON_MAP[props.name] || props.name })) });

// Source unique des coachs : un départ = une ligne en moins.
// Source : PDF « Coaches Xmiles ». courses : pages cours où le coach apparaît (crossfit, hyrox, halterophilie, pilates, kids). slot : id photo figé (ne jamais changer). bio : 2 lignes humaines (null = à compléter).
const XM_COACHES = [
  { name: 'Marine', courses: ['crossfit'], role: 'Co-propriétaire, coach', tags: ['CrossFit', 'Gestion de la box'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Yannick', courses: [], role: 'Co-propriétaire', tags: ['Gestion de la box'], photo: null },
  { name: 'Nico', courses: ['crossfit'], role: 'Head coach', tags: ['CrossFit', 'Personal training'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Quentin M.', slot: 'quentin', courses: ['crossfit', 'kids'], role: 'Coach', tags: ['CrossFit', 'Kids & Teens', 'Gymnastique', 'Personal training'], cert: 'CrossFit - Level 3', photo: { src: 'assets/coach-quentin-portrait.jpg', alt: 'Quentin, coach chez Xmile, sourit en poussant un sled chargé dans la box' } },
  { name: 'Amal', courses: ['crossfit'], role: 'Coach', tags: ['CrossFit'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Sinan', courses: ['crossfit'], role: 'Coach', tags: ['CrossFit', 'Personal training'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Ali', courses: ['crossfit', 'hyrox'], role: 'Coach', tags: ['CrossFit', 'Hyrox'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Maxime', courses: ['crossfit', 'hyrox'], role: 'Coach', tags: ['CrossFit', 'Hyrox'], cert: 'CrossFit - Level 2', photo: null },
  { name: 'Natsuko', courses: ['crossfit', 'hyrox'], role: 'Coach', tags: ['CrossFit', 'Hyrox'], cert: 'CrossFit - Level 2', photo: null },
  { name: 'Mathieu', courses: ['crossfit', 'hyrox'], role: 'Coach', tags: ['CrossFit', 'Hyrox'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Alizée', courses: ['crossfit', 'hyrox', 'kids'], role: 'Coach', tags: ['CrossFit', 'Hyrox', 'Kids & Teens'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Alexander', courses: ['crossfit'], role: 'Coach', tags: ['CrossFit'], cert: 'CrossFit - Level 2', photo: null },
  { name: 'Quentin K.', courses: ['crossfit', 'hyrox'], role: 'Coach', tags: ['CrossFit', 'Hyrox'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Valéria', courses: ['hyrox', 'kids'], role: 'Coach', tags: ['Hyrox', 'Kids & Teens'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Oualid', courses: ['hyrox'], role: 'Coach', tags: ['Hyrox'], cert: 'CrossFit - Level 1', photo: null },
  { name: 'Philippe', courses: ['halterophilie'], role: 'Coach', tags: ['Haltérophilie', 'Programmation individuelle'], photo: null },
  { name: 'Fe', courses: ['pilates'], role: 'Coach', tags: ['Pilates'], photo: null },
];

// Clic sur une photo remplaçable (mode édition) dans un lien : on ne suit pas le lien, la photo garde ses boutons Remplacer / Edit
// Le clic programmatique sur le champ fichier (bouton Remplacer > importer) ne doit pas être annulé, sinon la fenêtre de choix ne s'ouvre pas.
const xmSlotGuard = e => {
  const ne = e.nativeEvent, p = ne.composedPath ? ne.composedPath() : [];
  if (!p.some(n => n.tagName === 'IMAGE-SLOT' && n.hasAttribute('data-editable'))) return;
  ne.__xmSlot = true;
  if (p[0] && p[0].tagName !== 'INPUT') e.preventDefault();
};

const XM_COURSE_NAMES = { crossfit: 'CrossFit', hyrox: 'Hyrox', halterophilie: 'Haltérophilie', pilates: 'Pilates', kids: 'Kids & Teens' };
const XM_COURSES = [
  { key: 'crossfit', name: 'CrossFit', href: '/crossfit/', desc: 'WOD d\'1 h, tous niveaux, et Team WOD le samedi', img: ['assets/depassement-de-soi.jpg', 'Un membre saute par-dessus une partenaire qui fait un burpee pendant un WOD en duo', '50% 30%'] },
  { key: 'hyrox', name: 'Hyrox', href: '/preparation-hyrox/', desc: 'Hyrox Training Club, débutant ou confirmé', img: ['assets/endurance.jpg', 'Une membre en sweat vert rame à l\'ergomètre pendant une séance Hyrox', '50% 30%'] },
  { key: 'halterophilie', name: 'Haltérophilie', href: '/halterophilie/', desc: 'Olympique, Strongman et Powerlifting', img: ['assets/halterophilie.jpg', 'Un membre en t-shirt Xmile prépare un soulevé de terre, observé par d\'autres membres', '50% 45%'] },
  { key: 'pilates', name: 'Pilates', href: '/pilates/', desc: 'Mardi et jeudi, avec Coach Fe', img: ['assets/pilates.jpg', 'Des membres sur leur tapis pendant un cours de Pilates à la box, jambes levées', '50% 62%'] },
  { key: 'kids', name: 'Kids & Teens', href: '/kids-teens/', desc: 'De 6 à 16 ans, un créneau fixe chaque semaine', img: ['assets/kids.jpg', 'Un coach Xmile accroupi donne une consigne à deux enfants, cadrés sans leur visage', '50% 100%'] },
];

// Pages locales (liées depuis le pied de page). Même liste de communes pour CrossFit et Hyrox.
const XM_COMMUNES = [['bruxelles', 'Bruxelles'], ['woluwe-saint-lambert', 'Woluwe-Saint-Lambert'], ['woluwe-saint-pierre', 'Woluwe-Saint-Pierre'], ['zaventem', 'Zaventem'], ['kraainem', 'Kraainem'], ['wezembeek-oppem', 'Wezembeek-Oppem'], ['evere', 'Evere'], ['schaerbeek', 'Schaerbeek'], ['etterbeek', 'Etterbeek'], ['machelen', 'Machelen'], ['kortenberg', 'Kortenberg'], ['tervuren', 'Tervuren'], ['auderghem', 'Auderghem']];
const XM_LOCAL = [['/crossfit/debutant/', 'CrossFit débutant'], ...XM_COMMUNES.map(([s, n]) => ['/crossfit/' + s + '/', 'CrossFit ' + n])];
const XM_LOCAL_HYROX = [['/hyrox/debutant/', 'Hyrox débutant'], ['/hyrox/duo/', 'Hyrox en duo'], ...XM_COMMUNES.map(([s, n]) => ['/hyrox/' + s + '/', 'Hyrox ' + n])];

const XM_FACTS = {
  street: 'Avenue du Péage 63', streetNl: 'Tollaan 63', city: '1932 Sint-Stevens-Woluwe',
  phone: '+32 473 55 12 86', phoneHref: 'tel:+32473551286', email: 'xmileconcept@gmail.com',
  instagram: 'https://www.instagram.com/crossfit_xmile/', facebook: 'https://www.facebook.com/people/CrossFit-Xmile/61566407701269/', vat: '1013.373.450',
  healthLab: 'https://www.xmile-health-lab.be', buy: 'https://xmile-crossfit.sportigo.fr/buy',
  googleAvis: 'https://share.google/Xkiw2AzOOhBruDJGg',
  googleFiche: 'https://www.google.com/maps/search/?api=1&query=CrossFit+Xmile+Avenue+du+P%C3%A9age+63+1932+Sint-Stevens-Woluwe',
  hours: [['Lun - jeu', '6h30 - 21h'], ['Vendredi', '6h30 - 20h'], ['Samedi', '7h - 12h'], ['Dimanche', '7h - 13h']],
  parking: 'Parking gratuit',
};

// Planning Sportigo filtré par page : ids des disciplines Sportigo (option activities du widget). Nouvelle discipline créée dans Sportigo = l'ajouter ici. Free Acces (12380) volontairement absent des pages cours.
const XM_SPG = { crossfit: [12379, 12381, 14019, 21468, 23372, 12447, 14020, 31172], hyrox: [12382], halterophilie: [13269, 13945], pilates: [30741], kids: [12668, 13356] };

// Planning en texte (le widget Sportigo est invisible pour Google)
const XM_SCHEDULE = {
  crossfit: { title: 'CrossFit WOD', rows: [['Lundi', ['6h30', '12h30', '17h', '18h', '19h', '20h']], ['Mardi', ['6h30', '12h30', '17h', '18h', '19h', '20h']], ['Mercredi', ['6h30', '12h30', '17h', '18h', '19h', '20h']], ['Jeudi', ['6h30', '12h', '17h', '18h', '19h', '20h']], ['Vendredi', ['6h30', '12h30', '17h', '18h', '19h']]] },
  teamwod: { title: 'Team WOD', rows: [['Samedi', ['9h', '10h', '11h']]] },
  hyrox: { title: 'Hyrox', rows: [['Lundi - jeudi', ['18h30', '19h30']], ['Vendredi', ['12h', '18h30']], ['Dimanche', ['10h', '11h', '12h']]] },
  halterophilie: { title: 'Haltérophilie olympique', rows: [['Lun, mer, ven', ['17h30']]] },
  strongman: { title: 'Strongman / Powerlifting', rows: [['Samedi', ['10h']]] },
  pilates: { title: 'Pilates · Coach Fe', rows: [['Mardi', ['18h30 - 19h30']], ['Jeudi', ['17h30']]] },
  kids: { title: 'Kids · 6-10 ans', rows: [['Mercredi', ['15h - 16h', 'Endurance et force']], ['Samedi', ['10h - 11h', 'CrossFit']]] },
  teens: { title: 'Teens · 11-16 ans', rows: [['Mercredi', ['16h - 17h', 'Endurance et force']], ['Samedi', ['11h - 12h', 'CrossFit']]] },
  free: { title: 'Free Access', rows: [['Lun et mar', ['7h - 21h']], ['Mer et jeu', ['7h - 20h30']], ['Vendredi', ['7h - 19h30']], ['Sam et dim', ['7h - 12h']]] },
};

const XM_PRICES = [
  { id: 'easy', main: true, name: 'Easy Peasy', price: '79 €', per: '/ mois', desc: '2 cours par semaine' },
  { id: 'unlimited', main: true, name: 'Unlimited', price: '115 €', per: '/ mois', desc: 'Accès illimité à tous les cours, dont 1 Pilates par semaine' },
  { id: 'duo', main: true, name: 'Unlimited Duo', price: '199 €', per: '/ mois', desc: 'Accès illimité pour un couple' },
  { id: 'card10', name: 'Carte 10 séances', price: '130 €', desc: 'Valable 3 mois, tous les cours sauf le Pilates' },
  { id: 'drop', name: 'Drop-in', price: '20 €', desc: 'La séance, sur réservation' },
];
// Qui a accès à quoi : tableau comparatif des pages cours. Valeurs : true = inclus, false = non inclus, texte = précision, 'todo:…' = à confirmer
const XM_ACCESS = {
  groups: [['Abonnements mensuels', ['easy', 'unlimited', 'duo']], ['À la séance', ['card10', 'drop', 'pilates10']]],
  cols: { easy: 'Easy Peasy', unlimited: 'Unlimited', duo: 'Unlimited Duo', card10: 'Carte 10 séances', drop: 'Drop-in', pilates10: 'Carte 10 Pilates' },
  rows: [
    { k: 'freq', label: 'Séances', v: { easy: '2 / semaine', unlimited: 'Illimité', duo: 'Illimité, à deux', card10: '10, valables 3 mois', drop: '1 séance', pilates10: '10 séances Pilates' } },
    { k: 'crossfit', label: 'CrossFit', v: { easy: true, unlimited: true, duo: true, card10: true, drop: true, pilates10: false } },
    { k: 'teamwod', label: 'Team WOD du samedi', v: { easy: true, unlimited: true, duo: true, card10: true, drop: true, pilates10: false } },
    { k: 'hyrox', label: 'Hyrox', v: { easy: true, unlimited: true, duo: true, card10: true, drop: true, pilates10: false } },
    { k: 'halterophilie', label: 'Haltérophilie', v: { easy: true, unlimited: true, duo: true, card10: true, drop: true, pilates10: false } },
    { k: 'pilates', label: 'Pilates', v: { easy: false, unlimited: '1 / semaine', duo: 'todo:À confirmer', card10: false, drop: false, pilates10: true } },
    { k: 'free', label: 'Free Access', v: { easy: true, unlimited: true, duo: true, card10: 'Oui, compte comme 1 séance', drop: true, pilates10: false } },
    { k: 'lounge', label: 'Lounge & recovery', v: { easy: true, unlimited: true, duo: true, card10: true, drop: true, pilates10: true } },
    { k: 'price', label: 'Prix', price: true, v: { easy: ['79 €', '/ mois'], unlimited: ['115 €', '/ mois'], duo: ['199 €', '/ mois'], card10: ['130 €'], drop: ['20 €'], pilates10: 'todo:À compléter : prix' } },
  ],
};
const XM_KIDS_PRICES = [
  { id: 'k1', name: '1 séance par semaine', price: '40 €', per: '/ mois' },
  { id: 'k2', name: '2 séances par semaine', price: '55 €', per: '/ mois' },
];

// Aperçu : les vrais liens (/crossfit/…) ouvrent la maquette correspondante
const XM_ROUTES = { '/': 'Accueil.html', '/mentions-legales/': 'Mentions legales.html', '/politique-de-confidentialite/': 'Politique de confidentialite.html', '/politique-de-cookies/': 'Politique de cookies.html', '/conditions-generales/': 'Conditions generales.html', '/crossfit/': 'CrossFit.html', '/preparation-hyrox/': 'Hyrox.html', '/halterophilie/': 'Halterophilie.html', '/pilates/': 'Pilates.html', '/kids-teens/': 'Kids et Teens.html', '/notre-vision/': 'Notre vision.html', '/team-building/': 'Team building.html', '/seance-essai/': 'Seance essai.html' };
[...XM_LOCAL, ...XM_LOCAL_HYROX].forEach(([h]) => { XM_ROUTES[h] = 'Page locale.html?p=' + h.split('/').filter(Boolean).join('-'); });
if (!window.__xmRouter) {
  window.__xmRouter = true;
  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.__xmSlot) return;
    const a = e.target.closest && e.target.closest('a[href^="/"]'); if (!a) return;
    e.preventDefault();
    const [p, h] = a.getAttribute('href').split('#'); const f = XM_ROUTES[p];
    if (f) location.href = encodeURI(f) + (h ? '#' + h : '');
  });
}

function Todo({ children }) { return <span className="todo">[{children}]</span>; }

function BtnLink({ href, children, variant = 'primary', size, icon, full, external, className = '' }) {
  const { Icon } = XM;
  const cls = ['btn', 'btn-' + variant, size ? 'btn-' + size : '', full ? 'btn-full' : '', className].join(' ');
  return <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>{children}{icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} />}</a>;
}

function TLink({ href, children, icon = 'arrow-up-right', external }) {
  const { Icon } = XM;
  return <a className="tlink" href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>{children}<Icon name={icon} size={16} /></a>;
}

function Disc({ icon = 'arrow-up-right', size }) {
  const { Icon } = XM;
  return <span className="disc" aria-hidden="true" style={size ? { width: size, height: size } : undefined}><Icon name={icon} size={size ? Math.round(size * .42) : 19} /></span>;
}

// Photo remplaçable en mode édition. id = clé de sauvegarde : ne jamais la renommer, sinon la photo déposée ne s'affiche plus.
function Photo({ id, src, alt, caption, className = '', style }) {
  return <figure className={'ph ' + className} style={style}>
    <image-slot id={'ph-' + (id || 'img-' + xmSlug(src))} shape="rect" src={src} placeholder={alt} role="img" aria-label={alt}></image-slot>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}

const xmSlug = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

// Cadre photo à remplir en mode édition (glisser une image) : redimensionnée et convertie en WebP automatiquement.
// Les photos déposées vivent dans .image-slots.state.json, indexées par id : toujours passer un id fixe.
function Slot({ children, className = '', style, dark, id, src }) {
  const txt = typeof children === 'string' ? children : '';
  return <div className={'slot ' + (dark ? 'dark ' : '') + className} style={style}>
    <image-slot id={'ph-' + (id || xmSlug(txt))} shape="rect" src={src} placeholder={'Photo à faire : ' + txt}></image-slot>
  </div>;
}

function CoachPic({ c }) {
  return <div className="coach-pic slot"><image-slot id={'coach-' + (c.slot || xmSlug(c.name))} shape="rect" src={c.photo ? c.photo.src : undefined} placeholder={'Portrait de ' + c.name + ', cadrage poitrine, fond mur de la box'}></image-slot></div>;
}

// Badge avis condensé (widget Trustindex)
function GoogleBadge() { return <TrustindexReviews id="ac5db5f82d638307d2661141b00" className="ti-badge" />; }

// Vidéo + affiche remplaçables en mode édition (vidéo : bouton « Changer la vidéo » au survol, affiche : glisser une image)
function VideoFacade({ id = 'video', src, poster, posterAlt, label, center }) {
  const [on, setOn] = React.useState(false);
  const v = React.useRef(null);
  React.useEffect(() => { if (on && v.current) v.current.play().catch(() => {}); }, [on]);
  return <div className={'vfacade' + (center ? ' center' : '')} data-on={on}>
    <video ref={v} data-vslot={id} src={src} controls={on} playsInline preload="none" />
    {!on && <image-slot id={'ph-affiche-' + id} shape="rect" src={poster} placeholder={posterAlt} aria-label={posterAlt}></image-slot>}
    {!on && <button type="button" className="vfacade-play" onClick={() => setOn(true)} aria-label={'Lire la vidéo : ' + label}><Disc icon="play" size={center ? 112 : 76} /><span className="label">{label}</span></button>}
  </div>;
}

function Faq({ items }) {
  const { Icon } = XM;
  return <div className="faq-list">
    {items.map((it, i) => <details key={i} open={i === 0}>
      <summary>{it.q}<span className="pm" aria-hidden="true"><Icon name="plus" size={16} /></span></summary>
      <div className="ans">{it.a}</div>
    </details>)}
  </div>;
}

function SecHead({ eyebrow, title, lead, id, dark, children }) {
  return <div className={'sec-head' + (dark ? ' on-dark' : '')}>
    <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2 className="disp h2" id={id}>{title}</h2></div>
    {lead && <div className="sec-head-r"><p className="lead">{lead}</p>{children}</div>}
  </div>;
}

// Tuile à onglet (version corrigée du NotchCard : rayons de l'onglet et du congé accordés)
function Notch({ bg, fg, children, className = '' }) {
  return <div className={'notch ' + className} style={{ '--n-bg': bg, '--n-fg': fg }}><div className="notch-body">{children}</div></div>;
}

function ClickVideo({ id = 'video', src, label }) {
  const { Icon, IconButton } = XM;
  const v = React.useRef(null);
  const [started, setStarted] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [vol, setVol] = React.useState(0.8);
  const [muted, setMuted] = React.useState(false);
  React.useEffect(() => { if (v.current) { v.current.volume = vol; v.current.muted = muted; } }, [vol, muted]);
  const toggle = () => { const el = v.current; if (!el.getAttribute('src')) return; setStarted(true); if (el.paused) { const p = el.play(); if (p && p.catch) p.catch(() => {}); } else el.pause(); };
  const level = muted ? 0 : vol;
  return <div className="cvid">
    <video ref={v} data-vslot={id} src={src ? src + '#t=0.1' : undefined} preload="metadata" playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onClick={() => started && toggle()} />
    {!started && <button type="button" className="cvid-start" onClick={toggle} aria-label={'Lire la vidéo : ' + label}><Disc icon="play" size={72} /><span className="label">{label}</span></button>}
    <div className="cvid-bar">
      <IconButton icon={playing ? 'pause' : 'play'} size={38} label={playing ? 'Pause' : 'Lecture'} onClick={toggle} />
      <button type="button" className="cvid-mute" onClick={() => setMuted(m => !m)} aria-label={muted ? 'Réactiver le son' : 'Couper le son'}><Icon name={level === 0 ? 'volume-x' : level < .5 ? 'volume-1' : 'volume-2'} size={20} /></button>
      <input type="range" min="0" max="1" step="0.05" value={level} onChange={e => { setVol(+e.target.value); setMuted(false); }} aria-label="Volume" />
    </div>
  </div>;
}

// Widget avis Trustindex : le script doit être injecté dans le DOM (une balise <script> rendue par React ne s'exécute pas)
function TrustindexReviews({ id = '4b6937182bb08199f8162541892', className = 'ti-wrap' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el || el.dataset.loaded) return;
    el.dataset.loaded = '1';
    const sc = document.createElement('script');
    sc.src = 'https://cdn.trustindex.io/loader.js?' + id; sc.defer = true; sc.async = true;
    el.appendChild(sc);
  }, []);
  return <div ref={ref} className={className} />;
}

Object.assign(window, { xmSlotGuard, Notch, ClickVideo, TrustindexReviews, CoachPic, xmSlug });
Object.assign(window, { XM_COMMUNES, XM_SCHEDULE, XM_SPG, XM_PRICES, XM_ACCESS, XM_KIDS_PRICES, XM_ROUTES, XM_LOCAL_HYROX });
Object.assign(window, { XM, XM_COACHES, XM_COURSE_NAMES, XM_COURSES, XM_LOCAL, XM_FACTS, Todo, BtnLink, TLink, Disc, Photo, Slot, GoogleBadge, VideoFacade, Faq, SecHead });
