/**
 * Point d'entrée pour tous les loaders
 * Facilite les imports depuis main.tsx
 */

export { aboutPageLoader } from "./aboutLoader.ts";
// Loaders admin
export {
  adminAboutLoader,
  adminArticlesLoader,
  adminIllustrationsLoader,
  adminLoader,
  adminMessagesLoader,
  adminTagsLoader,
} from "./adminLoaders.ts";
export { articleDetailLoader, articlesPageLoader } from "./articlesLoaders.ts";
export { galleryDetailLoader, galleryPageLoader } from "./galleryLoaders.ts";
// Loaders publics
export { homePageLoader } from "./homeLoader.ts";
export { createPaginatedLoader } from "./utils/createPaginatedLoader.ts";
// Utilitaires
export { parseQueryParams } from "./utils/parseQueryParams.ts";
export {
  withErrorHandling,
  withErrorHandlingAndThrow,
} from "./utils/withErrorHandling.ts";



