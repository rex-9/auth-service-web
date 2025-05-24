import axios, { AxiosRequestConfig } from "axios";
import AppConfig from "../AppConfig";
import { useLoading } from "../contexts/LoadingContext";
import { useEffect } from "react";
import { useAuth } from "../contexts";
import { GeneralApiResponse } from "../models";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: AppConfig.SERVER_BASE_URL,
  timeout: 10000, // Set a timeout for requests
  withCredentials: true, // Include credentials in requests
});

// Utility function to handle errors
const handleError = <T>(error: unknown): GeneralApiResponse<T> => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Server Error:", error.response.data);
      return {
        success: false,
        message: error.response.data?.message || "An error occurred",
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
      return {
        success: false,
        message: "Network error, please try again later",
        data: null,
      };
    }
  }
  // Something else happened while setting up the request
  console.error("Error:", (error as Error).message);
  return {
    success: false,
    message: "An error occurred, please try again",
    data: null,
  };
};

const apiRequest = async <T>(
  url: string,
  config: AxiosRequestConfig
): Promise<GeneralApiResponse<T>> => {
  try {
    const response = await axiosInstance(url, config);
    return response.data;
  } catch (error: unknown) {
    return handleError(error);
  }
};

// Utility functions for each HTTP method
const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    return apiRequest<T>(url, { ...config, method: "GET" });
  },
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    return apiRequest<T>(url, { ...config, method: "POST", data, headers });
  },
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };
    return apiRequest<T>(url, { ...config, method: "PUT", data, headers });
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    return apiRequest<T>(url, { ...config, method: "DELETE" });
  },
};

// Custom hook to set up axios interceptor
export const useAxiosInterceptor = () => {
  const { setLoading } = useLoading();
  const { token, logout } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        setLoading(true);
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        console.log("interceptor response error ===>", error);
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data?.success === false &&
          (error.response.data?.message === "Signature has expired" ||
            error.response.data?.message === "No verification key available" ||
            error.response.data?.message === "Active session not found.")
        ) {
          // Token has expired, prompt the user to re-authenticate
          alert("Your session has expired. Please log in again.");
          logout();
        }
        setLoading(false);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [setLoading, token]);
};

export const handleApi = async <T>(
  operation: string,
  func: () => Promise<GeneralApiResponse<T>>,
  onSuccess: (data: GeneralApiResponse<T>) => void,
  onFailure?: (error?: any) => void
): Promise<void> => {
  try {
    const response = await func();
    if (response.success) {
      onSuccess(response);
    } else {
      onFailure?.(response.message);
    }
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : `Error on ${operation}: ${String(err)}`;
    onFailure?.(errorMessage);
  }
};

export default api;
