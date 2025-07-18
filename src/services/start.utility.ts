"use client";

import { API_ENDPOINT } from "@constants/api.constant";
import StartAPI from "./start.api";

class StartUtilityAPI {
  private api: StartAPI;
  private static prefix = "/api/v1";

  constructor() {
    this.api = StartAPI.getInstance();
  }

  /**
   * Authentication related API methods
   */
  public auth = {
    login: (data: { email: string; password: string }) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.auth.login}`,
        data
      );
    },
    register: (data: any) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.auth.register}`,
        data
      );
    },
  };

  /**
   * Organisation related API methods
   */
  public organisation = {
    list: (params?: any) => {
      return this.api.get(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.organisation.list}`,
        params
      );
    },
    create: (data: any) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.organisation.create}`,
        data
      );
    },
  };

  /**
   * Observer related API methods
   */
  public observer = {
    list: (params?: any) => {
      return this.api.get(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.observer.list}`,
        params
      );
    },
    create: (data: any) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.observer.create}`,
        data
      );
    },
  };

  /**
   * Child related API methods
   */
  public child = {
    list: (params?: any) => {
      return this.api.get(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.child.list}`,
        params
      );
    },
    create: (data: any) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.child.create}`,
        data
      );
    },
  };

  /**
   * Files related API methods
   */
  public files = {
    list: (params?: any) => {
      return this.api.get(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.files.list}`,
        params
      );
    },
    create: (data: any) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.files.create}`,
        data
      );
    },
  };
}

export default StartUtilityAPI;
