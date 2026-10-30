# Xmile Design System

Brand kit for **Xmile CrossFit**, a box offering CrossFit, Hyrox and Olympic weightlifting (haltérophilie). Primary surface is the box's marketing website (programmes, class planning, pricing, free-trial booking). Language: French (Belgium).

## Sources
- `uploads/Xmile Logo.png` — orange script logo, transparent (1000×1000) → `assets/logo-orange.png` (+ recoloured `logo-white.png`, `logo-green.png`)
- `uploads/images.jpg` — white logo on deep green (#11261F) → `assets/logo-on-green.jpg`
- `uploads/inspiration site xmile.png` — art-direction reference (a sports e-commerce hero, "FLONEA") → `assets/inspiration-reference.png`
- https://www.xmile-health-lab.be — requested source for font & colour. **Could not be fetched** (blocked). Colours were sampled from the logos instead; fonts are Google Fonts substitutes.

## Index
- `styles.css` — entry; imports `tokens/{fonts,colors,typography,spacing,effects}.css`
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives (core, forms, surfaces, navigation, feedback)
- `ui_kits/website/` — click-through website (Accueil, Planning, Tarifs, Essai dialog)
- `assets/` — logos + reference image
- `SKILL.md` — agent skill entry

## Components
- core: Icon, Button, IconButton, Pill, Badge
- forms: Input, Select, Checkbox, Switch
- surfaces: Card, NotchCard, StatBlock
- navigation: NavBar, Tabs
- feedback: Dialog, Toast, Tooltip

No source component library exists; this is a standard set sized to a gym website. **Intentional additions:** Icon (Lucide wrapper), NotchCard (signature tile from the reference), StatBlock (big-number stats from the reference), NavBar.

## Content fundamentals
- **Language:** French, informal **tu** ("Réserve ta séance", "Forge ton meilleur toi"). Never "vous".
- **Tone:** coach energy — direct, motivating, short imperatives. Community over ego; welcoming to beginners ("tous niveaux").
- **Casing:** headlines, nav, buttons, labels in UPPERCASE (set via CSS, write copy in sentence case). Body copy in sentence case.
- **Vocabulary:** gym jargon is fine and kept in English where the community uses it: WOD, PR, RX, open gym, box, scalable.
- **Numbers as heroes:** "500+ athlètes", "45+ cours / semaine", "6h–21h".
- **No emoji.** Punctuation sparse; "·" as separator (CrossFit · Hyrox · Haltéro).
- Examples: "Séance d'essai", "Voir le planning", "Une box. Trois disciplines.", "Place réservée — WOD 18h30", "Liste d'attente".

## Visual foundations
- **Colour:** two brand colours from the logo — Xmile Orange `#F97316` (action, highlights, one word per headline) and Box Green `#11261F` (dark hero slabs, footer, text). Warm cream page (`#FBF8F2`) replaces pure white backgrounds; white is for cards. Accent tile fills borrowed from the reference: lime `#E3EE8E`, red `#D9412E`, blush `#F1D6D2`. Use at most one accent tile colour per tile, in rows of three.
- **Type:** giant condensed all-caps display (Bebas Neue, line-height .9) for headlines and numbers; Barlow Condensed caps for nav/buttons/labels (+.06em tracking); Barlow for body. Headlines often colour one word orange.
- **Backgrounds:** flat colour only. No gradients, no textures. The hero is a big rounded dark-green slab inset from the page edge (28px radius). Imagery: cut-out athletes overlapping the slab edge; warm, high-contrast, saturated sport photography.
- **Signature shape:** the *notch tile*: a card with a raised folder tab top-right and a concave fillet (`NotchCard`).
- **Corners:** generous: 10px inputs, 22px cards, 28px hero/dialogs, pills on all buttons/tags/tabs.
- **Borders:** hairline cream (`#E8DFD0`) on light cards; 22% white hairlines as dividers on dark. Outline buttons use 1.5px orange.
- **Shadows:** rare. Cards are flat; shadow only on floating layers (dialog, toast) — soft green-tinted `--shadow-lg`.
- **Layout:** 1240px container, 24px gutter, generous whitespace on cream. Hero splits into 3 columns (side info rail · photo · headline). Thin vertical/horizontal dividers organise hero content.
- **Transparency/blur:** only the dialog scrim (green 60% + 4px blur).
- **Motion:** quick and physical — 120–200ms, `--ease-out`; springy `--ease-snap` on toggles and the arrow disc. No long fades.
- **Hover:** buttons darken (orange 500→600); notch tiles lift 4px; arrow IconButton tilts −12°. Links get an underline bar.
- **Press:** buttons scale to .97.
- **Focus:** orange border + 3px light-orange ring.

## Iconography
- No icon set was provided. **Substitute: Lucide** (2px stroke, rounded) via CDN `lucide-static@0.460.0`, rendered by the `Icon` component as a currentColor mask.
- Common glyphs: arrow-up-right (signature CTA arrow, usually in an orange disc), chevron-left/right, dumbbell, timer, trophy, calendar, user, check, play.
- No emoji, no unicode icons (except "·" separator). Logo is a PNG; use orange on light, white on green/orange, green on cream.
