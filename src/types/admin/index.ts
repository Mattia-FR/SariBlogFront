// Export de tous les types admin
// Articles

// About
export type {
  AboutHistory,
  AdminAbout,
  AdminAboutPageData,
  UpdateAboutData,
} from "./about";
export type {
  AdminArticle,
  AdminArticlesPageData,
  AdminArticlesResponse,
  CreateArticleData,
  UpdateArticleData,
} from "./articles";
// Common
export type {
  AdminApiResponse,
  AdminError,
  AdminErrorResponse,
  AdminListResponse,
  AdminPagination,
} from "./common";
// Illustrations
export type {
  AdminIllustration,
  AdminIllustrationsPageData,
  AdminIllustrationsResponse,
  CreateIllustrationData,
  UpdateIllustrationData,
} from "./illustrations";
// Messages
export type {
  AdminMessage,
  AdminMessagesPageData,
  AdminMessagesResponse,
  MessageStats,
} from "./messages";
// Tags
export type {
  AdminTag,
  AdminTagsPageData,
  AdminTagsResponse,
  CreateTagData,
  TagStats,
  UpdateTagData,
} from "./tags";
// Upload
export type {
  MultipleUploadResponse,
  UploadedFile,
  UploadResponse,
} from "./upload";
