function Doors() {
  const { Icon } = XM;
  const doors = [
    ['Je débute', 'Tu as une idée du CrossFit ou de l\'Hyrox, sans plus ? Ton premier cours est encadré, chaque mouvement a sa version simplifiée et les charges s\'adaptent à toi.', '/seance-essai/', 'Ta séance d\'essai'],
    ['Je fais déjà du CrossFit', 'Tu changes de box ? Jusqu\'à six créneaux par jour du lundi au vendredi, du matériel Rogue, le Team WOD du samedi et le Free Access pour tes extras.', '/crossfit/', 'Le cours CrossFit'],
    ['Je prépare un Hyrox', 'Tu veux préparer ta première course Hyrox ou juste être en meilleure forme ? Débutant ou sportif accompli, tu trouveras un challenge à ta taille.', '/preparation-hyrox/', 'La préparation Hyrox'],
    ['Pour mon enfant', 'Kids de 6 à 10 ans, Teens de 11 à 16 ans. Le même créneau chaque semaine, avec le même coach.', '/kids-teens/', 'Kids & Teens'],
  ];
  return <section className="sec" aria-labelledby="t-doors" id="commencer">
    <div className="wrap doors">
      <div className="doors-intro">
        <span className="eyebrow" style={{ margin: 0 }}>Par où commencer ?</span>
        <h2 className="disp h2" id="t-doors">Dis-nous d'où tu pars, <span className="acc">on s'occupe</span> du reste</h2>
        <p className="lead">Pas besoin d'être en forme pour venir. C'est en venant qu'on se met en forme.</p>
        <ul className="reass">
          <li><Icon name="check" size={18} color="var(--xm-orange-600)" />Charges et mouvements adaptés à ton niveau</li>
          <li><Icon name="check" size={18} color="var(--xm-orange-600)" />Un coach qui t'accompagne à chaque séance</li>
          <li><Icon name="check" size={18} color="var(--xm-orange-600)" />Séance d'essai gratuite, sans engagement</li>
        </ul>
      </div>
      <ul className="doors-list">
        {doors.map(([t, d, h, to], i) => <li key={h}><a className="door" href={h}>
          <span className="door-n" aria-hidden="true"></span>
          <span className="door-t">{t}</span>
          <Disc />
          <p>{d}</p>
          <span className="door-to">{to}<Icon name="arrow-right" size={16} /></span>
        </a></li>)}
      </ul>
    </div>
  </section>;
}

function Together() {
  return <section className="sec" aria-labelledby="t-together" style={{ paddingTop: 0 }}>
    <div className="wrap pulse">
      <div className="pulse-quote">
        <span className="eyebrow">S'entraîner ensemble</span>
        <h2 className="disp" id="t-together">Le dernier à finir le WOD n'est jamais seul.</h2>
        <p>Toute la salle reste autour de lui et compte ses reps jusqu'à la dernière.</p>
      </div>
      <Photo id="home-duo-1" src="assets/duo-high-five.jpg" pos="50% 42%" alt="Deux membres de Xmile se tapent dans la main en souriant après un WOD, le long du mur de la box" />
      <Photo id="home-duo-2" src="assets/duo-medecine-ball.png" pos="60% 40%" alt="Deux membres rient pendant un exercice d'abdominaux avec un médecine-ball" />
    </div>
  </section>;
}

// Apparition au scroll : .rv (texte) et .rv-ph (photo qui se resserre)
function useReveal(ref) {
  React.useEffect(() => {
    const root = ref.current; if (!root) return;
    const els = root.querySelectorAll('.rv, .rv-ph');
    if (!('IntersectionObserver' in window)) return;
    root.classList.add('fx');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.dataset.in = 'true'; io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);
}

// Plaques empilées : --in (entrée de la plaque), --cov (recouverte par la suivante)
function useStack(ref) {
  React.useEffect(() => {
    const root = ref.current; if (!root) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = [...root.querySelectorAll('.stk-card')];
    let tops = [], raf = 0;
    const clamp = v => Math.min(1, Math.max(0, v));
    const measure = () => { tops = cards.map(c => parseFloat(getComputedStyle(c).top) || 0); };
    const upd = () => {
      raf = 0; const vh = innerHeight;
      const rs = cards.map(c => c.getBoundingClientRect().top);
      cards.forEach((c, i) => {
        c.style.setProperty('--in', clamp((vh - rs[i]) / Math.max(1, vh - tops[i])).toFixed(3));
        c.style.setProperty('--cov', i < cards.length - 1 ? clamp((vh - rs[i + 1]) / Math.max(1, vh - tops[i + 1])).toFixed(3) : '0');
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    const rz = () => { measure(); on(); };
    measure(); upd();
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', rz);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', rz); cancelAnimationFrame(raf); };
  }, []);
}

function Disciplines() {
  const ref = React.useRef(null);
  useStack(ref);
  const tiles = [
    { n: 'CrossFit', h: '/crossfit/', tone: 'g', sub: 'Box affiliée CrossFit · Plan d\'entraînement officiel', d: 'Que tu débutes ou que tu sois expert, tu trouveras le challenge que tu cherches.', img: ['assets/depassement-de-soi.jpg', 'Un membre saute par-dessus une partenaire qui fait un burpee pendant un WOD en duo', '50% 30%'] },
    { n: 'Hyrox', h: '/preparation-hyrox/', tone: 'o', sub: 'Partenaire officiel Hyrox Training Club', d: 'Tu viens t\'entraîner pour ton premier Hyrox ou pour performer sur les suivants.', img: ['assets/endurance.jpg', 'Une membre en sweat vert rame à l\'ergomètre pendant une séance Hyrox', '50% 30%'] },
    { n: 'Haltérophilie', h: '/halterophilie/', tone: 'g', meta: 'Lun, mer, ven 17h30 · sam 10h', d: 'Des cours pour perfectionner ta technique et, pourquoi pas, te lancer en compétition.', img: ['assets/halterophilie.jpg', 'Un membre en t-shirt Xmile prépare un soulevé de terre, observé par d\'autres membres', '50% 40%'] },
    { n: 'Pilates', h: '/pilates/', tone: 'o', meta: 'Mar et jeu · avec Coach Fe', d: 'Gainage, posture, mobilité et respiration.', img: [undefined, 'Photo à faire : un cours de Pilates à la box avec Coach Fe', ''] },
    { n: 'Kids & Teens', h: '/kids-teens/', tone: 'g', meta: '6-10 ans · 11-16 ans · mer et sam', d: 'Qui a dit que le CrossFit ne pouvait pas s\'apprendre tôt ? Encadrés par des pros du début à la fin, ils retrouvent leurs copains et copines chaque semaine.', img: ['assets/kids.jpg', 'Un coach Xmile accroupi donne une consigne à deux enfants, cadrés sans leur visage', '50% 100%'] },
  ];
  return <section className="sec" id="cours" aria-labelledby="t-disc" style={{ background: 'var(--bg-alt)' }}>
    <div className="wrap">
      <SecHead eyebrow="Nos cours" id="t-disc" title={<>Une box, <span className="acc">cinq</span> façons de s'y mettre</>} lead="Chaque cours est encadré par un coach et se fait en groupe. Tu choisis ta discipline, le niveau s'adapte à toi." />
      <div className="stk" ref={ref}>
        {tiles.map((t, i) => <div key={t.h} className={'stk-card ' + t.tone} style={{ '--i': i }}>
          <a className="stk-copy" href={t.h}>
            {t.sub && <div className="stk-top"><span className="mark" aria-hidden="true"></span><span className="stk-meta">{t.sub}</span></div>}
            <h3 className="disp stk-name" style={{ '--len': 13 }}>{t.n}</h3>
            <div className="stk-foot"><p>{t.d}</p><span className="stk-cta"><span className="stk-tag">Essai gratuit</span>Découvrir le cours<XM.Icon name="chevron-right" size={18} /></span></div>
          </a>
          <div className="stk-ph" onClick={e => { const sl = e.currentTarget.querySelector('image-slot'); if (sl && (sl.hasAttribute('data-editable') || sl.hasAttribute('data-reframe'))) return; if (e.composedPath().some(n => n.getAttribute && (n.getAttribute('data-act') || n.tagName === 'INPUT'))) return; e.currentTarget.previousElementSibling.click(); }}><image-slot id={'ph-cours-' + xmSlug(t.n)} shape="rect" src={t.img[0]} placeholder={t.img[1]}></image-slot></div>
        </div>)}
      </div>
    </div>
  </section>;
}

function CoachStrip() {
  const { IconButton } = XM;
  const rail = React.useRef(null);
  const by = d => rail.current && rail.current.scrollBy({ left: d * 384, behavior: 'smooth' });
  return <section className="sec" aria-labelledby="t-coach">
    <div className="wrap">
      <div className="sec-head">
        <div><span className="eyebrow">L'équipe</span><h2 className="disp h2" id="t-coach">Les coachs qui vont <span className="acc">te suivre</span></h2></div>
        <div className="sec-head-r">
          <p className="lead">Ils corrigent ta technique, adaptent tes charges et savent où tu en es. Tu les rencontres dès ta séance d'essai.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <TLink href="/notre-vision/#equipe">Découvrir toute l'équipe</TLink>
            <div className="rail-ctrl"><IconButton icon="chevron-left" variant="outline" size={40} label="Coachs précédents" onClick={() => by(-1)} /><IconButton icon="chevron-right" variant="outline" size={40} label="Coachs suivants" onClick={() => by(1)} /></div>
          </div>
        </div>
      </div>
      <ul className="coach-rail" ref={rail}>
        {XM_COACHES.map(c => <li key={c.name} className="coach">
          <CoachPic c={c} />
          <h3 className="coach-name">{c.name}</h3>
          <span className="coach-role">{c.role}</span>
          {c.courses.length > 0 && <span className="coach-courses">{c.courses.map(k => XM_COURSE_NAMES[k]).join(' · ')}</span>}
        </li>)}
      </ul>
    </div>
  </section>;
}

function FirstSession() {
  const steps = ['Tu réserves un créneau', 'Un coach t\'accueille', 'Tu fais le WOD avec le groupe'];
  return <section className="sec" aria-labelledby="t-steps" style={{ paddingTop: 0 }}>
    <div className="wrap">
      <div className="slab first on-dark">
        <div className="first-head">
          <span className="eyebrow">Ta première séance</span>
          <h2 className="disp h2" id="t-steps">Trois étapes, <span className="acc">c'est tout</span></h2>
        </div>
        <ol className="steps">
          {steps.map((t, i) => <li key={t} className="step"><span className="step-n" aria-hidden="true"></span><h3 className="disp">{t}</h3></li>)}
        </ol>
        <div className="first-cta"><BtnLink href="/seance-essai/" size="lg" icon="arrow-up-right">Réserve ta séance d'essai</BtnLink></div>
      </div>
    </div>
  </section>;
}

Object.assign(window, { useReveal, useStack, Doors, Together, Disciplines, CoachStrip, FirstSession });
