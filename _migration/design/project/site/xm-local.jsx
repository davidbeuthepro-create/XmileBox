// Pages locales CrossFit et Hyrox : copie complète de la page du cours, chaque texte écrit pour sa page (pas de contenu dupliqué).
// Données : xm-local-cf*.jsx et xm-local-hx*.jsx (window.XM_LP). URL réelles : /crossfit/<commune>/, /hyrox/<commune>/, /crossfit/debutant/, /hyrox/debutant/, /hyrox/duo/.
const xlH = h => Array.isArray(h) ? <>{h[0]} <span className="acc">{h[1]}</span>{h[2] ? ' ' + h[2] : ''}</> : h;
const xlP = a => Array.isArray(a) ? <>{a.map((t, i) => <p key={i}>{t}</p>)}</> : <p>{a}</p>;
const XL_CF_STEPS = ['Échauffement', 'Technique', 'WOD', 'Post WOD'];
const XL_HX_STEPS = ['Échauffement', 'Technique', 'Bloc principal', 'Retour au calme'];
const XL_WORK = [
  { t: 'Gymnastique', src: 'assets/gymnastique.jpg', alt: 'Une membre sourit, suspendue aux anneaux de gymnastique', pos: '50% 35%' },
  { t: 'Force', src: 'assets/halterophilie.jpg', alt: 'Un membre en t-shirt Xmile se prépare à soulever une barre chargée', pos: '45% 45%' },
  { t: 'Cardio', src: 'assets/endurance.jpg', alt: 'Une membre en sweat vert rame à l\'ergomètre', pos: '50% 30%' },
  { t: 'Mobilité', src: 'assets/mobilite-2.jpg', alt: 'Deux membres font un exercice de mobilité au sol, bras tendu vers le plafond', pos: '50% 40%' },
];

// USP du hero : les mêmes que sur la page du cours (CrossFit.html / Hyrox.html)
const XL_FACTS = {
  crossfit: [['1 h', 'encadrée par un coach'], ['Lun au ven', 'jusqu\'à 6 cours par jour'], ['Samedi', 'Team WOD par équipes']],
  hyrox: [['Training Club', 'salle affiliée Hyrox'], ['Tous niveaux', 'débutant ou confirmé'], ['6 jours sur 7', 'le midi, le soir et le dimanche']],
};

function LocalHero({ l }) {
  const { Icon } = XM;
  const isH = l.course === 'hyrox';
  const vref = React.useRef(null);
  React.useEffect(() => { const e = vref.current; if (e) { e.muted = true; const p = e.play(); if (p && p.catch) p.catch(() => {}); } }, []);
  return <section className="hero" aria-labelledby="h1">
    <div className="hero-slab on-dark" id="hero-slab" data-vs-host="" data-m="hero">
      <div className="hero-bg"><video ref={vref} data-vslot={isH ? 'hero-local-hyrox' : 'hero-local'} src={isH ? 'assets/video-hyrox.mp4' : 'assets/video-ambiance.mp4'} poster="assets/crossfit-tous-ensemble.png" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" /></div>
      <div className="hero-top"><nav className="crumbs" aria-label="Fil d'Ariane"><ol><li><a href="/">Accueil</a></li><li><a href={isH ? '/preparation-hyrox/' : '/crossfit/'}>{isH ? 'Hyrox' : 'CrossFit'}</a></li><li aria-current="page">{l.crumb}</li></ol></nav></div>
      <div className="hero-main">
        <h1 className="disp hero-h1 vh" id="h1">{xlH(l.h1)}</h1>
        <p className="hero-sub">{l.sub}</p>
        <div className="hero-bar">
          <a className="btn btn-primary btn-lg" href="/seance-essai/">Réserve ta séance d'essai<Icon name="arrow-up-right" size={20} /></a>
          <a className="tlink" href="#horaires">Voir les horaires<Icon name="arrow-down" size={16} /></a>
          <ul className="vh-facts">{XL_FACTS[l.course].map(([a, b]) => <li key={a}><strong>{a}</strong><span>{b}</span></li>)}</ul>
        </div>
      </div>
    </div>
  </section>;
}

function LocalIntro({ l }) {
  const i = l.intro;
  return <Sec labelledby="t-intro">
    <div className="local-intro">
      <div className="lintro-copy">
        <span className="eyebrow" style={{ margin: 0 }}>{i.eb}</span>
        <h2 className="disp h2" id="t-intro">{xlH(i.h)}</h2>
        <p className="lead">{i.lead}</p>
        <p>{i.p}</p>
      </div>
      <article className="lacc on-dark" id="acces-commune">
        <span className="eyebrow" style={{ margin: 0 }}>{l.commune ? 'Venir depuis ' + l.commune : 'Où on est'}</span>
        <h3 className="disp">{XM_FACTS.street}</h3>
        <p>{XM_FACTS.city} ({XM_FACTS.streetNl})</p>
        <div className="actions"><BtnLink href={XM_FACTS.googleFiche} external variant="light" icon="arrow-up-right">Itinéraire Google Maps</BtnLink></div>
      </article>
    </div>
  </Sec>;
}

function LocalEnd({ l }) {
  return <>
    <CourseCoaches course={l.course} alt title={xlH(l.coach.h)} lead={l.coach.lead} />
    <ScheduleSection course={l.course} title={xlH(l.sched.h)} lead={l.sched.lead} tables={l.course === 'hyrox' ? [XM_SCHEDULE.hyrox] : [XM_SCHEDULE.crossfit, XM_SCHEDULE.teamwod]} />
    <PricesSection course={l.course} highlight={l.price.hl || 'unlimited'} tag={l.course === 'crossfit' ? 'Notre conseil' : undefined} lead={l.price.lead} />
    <Reviews flush />
    <FaqSection title={xlH(l.faq.h)} items={l.faq.items.map(([q, a]) => ({ q, a: xlP(a) }))} />
    <NextCourses current={l.course} />
    <FinalCta title={l.cta[0]} text={l.cta[1]} />
  </>;
}

function LocalCrossFit({ l }) {
  const s = l.side;
  return <>
    <StackSection eyebrow="Pour qui ?" title={xlH(l.who.h)} items={l.who.items.map(([t, d]) => ({ t, d }))} after={l.slug !== 'crossfit-debutant' && <TLink href="/crossfit/debutant/">Le CrossFit pour débutants</TLink>} />
    <PinTrack bg={{ id: 'deroule-crossfit', src: 'assets/depassement-de-soi.jpg', alt: 'Photo de fond : un WOD en cours à la box' }} id="deroule" eyebrow="Déroulé d'une séance" title={xlH(l.flow.h)} lead={l.flow.lead} items={XL_CF_STEPS.map((t, i) => ({ t, d: l.flow.d[i], hot: i === 2 }))} />
    <Sec labelledby="t-work">
      <SecHead eyebrow="Ce que tu vas travailler" id="t-work" title={xlH(l.work.h)} lead={l.work.lead} />
      <WorkGrid items={XL_WORK.map((w, i) => Object.assign({}, w, { d: l.work.d[i] }))} />
    </Sec>
    <LocalIntro l={l} />
    <Sec labelledby="t-side">
      <SecHead eyebrow="À côté des cours" id="t-side" title={xlH(s.h)} />
      <div className="side">
        <article className="side-team">
          <Photo id="crossfit-photo-01" src="assets/crossfit-tous-ensemble.png" alt="Un groupe de membres, mains au sol, s'encourage en riant pendant un exercice collectif" />
          <div className="side-team-copy">
            <span className="eyebrow" style={{ margin: 0 }}>Le samedi</span>
            <h3 className="disp side-t">Le Team WOD</h3>
            <p>{s.team}</p>
            <div className="when"><span>9h</span><span>10h</span><span>11h</span></div>
          </div>
        </article>
        <article className="side-card"><span className="eyebrow" style={{ margin: 0 }}>Free Access</span><h3 className="disp side-t">Ton créneau en plus</h3><p>{s.free}</p></article>
        <article className="side-card dark on-dark"><span className="eyebrow" style={{ margin: 0 }}>Le lounge</span><h3 className="disp side-t">On reste après la séance</h3><p>{s.lounge}</p></article>
        <article className="side-card orange"><span className="eyebrow" style={{ margin: 0 }}>Xmile Health Lab</span><h3 className="disp side-t">Le bien-être du sportif</h3><p>{s.lab}</p>
          <div className="actions"><BtnLink href={XM_FACTS.healthLab} external variant="dark" icon="arrow-up-right">Découvrir le Health Lab</BtnLink></div></article>
      </div>
    </Sec>
  </>;
}

function LocalHyrox({ l }) {
  const p = l.prep, x = l.ex;
  return <>
    <StackSection eyebrow="Pour qui ?" title={xlH(l.who.h)} items={l.who.items.map(([t, d]) => ({ t, d }))} after={l.slug !== 'hyrox-debutant' && <TLink href="/hyrox/debutant/">L'Hyrox pour débutants</TLink>} aside={<Photo id="hyrox-sourire" src="assets/hyrox-sourire.jpg" alt="Une membre saute de joie devant le logo Xmile, les air bikes alignés derrière elle" />} />
    <HyroxPrep h={xlH(p.h)} lead={p.lead} off={p.off} own={p.own} />
    <PinTrack bg={{ id: 'deroule-hyrox', src: 'assets/hyrox-wallball.jpg', alt: 'Photo de fond : une membre aux wall balls pendant le cours Hyrox' }} id="deroule" eyebrow="Déroulé d'un cours" title={xlH(x.h)} items={XL_HX_STEPS.map((t, i) => ({ t, d: x.d[i], hot: i === 2 }))} />
    <LocalIntro l={l} />
    <Sec labelledby="t-duo">
      <div className="duo3">
        <div className="duo3-head">
          <span className="eyebrow" style={{ margin: 0 }}>En duo</span>
          <h2 className="disp h2" id="t-duo">{xlH(l.duo.h)}</h2>
        </div>
        <Slot id="deux-membres-en-duo-hyrox-l-un-pousse-le-sled-l-" src="assets/hyrox-duo.jpg">Deux membres se tapent dans la main pendant un passage en duo Hyrox</Slot>
        <div className="duo3-copy">
          {[].concat(l.duo.p).map((t, i) => <p key={i}>{t}</p>)}
          {l.slug !== 'hyrox-duo' && <TLink href="/hyrox/duo/">S'entraîner à deux pour l'Hyrox</TLink>}
        </div>
      </div>
    </Sec>
  </>;
}

function LocalPage({ l }) {
  React.useEffect(() => {
    document.title = l.title + ' · Xmile CrossFit';
    const m = document.querySelector('meta[name="description"]'); if (m) m.setAttribute('content', l.desc);
    let c = document.querySelector('link[rel="canonical"]'); if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
    c.setAttribute('href', l.url);
  }, [l.slug]);
  return <>
    <LocalHero l={l} />
    {l.course === 'hyrox' ? <LocalHyrox l={l} /> : <LocalCrossFit l={l} />}
    <LocalEnd l={l} />
  </>;
}

// Aperçu uniquement : passer d'une page locale à l'autre (en production, chaque URL a son propre fichier)
function LocalPreviewPicker({ cur }) {
  const all = window.XM_LP || [];
  return <label className="xm-preview">Aperçu<select value={cur} onChange={e => { location.search = '?p=' + e.target.value; }}>
    <optgroup label="CrossFit">{all.filter(l => l.course === 'crossfit').map(l => <option key={l.slug} value={l.slug}>{l.crumb}</option>)}</optgroup>
    <optgroup label="Hyrox">{all.filter(l => l.course === 'hyrox').map(l => <option key={l.slug} value={l.slug}>{l.crumb}</option>)}</optgroup>
  </select></label>;
}

Object.assign(window, { LocalPage, LocalPreviewPicker });
