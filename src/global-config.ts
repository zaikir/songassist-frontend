import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  mapboxApiKey: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Song Assist',
  appVersion: packageJson.version,
  serverUrl: import.meta.env.VITE_API_URL ?? '/api/v1',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',

  /**
   * Mapbox
   */
  mapboxApiKey: import.meta.env.VITE_MAPBOX_API_KEY ?? '',
};
