// Blocs partagés (suite) : avis, accès, tarifs Kids, team building
function Reviews({ flush }) {
  return <section className="sec" aria-labelledby="t-rev" style={{ background: 'var(--bg-alt)', paddingTop: flush ? 'var(--space-16)' : undefined }}>
    <div className="wrap">
      <SecHead eyebrow="Avis Google" id="t-rev" title={<>Ce que les membres <span className="acc">en disent</span></>} lead="On préfère laisser parler celles et ceux qui viennent chaque semaine. Les avis ci-dessous sont publiés sur notre fiche Google." />
      <TrustindexReviews />
      <div className="reviews-meta">
        <GoogleBadge />
        <TLink href={XM_FACTS.googleAvis} external>Voir tous les avis sur Google</TLink>
      </div>
    </div>
  </section>;
}

function FinalCta({ title = 'Ta place est prête. Viens essayer.', text = 'Une séance gratuite, sans engagement, avec un coach qui t\'attend. Tu repars avec des courbatures et une idée claire de ce qui t\'attend.', cta = true, extra, href = '/seance-essai/', label = 'Réserve ta séance d\'essai' }) {
  const q = encodeURIComponent('Avenue du Péage 63, 1932 Sint-Stevens-Woluwe');
  const [mapOn, setMapOn] = React.useState(false);
  const { Icon } = XM;
  return <section className="sec" id="acces" aria-labelledby="t-final" style={{ paddingTop: 0, paddingBottom: 0 }}>
    <div className="wrap">
      <div className="final">
        <div className="final-copy">
          <h2 className="disp h2" id="t-final">{title}</h2>
          <p style={{ font: '500 18px/1.5 var(--font-body)', maxWidth: '40ch' }}>{text}</p>
          {cta && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <BtnLink href={href} variant="dark" size="lg" icon={href[0] === '#' ? 'arrow-down' : 'arrow-up-right'}>{label}</BtnLink>
            <GoogleBadge />
          </div>}
          <div className="final-facts">
            <div><h3>Adresse</h3><p>{XM_FACTS.street} ({XM_FACTS.streetNl})<br />{XM_FACTS.city}<br />{XM_FACTS.parking}</p></div>
            <div><h3>Ouverture</h3><ul>{XM_FACTS.hours.map(([d, h]) => <li key={d}>{d} : {h}</li>)}</ul></div>
            {extra}
          </div>
        </div>
        <div className="map">
          {mapOn ? <iframe title="Plan d'accès : Xmile CrossFit, Avenue du Péage 63, Sint-Stevens-Woluwe" referrerPolicy="no-referrer-when-downgrade" src={'https://maps.google.com/maps?q=' + q + '&z=15&output=embed'} />
            : <div className="map-facade on-dark">
              <p className="map-addr">{XM_FACTS.street}<br />{XM_FACTS.city}</p>
              <button type="button" className="btn btn-light" onClick={() => setMapOn(true)}><Icon name="map" size={18} />Afficher la carte</button>
              <p className="map-note">Google déposera ses propres cookies.</p>
            </div>}
        </div>
      </div>
    </div>
  </section>;
}

// Grille tarifs Kids & Teens
function KidsPriceGrid() {
  return <div className="prices">
    <div className="price-main kids">{XM_KIDS_PRICES.map((p, i) => <article key={p.id} className={'plan' + (i === 0 ? ' hl' : '')}>
      <div className="plan-top"><h3 className="plan-name">{p.name}</h3>{i === 0 && <span className="plan-tag">Le créneau fixe</span>}</div>
      <p className="plan-price">{p.price}<small>{p.per}</small></p>
      <p className="plan-desc">{i === 0 ? 'Le mercredi ou le samedi, toujours le même créneau.' : 'Le mercredi et le samedi : endurance et force, puis CrossFit.'}</p>
    </article>)}
      <article className="plan plan-note">
        <h3 className="plan-name">Frères et sœurs</h3>
        <p className="plan-price">-10 %<small>dès le 2e enfant</small></p>
        <p className="plan-desc">De la même famille, sur l'abonnement du deuxième enfant et des suivants.</p>
      </article>
    </div>
    <CheckList className="price-notes" items={['Saison de septembre à juin', 'Paiement mensuel par domiciliation', 'Ou paiement semestriel : septembre à janvier, puis février à juin', <Todo>À CONFIRMER : cours d'essai gratuit pour les enfants</Todo>]} />
  </div>;
}

// Carte format team building
function FormatCard({ f }) {
  return <Notch bg={f.bg} fg={f.fg}>
    <div className="tile fmt">
      <span className="tile-meta">Format {f.n}</span>
      <h3 className="disp h3" style={{ color: 'inherit' }}>{f.t}</h3>
      <p>{f.d}</p>
    </div>
  </Notch>;
}

// Formulaire de devis B2B
function QuoteForm({ formats }) {
  const { Input, Select, Icon } = XM;
  const blank = { company: '', name: '', role: '', email: '', phone: '', size: '', when: '', format: 'Je ne sais pas encore', msg: '' };
  const [v, setV] = React.useState(blank);
  const [err, setErr] = React.useState({});
  const [sent, setSent] = React.useState(false);
  const set = k => val => { setV(o => ({ ...o, [k]: val })); setErr(o => ({ ...o, [k]: undefined })); };
  const submit = e => {
    e.preventDefault();
    const er = {};
    ['company', 'name', 'email', 'size'].forEach(k => { if (!v[k].trim()) er[k] = 'Champ requis'; });
    if (v.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) er.email = 'Adresse email invalide';
    setErr(er);
    if (!Object.keys(er).length) setSent(true);
  };
  if (sent) return <div className="qform qform-done" role="status">
    <span className="disc" style={{ width: 56, height: 56 }}><Icon name="check" size={26} /></span>
    <h3 className="disp h3">Merci {v.name.split(' ')[0]}, c'est envoyé</h3>
    <p>On revient vers toi à {v.email} sous <Todo>À VALIDER : 2 jours ouvrables</Todo> avec une proposition pour {v.company}.</p>
    <p className="muted">Une question urgente ? Appelle-nous au <a href={XM_FACTS.phoneHref}>{XM_FACTS.phone}</a>.</p>
  </div>;
  return <form className="qform" onSubmit={submit} noValidate>
    <div className="qgrid">
      <Input label="Entreprise *" value={v.company} onChange={set('company')} error={err.company} />
      <Input label="Nom et prénom *" value={v.name} onChange={set('name')} error={err.name} />
      <Input label="Fonction" value={v.role} onChange={set('role')} placeholder="RH, office manager…" />
      <Input label="Email professionnel *" type="email" value={v.email} onChange={set('email')} error={err.email} />
      <Input label="Téléphone" type="tel" value={v.phone} onChange={set('phone')} />
      <Input label="Nombre de participants *" type="number" value={v.size} onChange={set('size')} error={err.size} />
      <Input label="Période ou date souhaitée" value={v.when} onChange={set('when')} placeholder="Ex. un jeudi soir en mars" />
      <Select label="Format envisagé" value={v.format} onChange={set('format')} options={[...formats, 'Je ne sais pas encore']} />
    </div>
    <label className="qarea"><span>Message</span><textarea rows="4" value={v.msg} onChange={e => set('msg')(e.target.value)} placeholder="Ce que tu veux pour ton équipe, contraintes, questions" /></label>
    <p className="qlegal">Ces informations servent uniquement à répondre à cette demande. Elles partent par e-mail et ne sont pas enregistrées sur le site. <a href="/politique-de-confidentialite/">Politique de confidentialité</a></p>
    <div className="qfoot"><button type="submit" className="btn btn-primary btn-lg">Envoyer ma demande de devis<Icon name="arrow-up-right" size={20} /></button><span className="muted">* champs requis</span></div>
  </form>;
}

Object.assign(window, { Reviews, FinalCta, KidsPriceGrid, FormatCard, QuoteForm });
