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
   * Utility related API methods
   */
  public utility = {
    uploadImage: (data: FormData) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.utility.upload_image}`,
        data
      );
    },
    uploadFile: (data: FormData) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.utility.upload_files}`,
        data
      );
    },
  };

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
    requestPasswordReset: (data: { email: string }) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.auth.request_password_reset}`,
        data
      );
    },
    sendActivationMail: (user_id: string) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.auth.send_activation_mail}/${user_id}`,
        {}
      );
    },

    verifyResetToken: (token: string) => {
      return this.api.get(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.auth.verify_reset_token}/${token}`
      );
    },
    resetPassword: (data: { token: string; password: string }) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.auth.reset_password}`,
        data
      );
    },
    updatePassword: (data: { token: string; password: string }) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.auth.update_password}`,
        data
      );
    },
  };

  /**
   * User related API methods
   */
  public user = {
    list: (params?: any) => {
      return this.api.get(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.user.list}`,
        params
      );
    },
    create: (data: any) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.user.create}`,
        data
      );
    },
    update: (data: any) => {
      return this.api.put(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.user.update}`,
        data
      );
    },
    delete: (user_id: string) => {
      return this.api.delete(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.user.delete}/${user_id}`
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
    update: (organisation_id: string, data: any) => {
      return this.api.put(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.organisation.update}/${organisation_id}`,
        data
      );
    },
    delete: (organisation_id: string) => {
      return this.api.delete(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.organisation.delete}/${organisation_id}`
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
    delete: (observer_id: string) => {
      return this.api.delete(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.observer.delete}/${observer_id}`
      );
    },
    update: (observer_id: string, data: any) => {
      return this.api.put(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.observer.update}/${observer_id}`,
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
    fetch: (child_id: any) => {
      return this.api.get(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.child.fetch}/${child_id}`
      );
    },
  };

  /**
   * Child related API methods
   */
  public credential = {
    create: (data: any) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.credential.create}`,
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
    upload: (data: any) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.files.upload}`,
        data
      );
    },

    downloadPost: (data: any) => {
      return this.api.post(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.files.download}`,
        data
      );
    },
    downloadGet: (data: any) => {
      return this.api.get(
        `${StartUtilityAPI.prefix}${API_ENDPOINT.files.download}`,
        data
      );
    },
  };
}

const startUtilityAPI = new StartUtilityAPI();
export default startUtilityAPI;
