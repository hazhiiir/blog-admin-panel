export type ValidationError<FieldSet> = {
  [key in keyof FieldSet]: string;
};

export interface RegisterFields {
  email: string;
  password: string;
  username: string;
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

export interface RootState {
  auth: AuthState;
}
