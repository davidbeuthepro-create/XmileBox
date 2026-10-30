// Blocs partagés entre les pages (cours, vision, essai, landing locale)
function mountPage(page, current) {
  ReactDOM.createRoot(document.getElementById('hdr-root')).render(<Header current={current} />);
  ReactDOM.createRoot(document.getElementById('root')).render(page);
  ReactDOM.createRoot(document.getElementById('ftr-root')).render(<Footer />);
}

function Sec({ id, alt, flush, label, labelledby, children, className = '' }) {
  return <section id={id} className={'sec ' + className} aria-label={label} aria-labelledby={labelledby} style={{ background: alt ? 'var(--bg-alt)' : undefined, paddingTop: flush ? 0 : undefined }}>
    <div className="wrap">{children}</div>
  </section>;
}

function CheckList({ items, className = '' }) {
  const { Icon } = XM;
  return <ul className={'checks ' + className}>{items.map((t, i) => <li key={i}><Icon name="check" size={18} color="var(--xm-orange-600)" /><span>{t}</span></li>)}</ul>;
}

// Planning en texte
function SchedTable({ data }) {
  return <div className="tt">
    <h3 className="tt-h">{data.title}</h3>
    <dl>{data.rows.map(([d, t]) => <div key={d} className="tt-row"><dt>{d}</dt><dd>{t.map(x => /^À COMPLÉTER/.test(x) ? <Todo key={x}>{x}</Todo> : <span key={x} className={/\d/.test(x) ? 'tt-t' : 'tt-k'}>{x}</span>)}</dd></div>)}</dl>
  </div>;
}

// Premier jour où le cours a lieu (d'après XM_SCHEDULE), pour ouvrir le widget directement sur cette date (option fromDate)
const XM_SPG_DAYS = { crossfit: ['crossfit', 'teamwod'], hyrox: ['hyrox'], halterophilie: ['halterophilie', 'strongman'], pilates: ['pilates'], kids: ['kids', 'teens'] };
function xmNextClassDate(course) {
  const keys = XM_SPG_DAYS[course]; if (!keys) return null;
  const D = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  const slots = {};
  keys.forEach(k => (XM_SCHEDULE[k] || { rows: [] }).rows.forEach(([day, times]) => {
    const l = day.toLowerCase(), found = D.filter(d => l.includes(d)).map(d => D.indexOf(d));
    let days = found;
    if (found.length === 2 && /\s-\s/.test(l)) { days = []; for (let i = found[0]; i !== (found[1] + 1) % 7; i = (i + 1) % 7) days.push(i); }
    const mins = times.map(t => { const m = /^(\d{1,2})h(\d{2})?/.exec(t); return m ? +m[1] * 60 + +(m[2] || 0) : null; }).filter(v => v != null);
    days.forEach(d => { slots[d] = (slots[d] || []).concat(mins); });
  }));
  const now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < 8; i++) {
    const d = new Date(now); d.setDate(now.getDate() + i);
    const s = slots[d.getDay()]; if (!s || !s.length) continue;
    if (i === 0 && !s.some(m => m > nowMin)) continue;
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  return null;
}

// Cadre du widget Sportigo : un seul chargement de script par page
function SportigoFrame({ title = 'Réserve ton créneau', hint = 'Clique sur un créneau pour réserver.', course }) {
  const { Icon } = XM;
  const box = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const el = box.current; if (!el) return;
    const mo = new MutationObserver(() => { if (el.childElementCount) { setReady(true); mo.disconnect(); } });
    mo.observe(el, { childList: true, subtree: true });
    if (!window.__spgLoaded) {
      window.__spgLoaded = true;
      const s = document.createElement('script');
      s.src = 'https://standalone.api.sportigo.fr/component-standalone.js';
      s.onload = () => { try { window.initComponent('Appointment', 'sportigo-planning', 'b59ceb43-2ed3-4ac2-9f6d-ed5e9c9e9bcc', Object.assign({ colored: true, readonly: false }, XM_SPG[course] ? { activities: XM_SPG[course] } : {}, xmNextClassDate(course) ? { fromDate: xmNextClassDate(course) } : {})); } catch (e) {} };
      document.body.appendChild(s);
    }
    return () => mo.disconnect();
  }, []);
  return <div className="spg">
    <div className="spg-head"><h3 className="disp h3">{title}</h3><p className="spg-hint"><Icon name="mouse-pointer-click" size={18} color="var(--xm-orange-600)" />{hint}</p></div>
    <div className="spg-box">
      {!ready && <div className="spg-ph" aria-hidden="true"><span className="slot-tag">Planning Sportigo</span><span>Le planning et la réservation s'affichent ici.</span></div>}
      <div id="sportigo-planning" ref={box} />
    </div>
    <p className="spg-legal">Tes coordonnées servent uniquement à organiser ta séance. <a href="/politique-de-confidentialite/">Politique de confidentialité</a></p>
  </div>;
}

function ScheduleSection({ id = 'horaires', eyebrow = 'Horaires et réservation', title, lead, tables, hint, spgTitle, course }) {
  return <Sec id={id} alt labelledby={'t-' + id}>
    <SecHead eyebrow={eyebrow} id={'t-' + id} title={title} lead={lead} />
    <div className="sched-grid">
      <div className="sched-list">{tables.map(t => <SchedTable key={t.title} data={t} />)}</div>
      <SportigoFrame hint={hint} title={spgTitle} course={course} />
    </div>
  </Sec>;
}

// Grille tarifs adultes (composant unique)
function PriceGrid({ highlight, tag = 'Notre conseil' }) {
  const main = XM_PRICES.filter(p => p.main), alt = XM_PRICES.filter(p => !p.main);
  return <div className="prices">
    <div className="price-main">{main.map(p => <article key={p.id} className={'plan' + (p.id === highlight ? ' hl' : '')}>
      <div className="plan-top"><h3 className="plan-name">{p.name}</h3>{p.id === highlight && <span className="plan-tag">{tag}</span>}</div>
      <p className="plan-price">{p.price}<small>{p.per}</small></p>
      <p className="plan-desc">{p.desc}</p>
    </article>)}</div>
    <div className="price-alt">
      {alt.map(p => <article key={p.id} className={'plan-mini' + (p.id === highlight ? ' hl' : '')}><div><h3>{p.name}</h3><p>{p.desc}</p></div><strong>{p.price}</strong></article>)}
      <article className="plan-mini"><div><h3>Partenaires</h3><p>Entreprises, étudiants, police et pompiers</p></div><strong className="sm">Sur demande</strong></article>
    </div>
    <CheckList className="price-notes" items={['Lounge & recovery et Free Access inclus dans toutes les formules (sous conditions de bonne pratique et de sécurité)', 'Frais d\'inscription unique : 50 €', 'Ta mutuelle peut te rembourser jusqu\'à 50 € par an', 'Séance d\'essai gratuite et sans engagement']} />
    <div className="price-cta"><BtnLink href={XM_FACTS.buy} external variant="dark" icon="arrow-up-right">Je m'abonne</BtnLink><BtnLink href="/seance-essai/" variant="outline">D'abord une séance d'essai</BtnLink></div>
  </div>;
}

// Tableau « quel cours avec quelle formule » (pages cours). course = ligne mise en avant, highlight = colonne mise en avant
function AccessTable({ course, highlight }) {
  const { Icon } = XM;
  const cols = XM_ACCESS.groups.flatMap(g => g[1]);
  const cell = (v, col) => {
    if (v === true) return <><span className="cmp-yes" aria-hidden="true"></span><span className="sr">Inclus</span></>;
    if (v === false) return <><span className="cmp-no" aria-hidden="true"></span><span className="sr">Non inclus</span></>;
    if (Array.isArray(v)) return <span className="cmp-price">{v[0]}{v[1] && <small>{v[1]}</small>}</span>;
    if (typeof v === 'string' && v.startsWith('todo:')) return <Todo>{v.slice(5)}</Todo>;
    return <span className="cmp-txt">{v}</span>;
  };
  return <div className="cmp">
    <div className="cmp-head">
      <h3 className="disp h3" id="t-cmp">Quel cours avec <span className="acc">quelle formule ?</span></h3>
      <p>Coche ce que tu veux faire dans la semaine, et regarde quelle formule le couvre.</p>
    </div>
    <div className="cmp-wrap" role="region" aria-labelledby="t-cmp" tabIndex={0}>
      <table className="cmp-t">
        <thead>
          <tr className="cmp-groups"><td></td>{XM_ACCESS.groups.map(([g, c]) => <th key={g} scope="colgroup" colSpan={c.length}>{g}</th>)}</tr>
          <tr className="cmp-cols"><td></td>{cols.map(c => <th key={c} scope="col" className={c === highlight ? 'hl' : undefined}>{XM_ACCESS.cols[c]}</th>)}</tr>
        </thead>
        <tbody>{XM_ACCESS.rows.map(r => <tr key={r.k} className={(r.k === course ? 'cur ' : '') + (r.price ? 'cmp-pricerow' : '')}>
          <th scope="row">{r.label}{r.k === course && <span className="cmp-here">Ce cours</span>}</th>
          {cols.map(c => <td key={c} className={c === highlight ? 'hl' : undefined}>{cell(r.v[c], c)}</td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <p className="cmp-foot">Kids & Teens a sa propre grille de tarifs, sur la page <a href="/kids-teens/">Kids & Teens</a>. La carte 10 séances Pilates est disponible sur commande : <a href={'mailto:' + XM_FACTS.email}>contacte-nous</a>.</p>
  </div>;
}

function PricesSection({ highlight, tag, course, title = <>Les <span className="acc">tarifs</span></>, lead = 'Une seule grille pour tous les cours adultes. Tu choisis selon le nombre de séances par semaine.' }) {
  return <Sec id="tarifs" labelledby="t-tarifs">
    <SecHead eyebrow="Tarifs" id="t-tarifs" title={title} lead={lead} />
    <PriceGrid highlight={highlight} tag={tag} />
    {course && <AccessTable course={course} highlight={highlight} />}
  </Sec>;
}

// Carte coach + grille (alimentées par XM_COACHES)
function CoachCard({ c }) {
  return <li className="ccard">
    <CoachPic c={c} />
    <div className="ccard-txt">
      <h3 className="coach-name">{c.name}</h3>
      <span className="coach-role">{c.role}</span>
      <ul className="ccard-tags">{c.tags.map(t => <li key={t}>{t}</li>)}{c.cert && <li className="cert">{c.cert}</li>}</ul>
    </div>
  </li>;
}

function CoachSection({ course, id = 'coachs', eyebrow = 'Les coachs', title, lead, alt }) {
  const list = course ? XM_COACHES.filter(c => c.courses.includes(course)) : XM_COACHES;
  return <Sec id={id} alt={alt} labelledby={'t-' + id}>
    <SecHead eyebrow={eyebrow} id={'t-' + id} title={title} lead={lead} />
    {list.length
      ? <ul className="cgrid">{list.map(c => <CoachCard key={c.name} c={c} />)}</ul>
      : <p><Todo>À COMPLÉTER : quels coachs encadrent ce cours (ajouter « {course} » à leurs cours dans la liste des coachs)</Todo></p>}
  </Sec>;
}

// Déroulé d'une séance
function SessionFlow({ steps, start = '0 min', end = '60 min' }) {
  return <div className="flow">
    {start && <div className="flow-bar"><span>{start}</span><span>{end}</span></div>}
    <ol className="flow-steps" style={{ '--n': steps.length }}>{steps.map(([t, d], i) => <li key={t} className="flow-step"><span className="mark" aria-hidden="true"></span><h3 className="disp">{t}</h3><p>{d}</p></li>)}</ol>
  </div>;
}

// Ce que tu vas travailler (photos)
function WorkGrid({ items }) {
  return <ul className="work">{items.map(it => <li key={it.t} className="work-it">
    <Slot id={'work-' + (it.id || xmSlug(it.t))} src={it.src}>{it.slot || it.alt}</Slot>
    <h3 className="disp">{it.t}</h3>
    <p>{it.d}</p>
  </li>)}</ul>;
}

function CtaBand({ title, text, href = '/seance-essai/', label = 'Réserve ta séance d\'essai' }) {
  return <section className="sec-tight" aria-label="Séance d'essai">
    <div className="wrap">
      <div className="ctaband">
        <h2 className="disp h2">{title}</h2>
        <div className="ctaband-r">
          <p>{text}</p>
          <div className="ctaband-a"><BtnLink href={href} variant="dark" size="lg" icon="arrow-up-right">{label}</BtnLink><GoogleBadge /></div>
        </div>
      </div>
    </div>
  </section>;
}

function OtherCourses({ current }) {
  return <Sec labelledby="t-others">
    <div className="others-head"><h2 className="disp h2" id="t-others">Nos autres <span className="acc">cours</span></h2></div>
    <ul className="others">{XM_COURSES.filter(c => c.key !== current).map(c => <li key={c.key}><a className="ocard" href={c.href}>
      <Photo id={'autres-' + c.key} src={c.img[0]} alt={c.img[1]} pos={c.img[2]} />
      <span className="ocard-row"><span><span className="ocard-t">{c.name}</span><span className="ocard-d">{c.desc}</span></span><Disc /></span>
    </a></li>)}</ul>
  </Sec>;
}

function FaqSection({ title, lead = 'Une question qui n\'est pas dans la liste ? Écris-nous ou appelle, on répond nous-mêmes.', items, flush }) {
  const { Icon } = XM;
  return <Sec id="faq" flush={flush} labelledby="t-faq">
    <div className="faq">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <span className="eyebrow" style={{ margin: 0 }}>Questions fréquentes</span>
        <h2 className="disp h2" id="t-faq">{title}</h2>
        <p className="lead">{lead}</p>
        <div className="faq-contact">
          <a href={XM_FACTS.phoneHref}><Icon name="phone" size={18} color="var(--xm-orange-600)" />{XM_FACTS.phone}</a>
          <a href={'mailto:' + XM_FACTS.email}><Icon name="mail" size={18} color="var(--xm-orange-600)" />{XM_FACTS.email}</a>
        </div>
      </div>
      <Faq items={items} />
    </div>
  </Sec>;
}

Object.assign(window, { mountPage, Sec, CheckList, SchedTable, SportigoFrame, ScheduleSection, PriceGrid, PricesSection, CoachCard, CoachSection, SessionFlow, WorkGrid, CtaBand, OtherCourses, FaqSection });
