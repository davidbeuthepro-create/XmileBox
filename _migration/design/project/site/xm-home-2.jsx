function BoxLife() {
  const sec = React.useRef(null), track = React.useRef(null), bar = React.useRef(null), cnt = React.useRef(null);
  const items = [
    { t: 'Les sorties', where: 'Hors de la box', d: 'Brunchs, repas : la séance se termine parfois à table, loin des barres. On parle un peu du WOD et beaucoup du reste.', media: <Slot id="home-brunch">Une grande tablée de membres Xmile au restaurant, assiettes pleines, tout le monde rit</Slot> },
    { t: 'Les événements', where: 'À la box', d: 'Chaque année, la box fête son anniversaire avec la compétition Xmile. Pendant les CrossFit Open, les épreuves se font ici, devant toute la box. Et entre les deux, des apéros dînatoires pour mieux connaître ceux avec qui tu t\'entraînes.', media: <Slot id="home-evenements" src="assets/groupe-membres.jpg">Un événement de la box, des membres réunis et souriants</Slot> },
    { t: 'Les compétitions', where: 'On y va ensemble', hot: true, d: 'Quand un membre s\'inscrit à une compétition, il n\'y va pas seul. Ceux de la box sont au bord du plateau et crient plus fort que lui.', media: <Slot id="home-competition">Des membres Xmile en bord de plateau qui encouragent un athlète de la box en compétition</Slot> },
  ];
  React.useEffect(() => {
    const s = sec.current, t = track.current; if (!s || !t) return;
    const pinEl = s.querySelector('.lx-pin'), n = items.length;
    const mq = matchMedia('(min-width: 961px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)');
    let raf = 0, dist = 0, top = 0, pin = false;
    const show = p => { bar.current.style.transform = 'scaleX(' + p.toFixed(3) + ')'; };
    const measure = () => {
      pin = mq.matches; s.dataset.pin = pin;
      t.style.transform = ''; s.style.height = '';
      if (!pin) return;
      top = parseFloat(getComputedStyle(pinEl).top) || 0;
      const last = t.lastElementChild;
      dist = Math.max(0, last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(t).paddingLeft) - t.clientWidth);
      s.style.height = (pinEl.offsetHeight + dist) + 'px';
    };
    const upd = () => {
      raf = 0;
      if (pin) { const p = dist ? Math.min(1, Math.max(0, (top - s.getBoundingClientRect().top) / dist)) : 0; t.style.transform = 'translate3d(' + (-p * dist).toFixed(1) + 'px,0,0)'; show(p); }
      else { const m = t.scrollWidth - t.clientWidth; show(m > 0 ? t.scrollLeft / m : 0); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    const rz = () => { measure(); on(); };
    measure(); upd();
    addEventListener('scroll', on, { passive: true }); t.addEventListener('scroll', on, { passive: true }); addEventListener('resize', rz);
    return () => { removeEventListener('scroll', on); t.removeEventListener('scroll', on); removeEventListener('resize', rz); cancelAnimationFrame(raf); };
  }, []);
  return <section className="lx on-dark" aria-labelledby="t-life" ref={sec}>
    <div className="lx-pin">
      <div className="wrap lx-head">
        <div><span className="eyebrow">La vie de la box</span><h2 className="disp" id="t-life">On ne fait pas <span className="acc">que</span> des WODs</h2></div>
        <p className="lead">Sorties, événements, compétitions : on se voit aussi quand la séance est finie.</p>
      </div>
      <div className="lx-track" ref={track}>
        {items.map((it, i) => <article key={it.t} className={'lx-card' + (it.hot ? ' hot' : '')}>
          <div className="lx-media">{it.media}</div>
          <div className="lx-body">
            <div className="lx-top"><span className="mark" aria-hidden="true"></span><span className="lx-where">{it.where}</span></div>
            <h3 className="disp">{it.t}</h3>
            <p>{it.d}</p>
            {it.todo && <p><Todo>{it.todo}</Todo></p>}
          </div>
        </article>)}
      </div>
      <div className="wrap lx-foot" aria-hidden="true">
        <span className="lx-bar"><span ref={bar}></span></span>
      </div>
    </div>
  </section>;
}

function LabAndCompanies() {
  return <section className="sec" aria-label="Xmile Health Lab et entreprises">
    <div className="wrap duo">
      <article className="duo-card light">
        <span className="eyebrow" style={{ margin: 0 }}>Xmile Health Lab</span>
        <h2 className="disp h2" style={{ fontSize: 'clamp(38px,3.6vw,52px)' }}>Ton kiné est <span className="acc">juste à côté</span> de ta box</h2>
        <p>Kiné, soins sportifs et récupération, à la même adresse. Une gêne à l'épaule le mardi, un rendez-vous le mercredi, et ton coach adapte le WOD du jeudi.</p>
        <div className="actions"><BtnLink href={XM_FACTS.healthLab} variant="outline" icon="arrow-up-right" external>Découvrir le Health Lab</BtnLink></div>
        <ClickVideo id="healthlab-accueil" src="assets/video-healthlab.mp4" label="Le Health Lab en vidéo" />
      </article>
      <article className="duo-card slab on-dark">
        <span className="eyebrow" style={{ margin: 0 }}>Entreprises</span>
        <h2 className="disp h2" style={{ fontSize: 'clamp(38px,3.6vw,52px)' }}>Un team building où <span className="acc">tout le monde</span> participe</h2>
        <p>Un WOD par équipes soude plus qu'un afterwork. Sportifs ou pas, chacun bouge à son niveau, encadré par nos coachs. Pour les équipes de Woluwe, Zaventem et de l'est de Bruxelles, sur devis.</p>
        <div className="actions"><BtnLink href="/team-building/" variant="light" icon="arrow-up-right">Le team building sportif</BtnLink></div>
        <ClickVideo id="teambuilding-accueil" src="assets/video-teambuilding.mp4" label="Un team building chez Xmile" />
      </article>
    </div>
  </section>;
}

function HomeFaq() {
  const { Icon } = XM;
  const items = [
    { q: 'Je ne suis pas assez en forme pour commencer.', a: <><p>C'est la question qu'on entend le plus, et la réponse est toujours la même : viens quand même. Chaque mouvement a une version plus simple, chaque charge s'adapte, et ton premier cours est encadré par un coach.</p><p>Personne ne te compare aux autres. Ici, la forme vient en venant.</p></> },
    { q: 'Je dois venir combien de fois par semaine ?', a: <><p>Deux séances par semaine suffisent pour progresser et prendre le rythme : c'est la formule Easy Peasy, à 79 € par mois. Si tu veux venir plus souvent, l'Unlimited à 115 € par mois t'ouvre tous les cours.</p><p>Tu préfères ne pas t'abonner ? La carte de 10 séances (130 €, valable 3 mois) ou le drop-in à 20 € la séance.</p></> },
    { q: 'Qu\'est-ce que je dois apporter ?', a: <><p>Une tenue dans laquelle tu bouges bien, des baskets propres et une gourde. Le matériel, on l'a. On a des vestiaires femmes et hommes, avec des douches pour après ton cours.</p></> },
    { q: 'Je dois m\'engager ?', a: <><p>Non. La séance d'essai est gratuite et sans engagement. Si tu continues, il y a des frais d'inscription uniques de 50 €, et ta mutuelle peut te rembourser jusqu'à 50 € par an.</p></> },
    { q: 'Comment venir à la box ?', a: <><p>On est {XM_FACTS.street} ({XM_FACTS.streetNl}), {XM_FACTS.city}, à Woluwe, à l'est de Bruxelles. Le parking est gratuit.</p></> },
  ];
  return <section className="sec" aria-labelledby="t-faq" style={{ paddingTop: 0 }}>
    <div className="wrap faq">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <span className="eyebrow" style={{ margin: 0 }}>Questions fréquentes</span>
        <h2 className="disp h2" id="t-faq">Avant ta <span className="acc">première</span> séance</h2>
        <p className="lead">Une question qui n'est pas dans la liste ? Écris-nous ou appelle, on répond nous-mêmes.</p>
        <div className="faq-contact">
          <a href={XM_FACTS.phoneHref}><Icon name="phone" size={18} color="var(--xm-orange-600)" />{XM_FACTS.phone}</a>
          <a href={'mailto:' + XM_FACTS.email}><Icon name="mail" size={18} color="var(--xm-orange-600)" />{XM_FACTS.email}</a>
        </div>
      </div>
      <Faq items={items} />
    </div>
  </section>;
}

function Gallery() {
  const { Icon } = XM;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  // [image, description, colonnes, rangées, colonnes mobile]
  const pics = [
    ['assets/crossfit-tous-ensemble.png', 'Le Team WOD, tout le groupe mains au sol', 7, 4, 2],
    ['assets/duo-high-five.jpg', 'Deux membres se tapent dans la main après un WOD', 5, 2],
    ['assets/halterophilie.jpg', 'Un membre prépare un soulevé de terre', 5, 2],
    ['assets/endurance.jpg', 'Une membre rame à l\'ergomètre pendant une séance Hyrox', 3, 3],
    ['assets/groupe-membres.jpg', 'Les membres réunis devant le logo de la box', 5, 3, 2],
    ['assets/handstand-walk.jpg', 'Un membre en marche sur les mains', 4, 3],
    ['assets/depassement-de-soi.jpg', 'Un WOD en duo, saut par-dessus un burpee', 5, 2],
    ['assets/gymnastique.jpg', 'Un membre aux anneaux pendant un cours', 7, 4, 2],
    ['assets/duo-medecine-ball.png', 'Deux membres rient pendant un exercice au médecine-ball', 5, 2],
    ['assets/mobilite.jpg', 'Un moment de mobilité en fin de séance', 5, 3],
    ['assets/kids.jpg', 'Un coach donne une consigne à deux enfants', 3, 3],
    ['assets/mobilite-2.jpg', 'Des étirements en groupe', 4, 3],
    [null, 'Une photo de la box à ajouter', 6, 3, 2],
    [null, 'Une photo de la box à ajouter', 3, 3],
    [null, 'Une photo de la box à ajouter', 3, 3],
  ];
  const shown = 6;
  const toggle = () => {
    if (open && ref.current) { const t = ref.current.getBoundingClientRect().top + scrollY - 100; if (scrollY > t) scrollTo({ top: t }); }
    setOpen(v => !v);
  };
  return <section className="sec" aria-labelledby="t-gal" style={{ paddingBottom: 0 }} ref={ref}>
    <div className="wrap">
      <SecHead eyebrow="Galerie" id="t-gal" title={<>La box, <span className="acc">en vrai</span></>} lead="Les cours, les événements, les gens : un aperçu avant de venir voir par toi-même." />
      <div className="gal" id="galerie" data-open={open}>
        {pics.map(([src, d, c, r, mc], i) => (i < shown || open) && <Slot key={i} id={'galerie-' + String(i + 1).padStart(2, '0')} src={src || undefined} className={'gal-it' + (i >= shown ? ' more' : '')} style={{ '--c': c, '--r': r, '--mc': mc || 1, '--k': i - shown }}>{d}</Slot>)}
      </div>
      <div className="gal-foot">
        <button type="button" className="btn btn-outline" aria-expanded={open} aria-controls="galerie" onClick={toggle}>{open ? 'Voir moins' : 'Voir plus de photos'}<Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} /></button>
        <span className="gal-count">{(open ? pics.length : shown) + ' / ' + pics.length + ' photos'}</span>
      </div>
    </div>
  </section>;
}

function HomePage() {
  return <>
      <Disciplines />
      <Doors />
      <CoachStrip />
      <FirstSession />
      <Reviews />
      <BoxLife />
      <Gallery />
      <LabAndCompanies />
      <HomeFaq />
      <FinalCta />
  </>;
}

Object.assign(window, { BoxLife, Gallery, LabAndCompanies, HomeFaq, HomePage });
