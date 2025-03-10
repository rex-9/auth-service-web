export interface IApiResponse<T> {
  data: T | null;
  error?: string;
}

export interface IApiAuthResponse<T> {
  status: {
    code: number;
    success: boolean;
    message: string;
    error?: string;
  };
  data?: T | null;
}
