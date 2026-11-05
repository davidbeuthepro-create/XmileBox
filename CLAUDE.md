# CrossFit Xmile · crossfitxmile.com

Refonte du site WordPress actuel en site statique. Source du design et des textes : le bundle Claude Design. Faits, règles SEO et fichiers de migration : `_migration/`.

## À lire avant de commencer

- Le README du pack migration dans `_migration/` : règles de construction, .htaccess, sitemap, landings, Hyrox, tracking, formulaire de devis, secrets.
- `_migration/brief-pages-legales.md` : textes définitifs des 4 pages légales, du bandeau cookies et des micro-textes. À reprendre mot pour mot.
- `_migration/landings/*.md`, `_migration/pages-existantes/preparation-hyrox.md`, `_migration/site/`, `_migration/tracking/`.
- **La maquette** : `_migration/design/README.md`, puis `_migration/design/project/CLAUDE.md` (décisions validées avec David pendant le design) et les pages `_migration/design/project/*.html` avec `site/*.jsx`, `site/*.css`, `assets/`. Ce sont des prototypes React : les recréer fidèlement en HTML statique Eleventy, sans React en production. Données de référence (coachs, horaires, tarifs, ids Sportigo, faits) : `site/xm-shared.jsx`.

## Priorités en cas de conflit

- Contenu, ton, localisation, design, animations, liste des cours (Pilates compris, Hyrox sans niveaux) : `_migration/design/project/CLAUDE.md` et la maquette l'emportent sur les briefs et sur ce fichier.
- Stack, déploiement, URLs, SEO technique, intégrations : ce fichier l'emporte.

## URLs (décidées avec David le 30/10/2026)

- Pages principales, comme dans `XM_ROUTES` de la maquette : `/`, `/crossfit/`, `/preparation-hyrox/`, `/halterophilie/`, `/pilates/`, `/kids-teens/`, `/notre-vision/`, `/team-building/`, `/seance-essai/`, et les 4 pages légales.
- Pages locales : la maquette prévoit `/crossfit/<commune>/` et `/hyrox/<commune>/`. **Ne pas utiliser ce format.** Toutes les pages locales sont à plat, et aucune URL existante ne change (aucune redirection 301) :
  - pages existantes recevant le contenu de la maquette : `/crossfit-bruxelles/`, `/crossfit-zaventem/`, `/crossfit-evere/`, `/crossfit-schaerbeek/`, `/crossfit-woluwe/` (page Woluwe-Saint-Lambert de la maquette), `/cours-crossfit-debutant/` (page CrossFit débutant de la maquette) ;
  - nouvelles pages de la maquette : `/crossfit-<commune>/` pour les autres communes de `XM_COMMUNES`, `/hyrox-<commune>/` pour les 13 communes, `/hyrox-debutant/`, `/hyrox-duo/` ;
  - pages actuelles absentes de la maquette, conservées : `/crossfit-ixelles/`, `/crossfit-laeken/`, `/crossfit-saint-gilles/`, `/crossfit-anderlecht/`, `/crossfit-jette/`, `/crossfit-drogenbos/`, `/salle-de-sport-woluwe/`. Gabarit local de la maquette, texte de `_migration/landings/`.
- Pour toute page qui existe aujourd'hui, title et meta description repris à l'identique depuis le pack.
- Toutes les pages locales sont liées depuis le pied de page (bloc replié, comme dans la maquette) et figurent dans le sitemap.

## Stack (décidée, ne pas changer)

- Eleventy 3, templates Nunjucks. Sources dans `src/`, sortie dans `_site/`. HTML statique, aucun framework JS : JavaScript vanilla seulement là où il le faut (menu mobile, bandeau cookies, façade vidéo, façade carte, formulaire de devis).
- CSS repris de la maquette (design system), en CSS simple. Pas de Tailwind, pas de préprocesseur.
- Une source unique pour tout ce qui se répète, dans `src/_data/` :
  - `site.json` : nom, adresse, téléphone, email, réseaux, numéro d'entreprise, horaires d'ouverture, URL boutique Sportigo, URL Health Lab, ID GTM
  - `coachs.json` : prénom, rôle, disciplines, bio, photo, ordre d'affichage
  - `horaires.json` : horaires des cours par discipline (affichés en texte HTML)
  - `tarifs.json` : grille adultes et grille Kids & Teens
  - `avis.json` : note Google, nombre d'avis arrondi, lien vers la fiche
  - `navigation.json` : menu et liste des pages locales du pied de page
- Composants en partials dans `src/_includes/` : en-tête, pied de page, carte coach, carte cours, grille tarifs adultes, grille tarifs Kids & Teens, cadre Sportigo, badge note Google, bloc avis, façade vidéo, FAQ, bandeau CTA, carte format team building, formulaire de devis, bandeau cookies.
- Images : `@11ty/eleventy-img`, AVIF + WebP + JPEG, `srcset`, `width`/`height` toujours renseignés, `loading="lazy"` sauf l'image du hero.
- Polices auto-hébergées en woff2 (la politique de cookies l'annonce). Aucun appel à Google Fonts.
- Vidéo de Yannick et Marine : fichier mp4 + sous-titres .vtt auto-hébergés, lecteur en façade. Jamais d'embed YouTube ou Vimeo. Tant que le fichier manque : vignette + [À COMPLÉTER].
- Copiés tels quels dans `_site/` : `robots.txt` (celui du pack) et `api/`.
- `.htaccess` généré au build à partir de `_migration/site/.htaccess` (voir Déploiement pour l'ajout en test).
- `sitemap.xml` généré au build depuis toutes les pages indexables (voir URLs), avec `<lastmod>`. Il remplace celui du pack. Pages légales exclues.
- `_migration/` n'est jamais copié dans `_site/`.

## Déploiement

- Pipeline : push sur `main` → GitHub Action `.github/workflows/deploy.yml` (`permissions: contents: write`) → `npm ci` + build → contenu de `_site/` publié à la racine de la branche `deploy`, fichiers commençant par un point compris (le `.htaccess` doit y être) → Hostinger tire la branche `deploy` (déploiement Git hPanel + webhook).
- Ne jamais modifier la branche `deploy` à la main.
- Variable `SITE_ENV`, définie dans le workflow :
  - `test` (valeur actuelle) : `<meta name="robots" content="noindex, nofollow">` sur toutes les pages et `Header set X-Robots-Tag "noindex, nofollow"` en tête du `.htaccess`. Le `robots.txt` ne bloque rien d'autre que `/api/`, sinon Google ne verrait pas le noindex.
  - `production` (à la bascule) : comportement normal du pack, sans noindex.
- Domaine de test : `lightsalmon-partridge-472537.hostingersite.com` (domaine temporaire Hostinger, site PHP/HTML vide).
- Le site doit fonctionner sur n'importe quel domaine : liens internes et ressources en chemins racine (`/crossfit/`, `/assets/...`), jamais en URL absolue. Les règles du `.htaccess` propres au domaine (www vers sans www, etc.) ne s'appliquent qu'à `crossfitxmile.com` : le domaine de test ne doit jamais être redirigé vers la production.
- Canonical toujours absolues vers `https://crossfitxmile.com/.../`, même en test.

## Règles de contenu

- **La maquette est la référence pour tous les textes, landings et page Hyrox compris.** Ne pas les réécrire. En cas de conflit avec les règles 3 et 4 du README du pack, ce fichier l'emporte.
- Tutoiement partout, sauf les pages légales (vouvoiement, c'est voulu). Aucun tiret cadratin.
- Marqueurs `[À COMPLÉTER : …]`, `[À VALIDER : …]`, `[À CONFIRMER]` : conservés, visibles et surlignés. Ne jamais inventer de bio, chiffre, avis, logo ou événement.
- Adresse identique partout : Avenue du Péage 63, 1932 Sint-Stevens-Woluwe. Localisation comme dans la maquette : « à Bruxelles » dans les H1 et les title ; dans les textes, « à Woluwe, à l'est de Bruxelles » ou « Sint-Stevens-Woluwe, juste à la frontière de Bruxelles ». Jamais « aux portes de Bruxelles », jamais une adresse bruxelloise.
- Aucun nom de coach en dur : tous les blocs coachs viennent de `coachs.json`, filtrés par discipline. Un départ = une entrée en moins, rien d'autre à toucher.
- Landings et `/preparation-hyrox/` : texte de la maquette. Du pack (`_migration/landings/*.md`, `_migration/pages-existantes/preparation-hyrox.md`), on garde le **title** et la **meta description** à l'identique, car ce sont eux qui rankent aujourd'hui. Le texte du pack ne sert que de secours pour une landing absente de la maquette.
- Si une landing ou la page Hyrox de la maquette est nettement plus courte que le contenu actuel du pack, le signaler à David dans le résumé d'étape, sans rien changer de toi-même.

## Règles HTML et SEO

- Vrais `<a href>` partout : menu, cartes, boutons, fil d'Ariane. Jamais de div ou span avec onclick.
- Un seul H1 par page, hiérarchie H2/H3 propre.
- FAQ en `<details>`/`<summary>`, réponses présentes dans le HTML.
- Aucun texte dans les images. `alt` descriptif sur chaque image ; photos d'enfants sans visage identifiable.
- Une page = un dossier + `index.html`. URLs et liens internes avec `/` final.
- Pages légales : `noindex, follow`, hors sitemap, canonical absolue.
- JSON-LD `ExerciseGym` sur l'accueil (nom, adresse, téléphone, horaires d'ouverture, URL), alimenté par `site.json`. Jamais d'`AggregateRating` ni de `Review`.
- Mobile d'abord.

## Intégrations

- **Sportigo** (planning + réservation de l'essai), un seul par page, sans le restyler (soigner seulement le cadre autour) :

  ```html
  <div id="sportigo-appointment-container"></div>
  <script src="https://standalone.api.sportigo.fr/component-standalone.js"></script>
  <script>
    initComponent("Appointment", "sportigo-appointment-container", "b59ceb43-2ed3-4ac2-9f6d-ed5e9c9e9bcc", {
      "theme": { "googleFont": { "name": "Inter" } },
      "source": { "kind": "widget", "ref": "appointment" },
      "readonly": false, "forceBookBtn": true, "colored": true, "planning": 2143, "displayMode": "slide"
    });
  </script>
  ```

  Sur chaque page cours, le planning est filtré par discipline comme dans la maquette (option `activities`, ids de `XM_SPG` dans `xm-shared.jsx`). Bouton « Je m'abonne » : https://xmile-crossfit.sportigo.fr/buy. Les horaires existent aussi en texte : le widget est invisible pour Google.
- **Avis Google** : badge statique depuis `avis.json` ; bloc avis = widget Trustindex (code dans le README du pack), avec une hauteur minimale réservée pour éviter le décalage au chargement.
- **GTM + écouteur Sportigo** : `_migration/tracking/tracking-snippets.html`, repris tel quel.
- **Consentement** : bandeau et panneau selon `brief-pages-legales.md`. Cookie `xmile_consent` 6 mois. Consent Mode v2 basique : `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` à `denied` par défaut ; GA4, Google Ads et Meta ne se déclenchent qu'après accord. Bouton « Gérer mes cookies » dans le pied de page.
- **Carte Google Maps** : façade, chargée seulement au clic sur « Afficher la carte ».
- **Formulaire de devis** : `api/devis.php` selon le README du pack. PHPMailer copié dans le dépôt (pas de Composer sur le serveur). Si `xmile-config.php` est absent, réponse JSON d'erreur propre, sans planter.

## Secrets

`xmile-config.php` (identifiants SMTP) vit au-dessus de `public_html` sur Hostinger, jamais dans le dépôt.
`.gitignore` : `node_modules/`, `_site/`, `xmile-config.php`, `.env`, `*.local.*`.

## Façon de travailler

- Ordre : socle (Eleventy, données, partials, bandeau cookies, workflow) + accueil + `/crossfit/` → Hyrox, Haltérophilie, Pilates, Kids & Teens → Notre vision → Team building → Séance d'essai → gabarit local + toutes les pages locales → pages légales.
- S'arrêter après chaque étape et résumer en quelques lignes : ce qui est fait, ce que David doit vérifier.
- David ne lance aucune commande lui-même. Si une action manuelle est nécessaire (GitHub, hPanel), la décrire clic par clic.
