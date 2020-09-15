export type ValidationError<FieldSet> = {
  [key in keyof FieldSet | "message"]: string;
};

export interface PagingParameters {
  limit: number;
  offset: number;
}
export interface RegisterFields {
  email: string;
  password: string;
  username: string;
}

export interface LoginField {
  email: string;
  password: string;
}
export interface User {
  username: string;
  email: string;
  token?: string;
  password?: string;
}

export interface AuthState {
  waiting: boolean;
  error: ValidationError<RegisterFields> | null;
  success: boolean;
  user: User | null;
  isAuthenticated: boolean;
}

export interface CRUDOperations {
  create: "create";
  read: "read";
  update: "update";
  delete: "delete";
}

export interface Author {
  username: string;
  image: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  tagList: string[];
  favorited: boolean;
  favoritesCount: number;
  author: Author;
}

export type RequestStateFlagsObject = {
  [key in keyof CRUDOperations]: boolean;
};

export interface ArticleState {
  waiting: Partial<RequestStateFlagsObject> | null;
  success: Partial<RequestStateFlagsObject> | null;
  error: {} | null;
  entities: {
    [key: string]: Article;
  } | null;
  allIds: string[] | null;
  articlesCount: number;
}

export interface RootState {
  auth: AuthState;
  article: ArticleState;
}
