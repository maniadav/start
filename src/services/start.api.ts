"use client";
import { PAGE_ROUTES } from "@constants/route.constant";
import { LOCALSTORAGE } from "@constants/storage.constant";
import { clearEntireIndexedDB } from "@utils/indexDB";
import {
  clearLocalStorageValue,
  getLocalStorageValue,
} from "@utils/localStorage";
import { HttpStatusCode } from "enums/HttpStatusCode";

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
      // invalid refresh tokenU
      if (response.status === HttpStatusCode.Unauthorized) {
        clearLocalStorageValue();
        await clearEntireIndexedDB();
        window.location.href = PAGE_ROUTES.LOGIN.path;
      }

      // Handle token refresh case
      if (response.status === HttpStatusCode.Forbidden) {
        // Try to get a new access token using refresh token
        const member = getLocalStorageValue(LOCALSTORAGE.START_MEMBER, true);
        const refreshToken = member?.rToken;
        if (refreshToken) {
          try {
            const tokenResponse = await fetch(
              `${window.location.origin}/api/v1/auth/get-access-token`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
              }
            );
            const tokenData = await tokenResponse.json();
            if (tokenResponse.ok && tokenData.accessToken) {
              // Update local storage and headers
              localStorage.setItem(
                LOCALSTORAGE.START_MEMBER,
                JSON.stringify({ ...member, token: tokenData.accessToken })
              );
              this.headers = {
                ...this.headers,
                Authorization: `Bearer ${tokenData.accessToken}`,
              };
              // Retry the original request
              // Note: Only supports GET/POST/PUT/DELETE as implemented
              // You may want to refactor for more generic retry logic
              // For GET requests
              if (response.url.includes("GET")) {
                return await this.get<T>(new URL(response.url).pathname);
              }
              // For POST requests
              if (response.url.includes("POST")) {
                return await this.post<T>(new URL(response.url).pathname, data);
              }
              // For PUT requests
              if (response.url.includes("PUT")) {
                return await this.put<T>(new URL(response.url).pathname, data);
              }
              // For DELETE requests
              if (response.url.includes("DELETE")) {
                return await this.delete<T>(new URL(response.url).pathname);
              }
            }
          } catch (e) {
            // If refresh fails, logout
            clearLocalStorageValue();
            await clearEntireIndexedDB();
            window.location.href = PAGE_ROUTES.LOGIN.path;
          }
        } else {
          // No refresh token, logout
          clearLocalStorageValue();
          await clearEntireIndexedDB();
          window.location.href = PAGE_ROUTES.LOGIN.path;
        }
      }

      throw {
        status: response.status,
        message: data.error || data.message || "client: Something went wrong",
        data,
      };
    }

    return data as T;
  }
}

export default StartAPI;
