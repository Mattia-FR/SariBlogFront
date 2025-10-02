// Export de tous les types admin
// Articles
export type {
  AdminArticle,
  CreateArticleData,
  UpdateArticleData,
  AdminArticlesResponse,
  AdminArticlesPageData,
} from './articles';

// Illustrations
export type {
  AdminIllustration,
  CreateIllustrationData,
  UpdateIllustrationData,
  AdminIllustrationsResponse,
  AdminIllustrationsPageData,
} from './illustrations';

// Messages
export type {
  AdminMessage,
  MessageStats,
  AdminMessagesResponse,
  AdminMessagesPageData,
} from './messages';

// Tags
export type {
  AdminTag,
  CreateTagData,
  UpdateTagData,
  TagStats,
  AdminTagsResponse,
  AdminTagsPageData,
} from './tags';

// Users
export type {
  AdminUser,
  CreateUserData,
  UpdateUserData,
  ChangePasswordData,
  UserStats,
  AdminUsersResponse,
  AdminUsersPageData,
} from './users';

// About
export type {
  AdminAbout,
  UpdateAboutData,
  AboutHistory,
  AdminAboutPageData,
} from './about';

// Upload
export type {
  UploadedFile,
  UploadResponse,
  MultipleUploadResponse,
} from './upload';

// Common
export type {
  AdminPagination,
  AdminApiResponse,
  AdminListResponse,
  AdminError,
  AdminErrorResponse,
} from './common';
