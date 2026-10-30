// SITE_ENV est défini dans .github/workflows/deploy.yml.
// test : noindex partout (meta + en-tête HTTP). production : comportement normal.
const siteEnv = process.env.SITE_ENV === 'production' ? 'production' : 'test';

export default {
  siteEnv,
  isTest: siteEnv === 'test',
  // Canonical toujours absolue vers la production, même en test.
  baseUrl: 'https://crossfitxmile.com',
};
