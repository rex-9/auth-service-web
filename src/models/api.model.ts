import { User } from "./user.model";

export interface ApiGeneralResponse<T> {
  success: boolean;
  message: string;
  data?: T | null;
}

export interface ApiAuthResponse {
  user: User;
  token: string;
}
