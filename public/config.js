/**
 * Runtime configuration for the deployed frontend.
 *
 * This file is copied verbatim into the build output and served as a static
 * asset, so it is NOT bundled. Edit this file to repoint the app at a
 * different backend - no rebuild required.
 *
 * The bundled build-time value (VITE_API_URL) is only used as a fallback
 * when this file fails to load.
 */
window.__BGV_CONFIG__ = {
  API_URL: "https://api.dqnex.online",
};
