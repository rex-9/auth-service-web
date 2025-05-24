import { User } from "./user.model";

export interface GeneralApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | null;
}

export interface AuthApiResponse {
  user: User;
  token: string;
}
