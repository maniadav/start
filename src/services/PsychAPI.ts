"use client";
import { useRouter } from "next/navigation";
import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { LOCALSTORAGE } from "constants/storage.constant";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "@utils/localStorage";
import { CountryFilter, LanguageFilter } from "../types/APIFilters";
import { API_ENDPOINT } from "@constants/api.constant";

/**
 * Base Class for API's Which contains Axios Instance
 */
class PsychAPI {
  protected HEADERS: any;
  protected PsychAPI: AxiosInstance;

  static Filter: {
    CountryFilter: CountryFilter;
    LanguageFilter: LanguageFilter;
  } = {
    CountryFilter: "IND",
    LanguageFilter: "EN",
  };

  static BASE_URL = process.env.BASE_URL || LOCALSTORAGE.BASE_URL;

  static API_KEY = process.env.API_KEY || "";

  static HEADERS = {
    "Content-Type": "application/json",
  };

  // Create a New API Instance Class

  constructor() {
    this.PsychAPI = getInstance();
  }
}
const createInstance = () => {
  const instance = axios.create({
    baseURL: PsychAPI.BASE_URL,
    timeout: 40000,
    headers: PsychAPI.HEADERS,
  });

  instance.interceptors.request.use(
    async (
      config: AxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig<any>> => {
      const API_KEY = process.env.API_KEY || "";
      let { headers, params } = config;
      // use below if localstorage and api key logic is enabled
      /* token logic */
      const member = getLocalStorageValue(LOCALSTORAGE.START_USER, true);

      if (!headers?.["x-access-token"]) {
        if (member?.token) {
          // Add member token to headers
          headers = { ...headers, "x-access-token": member?.token };
        } else {
          // Add API key to headers if no member token
          headers = { ...headers, apikey: API_KEY };
        }
      }

      // Create a new InternalAxiosRequestConfig with updated headers and params
      const axiosRequest: InternalAxiosRequestConfig<any> = {
        ...config,
        headers: headers as any,
        params: params,
      };

      // Return the updated InternalAxiosRequestConfig
      return axiosRequest;
    },
    (err: any) => Promise.reject(err)
  );

  instance.interceptors.response.use(undefined, (error: any) => {
    if (error.config && error.response?.status) {
      const { config, response } = error;
      const { status } = response;

      switch (status) {
        /**
         * If consumer is unauthorized or Forbidden to access
         * then force logout and redirect to Login page
         */
        case 401: {
          localStorage.clear();
          const router = useRouter();
          console.log("member is unauthorized");
          router.push(`${API_ENDPOINT.auth.login}`);
          break;
        }
        /**
         * Refresh Token - If token is expired then remove old token and
         * replace with new one from response.
         */
        case 498: {
          const member = getLocalStorageValue(LOCALSTORAGE.START_USER, true);
          localStorage.removeItem(LOCALSTORAGE.START_USER);
          setLocalStorageValue(
            LOCALSTORAGE.START_USER,
            { ...member, token: response.data.newToken },
            true
          );
          config.headers["x-access-token"] = response.data.newToken;
          return axios.request(config);
        }
        default: {
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(error);
  });
  (window as any).axiosInstance = instance;
  return instance;
};

const getInstance = () => {
  if ((window as any).axiosInstance) {
    return (window as any).axiosInstance;
  } else {
    return createInstance();
  }
};

export default PsychAPI;
