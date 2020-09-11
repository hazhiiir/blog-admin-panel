export type ValidationError<FieldSet> = {
  [key in keyof FieldSet]: string;
};

export type RegisterFields = "email" | "password" | "username";

export interface User {
  username: string;
  password: string;
  email: string;
}

export interface RegisterState {
  waiting: boolean;
  error: ValidationError<RegisterFields> | null;
  success: boolean;
}
