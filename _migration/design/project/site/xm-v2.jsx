// Blocs des pages hors accueil (v2) : plaques 3D, bande verte, coachs du cours, autres cours, liens locaux.
const XM_HX_STATIONS = ['SkiErg', 'Sled Push', 'Sled Pull', 'Burpee Broad Jumps', 'Rameur', 'Farmers Carry', 'Sandbag Lunges', 'Wall Balls'];
const xmDocTop = el => { let t = 0; while (el) { t += el.offsetTop; el = el.offsetParent; } return t; };

// Cartes côte à côte (pas de chevauchement). L'apparition 3D est gérée par xm-motion.js.
function Stack3D({ items, compact, tones = ['g', 'o', 'c'] }) {
  const cols = items.length === 4 ? 2 : Math.min(items.length, 3);
  return <div className={'s3' + (compact ? ' compact' : '')} style={{ '--cols': cols }}>
    {items.map((it, i) => <article key={i} className={'s3-card ' + (it.tone || tones[i % tones.length])}>
      <div className="s3-top"><span className="mark" aria-hidden="true"></span>{it.label && <span className="s3-label">{it.label}</span>}</div>
      <h3 className="disp s3-t">{it.t}</h3>
      {it.d && <p>{it.d}</p>}
      {it.extra}
    </article>)}
  </div>;
}

// Section « Pour qui » : titre à gauche, profils en liste à droite (sans cartes)
function StackSection({ id, eyebrow, title, lead, checks, items, alt, after, aside }) {
  const tid = 't-' + (id || 'who');
  if (aside) return <Sec id={id} alt={alt} labelledby={tid}>
    <div className="pq pq-aside">
      <div className="pq-head">
        <span className="eyebrow" style={{ margin: 0 }}>{eyebrow}</span>
        <h2 className="disp h2" id={tid}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
        <ul className="pq-list">{items.map((it, i) => <li key={i} className="pq-it">
          {it.label && <span className="pq-label">{it.label}</span>}
          <h3 className="disp pq-t">{it.t}</h3>
          {it.d && <p>{it.d}</p>}
        </li>)}</ul>
        {after && <div className="pq-after">{after}</div>}
      </div>
      {aside}
    </div>
  </Sec>;
  return <Sec id={id} alt={alt} labelledby={tid}>
    <div className="pq">
      <div className="pq-head">
        <span className="eyebrow" style={{ margin: 0 }}>{eyebrow}</span>
        <h2 className="disp h2" id={tid}>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
        {checks && <CheckList items={checks} />}
        {after && <div className="pq-after">{after}</div>}
      </div>
      <ul className="pq-list">{items.map((it, i) => <li key={i} className="pq-it">
        {it.label && <span className="pq-label">{it.label}</span>}
        <h3 className="disp pq-t">{it.t}</h3>
        {it.d && <p>{it.d}</p>}
        {it.extra}
      </li>)}</ul>
    </div>
  </Sec>;
}

// Déroulé immersif : grand cadre photo (remplaçable en mode edit : glisser une image sur la zone libre de la photo),
// qui apparaît en fondu puis dérive lentement, voile vert pour la lecture, étapes par-dessus.
function PinTrack({ id, eyebrow, title, lead, items, note, bg = {} }) {
  const tid = 't-' + id, ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!('IntersectionObserver' in window)) { el.dataset.in = 'true'; return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { el.dataset.in = 'true'; io.disconnect(); } }), { rootMargin: '0px 0px -18% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <section className="sec dr-sec" id={id} aria-labelledby={tid}>
    <div className="wrap">
      <div className="dr on-dark" ref={ref} data-in="false">
        <div className="dr-bg"><image-slot id={'ph-' + (bg.id || id)} shape="rect" src={bg.src} placeholder={bg.alt || 'Photo de fond : une séance à la box'}></image-slot></div>
        <div className="dr-fade" aria-hidden="true"></div>
        <div className="dr-in">
          <div className="dr-head"><span className="eyebrow">{eyebrow}</span><h2 className="disp dr-h" id={tid}>{title}</h2>{lead && <p className="lead">{lead}</p>}</div>
          <ol className="dr-steps" style={{ '--n': items.length }}>
            {items.map((it, i) => <li key={i} className={'dr-step' + (it.hot ? ' hot' : '')} style={{ '--k': i }}>
              <h3 className="disp dr-t">{it.t}</h3>
              {it.d && <p>{it.d}</p>}
            </li>)}
          </ol>
          {note && <p className="dr-note">{note}</p>}
        </div>
      </div>
    </div>
  </section>;
}

// Hyrox : comment le cours prépare (programmation officielle + séances des coachs)
function HyroxPrep({ alt, h = <>Des cours <span className="acc">dédiés à l'Hyrox</span></>, lead = "Deux types de séances dans la semaine, pour progresser jusqu'au jour de ta course.", off = "Xmile est affiliée Hyrox Training Club : une partie des cours suit les séances programmées par Hyrox, sur les stations et les formats de la course.", own = "Construites par les coachs pour améliorer ta condition physique et ton temps : force, endurance, allure de course et transitions." }) {
  const row = hidden => <ul className="hxp-row" aria-hidden={hidden || undefined}>{XM_HX_STATIONS.map(s => <li key={s}><span className="hxp-x" aria-hidden="true"></span>{s}</li>)}</ul>;
  return <Sec id="preparation" alt={alt} labelledby="t-prep">
    <div className="hxp">
      <Photo id="hyrox-prep" src="assets/hyrox-prep.jpg" alt="Une membre en sweat vert rame à l'ergomètre pendant une séance Hyrox" />
      <div className="hxp-copy">
        <span className="eyebrow" style={{ margin: 0 }}>Comment on te prépare</span>
        <h2 className="disp h2" id="t-prep">{h}</h2>
        <p className="lead">{lead}</p>
        <ol className="tips hxp-tips">
          <li><h3>La programmation officielle Hyrox</h3><p>{off}</p></li>
          <li><h3>Les séances de nos coachs</h3><p>{own}</p></li>
        </ol>
      </div>
    </div>
    <div className="hxp-band">
      <span className="hxp-band-l">Les 8 stations, travaillées en cours</span>
      <div className="hxp-mq"><div className="hxp-track">{row()}{row(true)}</div></div>
    </div>
  </Sec>;
}

// Coachs d'un cours, en rail comme sur l'accueil
function CourseCoaches({ course, eyebrow = 'Les coachs', title, lead, alt, id = 'coachs', all }) {
  const { IconButton } = XM;
  const rail = React.useRef(null);
  const by = d => rail.current && rail.current.scrollBy({ left: d * 494, behavior: 'smooth' });
  const list = all ? XM_COACHES : XM_COACHES.filter(c => c.courses.includes(course));
  return <section className="sec" id={id} aria-labelledby={'t-' + id} style={alt ? { background: 'var(--bg-alt)' } : undefined}>
    <div className="wrap">
      <div className="sec-head">
        <div><span className="eyebrow">{eyebrow}</span><h2 className="disp h2" id={'t-' + id}>{title}</h2></div>
        <div className="sec-head-r">
          {lead && <p className="lead">{lead}</p>}
          {list.length > 3 && <div className="rail-ctrl"><IconButton icon="chevron-left" variant="outline" size={40} label="Coachs précédents" onClick={() => by(-1)} /><IconButton icon="chevron-right" variant="outline" size={40} label="Coachs suivants" onClick={() => by(1)} /></div>}
        </div>
      </div>
      {list.length
        ? <ul className="coach-rail" ref={rail}>{list.map(c => <li key={c.name} className="coach">
          <CoachPic c={c} />
          <h3 className="coach-name">{c.name}</h3>
          <span className="coach-role">{c.role}</span>
          <ul className="ccard-tags">{c.tags.map(t => <li key={t}>{t}</li>)}{c.cert && <li className="cert">{c.cert}</li>}</ul>
        </li>)}</ul>
        : <p><Todo>À COMPLÉTER : quels coachs encadrent ce cours (ajouter « {course} » à leurs cours dans la liste des coachs)</Todo></p>}
    </div>
  </section>;
}

// Nos autres cours : cartes vertes et orange, comme les plaques de l'accueil
function NextCourses({ current, title = <>Nos autres <span className="acc">cours</span></>, alt }) {
  const list = XM_COURSES.filter(c => c.key !== current);
  return <Sec alt={alt} labelledby="t-others">
    <SecHead eyebrow="Une box, plusieurs façons de s'y mettre" id="t-others" title={title} lead="Le même abonnement adulte pour tous les cours, sauf Kids & Teens qui a sa propre grille." />
    <ul className="nx">{list.map((c, i) => <li key={c.key} style={{ display: 'flex' }}><a className={'nx-card ' + (i % 2 ? 'o' : 'g')} href={c.href} style={{ flex: 1 }} onClick={xmSlotGuard} onDragStart={xmSlotGuard}>
      <div className="nx-media"><Photo id={'autres-' + c.key} src={c.img[0]} alt={c.img[1]} /><h3 className="nx-name">{c.name}</h3></div>
      <span className="nx-body"><span className="nx-desc">{c.desc}</span><span className="nx-go">Découvrir<Disc /></span></span>
    </a></li>)}</ul>
  </Sec>;
}

// Liens vers les pages locales
function LocalLinks({ items, eyebrow, title, lead, alt }) {
  const { Icon } = XM;
  return <Sec alt={alt} labelledby="t-local">
    <SecHead eyebrow={eyebrow} id="t-local" title={title} lead={lead} />
    <ul className="lpills">{items.map(([h, l]) => <li key={h} className="lpill"><a href={h}>{l}<Icon name="arrow-up-right" size={16} /></a></li>)}</ul>
  </Sec>;
}

Object.assign(window, { XM_HX_STATIONS, Stack3D, StackSection, PinTrack, HyroxPrep, CourseCoaches, NextCourses, LocalLinks });
