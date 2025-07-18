"use client";

import { API_ENDPOINT } from "@constants/api.constant";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { getLocalStorageValue } from "@utils/localStorage";

/**
 * StartAPI Class for handling Next.js internal API routes
 * This class is specifically designed to work with Next.js App Router API routes
 */
class StartAPI {
  private static instance: StartAPI;
  private headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  // Singleton pattern to ensure only one instance exists
  public static getInstance(): StartAPI {
    if (!StartAPI.instance) {
      StartAPI.instance = new StartAPI();
    }
    return StartAPI.instance;
  }

  private constructor() {
    // Initialize with default headers
    this.updateHeaders();
  }

  /**
   * Update headers with authentication token if available
   */
  private updateHeaders(): void {
    const member = getLocalStorageValue(LOCALSTORAGE.START_MEMBER, true);
    if (member?.token) {
      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${member.token}`,
      };
    }
  }

  /**
   * Make a GET request to a Next.js API route
   */
  public async get<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    this.updateHeaders();
    const url = new URL(`${window.location.origin}${endpoint}`);

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.headers,
      credentials: "same-origin",
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a POST request to a Next.js API route
   */
  public async post<T = any>(endpoint: string, data?: any): Promise<T> {
    this.updateHeaders();
    const response = await fetch(`${window.location.origin}${endpoint}`, {
      method: "POST",
      headers: this.headers,
      credentials: "same-origin",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a PUT request to a Next.js API route
   */
  public async put<T = any>(endpoint: string, data?: any): Promise<T> {
    this.updateHeaders();
    const response = await fetch(`${window.location.origin}${endpoint}`, {
      method: "PUT",
      headers: this.headers,
      credentials: "same-origin",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Make a DELETE request to a Next.js API route
   */
  public async delete<T = any>(endpoint: string): Promise<T> {
    this.updateHeaders();
    const response = await fetch(`${window.location.origin}${endpoint}`, {
      method: "DELETE",
      headers: this.headers,
      credentials: "same-origin",
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Handle API response and error cases
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      // Handle unauthorized case
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = API_ENDPOINT.auth.login;
      }

      // Handle token refresh case
      if (response.status === 498 && data.newToken) {
        const member = getLocalStorageValue(LOCALSTORAGE.START_MEMBER, true);
        localStorage.removeItem(LOCALSTORAGE.START_MEMBER);
        localStorage.setItem(
          LOCALSTORAGE.START_MEMBER,
          JSON.stringify({ ...member, token: data.newToken })
        );
        this.headers = {
          ...this.headers,
          Authorization: `Bearer ${data.newToken}`,
        };

        // Retry the request with the new token
        // Note: This would require storing the original request details
        // For now, we'll just return the data with the new token
        return data as T;
      }

      throw {
        status: response.status,
        message: data.error || "Something went wrong",
        data,
      };
    }

    return data as T;
  }
}

export default StartAPI;
