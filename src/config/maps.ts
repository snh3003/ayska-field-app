export const MapsConfig = {
  provider: 'google' as 'google' | 'mappls',
  googleApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  mapplsApiKey: process.env.MAPPLS_API_KEY || '',
};
