// JSON-LD ExerciseGym de l'accueil, alimenté par site.json. Jamais d'AggregateRating ni de Review.
export default {
  eleventyComputed: {
    jsonld: data => ({
      '@context': 'https://schema.org',
      '@type': 'ExerciseGym',
      name: data.site.nom,
      url: data.env.baseUrl + '/',
      telephone: data.site.telephone,
      email: data.site.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.site.adresse.rue,
        postalCode: data.site.adresse.codePostal,
        addressLocality: data.site.adresse.ville,
        addressCountry: data.site.adresse.paysCode,
      },
      openingHoursSpecification: data.site.ouverture.map(o => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: o.schemaJours,
        opens: o.ouvre,
        closes: o.ferme,
      })),
      sameAs: [data.site.instagram, data.site.facebook],
    }),
  },
};
