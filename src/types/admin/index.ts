// Export de tous les types admin
// Articles

// About
export type {
  AboutHistory,
  AdminAbout,
  AdminAboutFormProps,
  AdminAboutPageData,
  UpdateAboutData,
} from "./about";
export type {
  AdminArticle,
  AdminArticleCardProps,
  AdminArticleFormProps,
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
  AdminIllustrationCardProps,
  AdminIllustrationFormProps,
  AdminIllustrationsPageData,
  AdminIllustrationsResponse,
  CreateIllustrationData,
  UpdateIllustrationData,
} from "./illustrations";
// Messages
export type {
  AdminMessage,
  AdminMessageCardProps,
  AdminMessagesPageData,
  AdminMessagesResponse,
  MessageStats,
} from "./messages";
// Tags
export type {
  AdminTag,
  AdminTagCardProps,
  AdminTagFormProps,
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
