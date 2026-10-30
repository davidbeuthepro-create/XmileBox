# Pack migration crossfitxmile.com

WordPress (agence Localisy) vers site statique : Claude Design, puis Claude Code, GitHub, Hostinger.
Préparé le 2026-10-02 à partir du site en ligne.

**Emplacement** : ce dossier se place à la racine du dépôt sous le nom `_migration/`. Le `.htaccess` le rend inaccessible en ligne (404). Les fichiers de `site/` sont à copier à la racine du site. Supprimer `_migration/` du dépôt après la mise en ligne.

## Contenu du pack

| Dossier | Contenu |
|---|---|
| `site/.htaccess` | Redirections et règles serveur, à placer à la racine du site. Testé sur Apache (résultats plus bas). |
| `site/sitemap.xml` | 21 URLs de la nouvelle arborescence. |
| `site/robots.txt` | Autorise tout sauf `/api/`, déclare le sitemap. |
| `landings/*.md` | Les 13 landings locales : title, meta description, H1 et texte, à reconstruire dans le gabarit « landing locale ». |
| `pages-existantes/preparation-hyrox.md` | Contenu actuel de la page Hyrox, à conserver dans la nouvelle version. |
| `tracking/tracking-snippets.html` | Conteneur GTM + écouteur des événements Sportigo. |

## Inventaire du site actuel

15 pages publiques, aucun article, aucune page légale. Les 15 URLs sont conservées à l'identique :
`/`, `/preparation-hyrox/`, `/cours-crossfit-debutant/`, `/salle-de-sport-woluwe/`, et `/crossfit-` + bruxelles, woluwe, ixelles, schaerbeek, laeken, saint-gilles, evere, anderlecht, jette, zaventem, drogenbos.
Il n'y a donc aucune page à rediriger : le `.htaccess` ne traite que les URLs techniques de WordPress et la canonicalisation.

## Règles de construction

1. **Une page = un dossier + `index.html`** (`/crossfit-woluwe/index.html`). Toutes les URLs et tous les liens internes finissent par `/`.
2. **Canonical absolue** sur chaque page : `https://crossfitxmile.com/.../`.
3. **Landings** : title et meta description du frontmatter repris à l'identique (ce sont eux qui rankent). H1 et texte repris. Les lignes courtes isolées (« Ce qu'on vous propose », « Nos horaires », « Inscription »…) sont des sur-titres de section, pas des titres. Les sections « Nos horaires » et « Ils en parlent mieux que nous » reçoivent les composants planning Sportigo et avis.
4. **Hyrox** : la nouvelle `/preparation-hyrox/` garde les sections longues du contenu actuel avec leurs H2/H3 (qu'est-ce que le Hyrox, 4 piliers, exercices, 8 stations, exemple de séance, conseils jour J). Elles portent les positions actuelles ; le nouveau design les présente, il ne les supprime pas.
5. **Pages légales à créer** (absentes du site actuel) : `/mentions-legales/`, `/politique-de-confidentialite/`, `/politique-de-cookies/`, en `noindex, follow`, hors sitemap. Base : les textes du Xmile Health Lab, adaptés (éditeur, BCE 1013.373.450, Sportigo, GTM/GA4, Trustindex, formulaire de devis).
6. **Bandeau cookies** avec Consent Mode v2 : aucun tag GA4 ou Ads avant consentement ; refuser aussi simple qu'accepter.
7. **Sitemap** : ajouter `<lastmod>` au build avec la date réelle de modification.

## Corrections apportées aux textes des landings

Erreurs factuelles du site actuel, corrigées dans les fichiers :

- `crossfit-jette`, `crossfit-drogenbos` : « notre établissement à Woluwe-Saint-Lambert » devient Woluwe-Saint-Étienne (Sint-Stevens-Woluwe). La box n'est pas à Woluwe-Saint-Lambert.
- `crossfit-zaventem` : la page disait la salle « à Woluwe-Saint-Lambert, à 6 km de Zaventem » ; elle est sur la commune de Zaventem.
- `salle-de-sport-woluwe` : adresse replacée à Sint-Stevens-Woluwe « à la limite de Woluwe-Saint-Lambert » (le mot-clé reste, honnêtement) ; « 6 coachs » devient 11.
- `crossfit-jette` : intertitre « 5 bonnes raisons… près de Drogenbos » corrigé en « près de Jette ».
- 6 pages : l'ancien parcours d'essai (formulaire puis rappel, ou contact par mail) remplacé par la réservation en ligne d'un créneau.

Non corrigé, à trancher avec le client :

- `crossfit-drogenbos` annonce « 30 km » : à vérifier.
- Plusieurs pages écrivent « notre box à Saint-Gilles / Evere / Jette », comme si la salle y était.

## Formulaire de devis Team building : `api/devis.php`

- PHP + PHPMailer en SMTP authentifié (`smtp.hostinger.com`, port 465, SSL), expédié depuis une boîte technique du domaine (ex. `site@crossfitxmile.com`, que personne ne lit).
- Destinataire : `xmileconcept@gmail.com` (boîte unique pour toutes les demandes). `Reply-To` = email du demandeur, pour répondre directement depuis Gmail.
- Objet de l'email explicite et filtrable : `[Team building] Entreprise · nombre de participants`.
- Anti-spam sans reCAPTCHA (pas de cookie tiers) : champ piège invisible, délai minimal de remplissage, limite d'envois par IP.
- Validation côté serveur, réponse JSON, message de confirmation dans la page sans rechargement.
- Après envoi réussi : `dataLayer.push({event: 'devis_team_building'})` pour la conversion GA4 / Ads.
- Rien n'est stocké sur le serveur : la demande part uniquement par email (à mentionner dans la politique de confidentialité).

## Secrets : jamais dans GitHub

Le dépôt est déployé tel quel sur Hostinger : tout ce qui est dans GitHub est potentiellement public.

- Le mot de passe SMTP vit dans un fichier `xmile-config.php` placé **un dossier au-dessus de `public_html`**, créé à la main dans le gestionnaire de fichiers hPanel. `api/devis.php` le charge par chemin absolu.
- `.gitignore` : `xmile-config.php`, `.env`, `*.local.*`.
- Le `.htaccess` bloque déjà `.git/`, `.env` et les fichiers `.md`.

## Avis Google

- **Pas d'API Google Places.** Ses conditions interdisent de mettre en cache la note et les avis (seules les coordonnées, 30 jours) ; sans cache, chaque affichage est facturé.
- **Bloc avis** : widget Trustindex, version pour site web classique (le plugin WordPress disparaît avec WordPress). Code d'intégration :

  ```html
  <script defer async src='https://cdn.trustindex.io/loader.js?9c3d3dc82f36816164268db70cf'></script>
  ```

  Le widget s'affiche à l'endroit exact où la balise est placée : la mettre dans le cadre prévu par le design, sur les seules pages qui ont un bloc avis. Réserver une hauteur minimale au cadre pour éviter le décalage de mise en page au chargement. Mentionner Trustindex dans la politique de cookies et de confidentialité.
- **Badge de note** (hero, essai, pied de page) : HTML statique, note et nombre d'avis arrondi (ex. « 60+ avis »), lien vers la fiche Google. Valeurs dans un seul fichier de données, mises à jour à la main.
- Pas de balisage `AggregateRating` / `Review` à partir de ces avis.

## Tracking

`tracking/tracking-snippets.html` : GTM `GTM-53R2TNZJ` (head + noscript) et l'écouteur qui pousse les événements du widget Sportigo dans le dataLayer (`sportigo.click`, `sportigo.formSubmit`, `sportigo.custom`). À reprendre tel quel, sinon les réservations d'essai ne sont plus mesurées.

## Bascule

1. Site de test sur un sous-domaine en `noindex` + mot de passe hPanel.
2. Vérifier : les 21 URLs du sitemap en 200, les redirections ci-dessous, le formulaire de devis, `sportigo.formSubmit` dans l'aperçu GTM.
3. Changer le DNS, puis soumettre le sitemap dans Search Console et surveiller le rapport « Pages » pendant 4 semaines.

## Test du `.htaccess` (Apache 2.4, 2026-10-02)

| Requête | Résultat |
|---|---|
| `http://crossfitxmile.com/crossfit-woluwe/` | 301 vers https |
| `https://www.crossfitxmile.com/` | 301 vers sans www |
| `/crossfit-woluwe` | 301 vers `/crossfit-woluwe/` |
| `/crossfit-woluwe/index.html`, `/index.html` | 301 vers l'URL propre |
| `/page-sitemap.xml`, `/sitemap_index.xml` | 301 vers `/sitemap.xml` |
| `/feed/`, `/wp-admin/`, `/wp-login.php`, `/wp-content/…` | 410 |
| `/?subject=essai`, `/crossfit-woluwe/?subject=essai`, `/?subject=drop-in` | 301 vers `/seance-essai/` |
| `/?p=12` | 301 vers `/` |
| `/.git/config`, `/_migration/…` | 404 (ou 403 pour les `.md`) |
| `/README.md` | 403 |
| pages du sitemap, `/sitemap.xml`, `/robots.txt` | 200 |
