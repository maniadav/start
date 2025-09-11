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
    // Don't set Content-Type by default - let it be set per request based on data type
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
   * Get appropriate headers for the request based on data type
   */
  private getRequestHeaders(data?: any): HeadersInit {
    const headers: HeadersInit = { ...this.headers };

    // Set Content-Type based on data type
    if (data instanceof FormData) {
      // Don't set Content-Type for FormData - browser will set it automatically with boundary
      delete (headers as any)["Content-Type"];
    } else if (data && typeof data === "object") {
      // For JSON data, set application/json
      (headers as any)["Content-Type"] = "application/json";
    }

    return headers;
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

    return this.handleResponse<T>(response, { method: "GET", url: endpoint });
  }

  /**
   * Make a POST request to a Next.js API route
   */
  public async post<T = any>(endpoint: string, data?: any): Promise<T> {
    this.updateHeaders();

    const headers = this.getRequestHeaders(data);

    const response = await fetch(`${window.location.origin}${endpoint}`, {
      method: "POST",
      headers,
      credentials: "same-origin",
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });

    return this.handleResponse<T>(response, {
      method: "POST",
      url: endpoint,
      data,
    });
  }

  /**
   * Make a PUT request to a Next.js API route
   */
  public async put<T = any>(endpoint: string, data?: any): Promise<T> {
    this.updateHeaders();

    const headers = this.getRequestHeaders(data);

    const response = await fetch(`${window.location.origin}${endpoint}`, {
      method: "PUT",
      headers,
      credentials: "same-origin",
      body: data
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : undefined,
    });

    return this.handleResponse<T>(response, {
      method: "PUT",
      url: endpoint,
      data,
    });
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

    return this.handleResponse<T>(response, {
      method: "DELETE",
      url: endpoint,
    });
  }

  /**
   * Handle API response and error cases
   */
  private async handleResponse<T>(
    response: Response,
    originalRequest?: { method: string; url: string; data?: any }
  ): Promise<T> {
    if (response.status === 204) {
      return {} as T;
    }

    // Check if response is binary (like ZIP files)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/zip")) {
      // For ZIP files, return the response object directly so we can call .blob() on it
      return response as T;
    }

    // For JSON responses, parse as usual
    const data = await response.json();

    if (!response.ok) {
      // invalid refresh token
      console.log("response.status", response);
      if (response.status === HttpStatusCode.Unauthorized) {
        clearLocalStorageValue();
        await clearEntireIndexedDB();
        window.location.href = PAGE_ROUTES.LOGIN.path;
      }

      // Handle token refresh case
      if (response.status === HttpStatusCode.Forbidden) {
        // Try to get a new access token using refresh token
        const member = getLocalStorageValue(LOCALSTORAGE.START_MEMBER, true);
        const refreshToken = member?.rtoken;

        if (refreshToken) {
          try {
            const tokenResponse = await fetch(
              `${window.location.origin}/api/v1/auth/get-access-token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${refreshToken}`,
                },
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

              // Retry the original request with the new token
              if (originalRequest) {
                console.log(
                  "Retrying request with new token:",
                  originalRequest
                );
                switch (originalRequest.method) {
                  case "GET":
                    return await this.get<T>(originalRequest.url);
                  case "POST":
                    return await this.post<T>(
                      originalRequest.url,
                      originalRequest.data
                    );
                  case "PUT":
                    return await this.put<T>(
                      originalRequest.url,
                      originalRequest.data
                    );
                  case "DELETE":
                    return await this.delete<T>(originalRequest.url);
                  default:
                    throw new Error(
                      `Unsupported method: ${originalRequest.method}`
                    );
                }
              }
            } else {
              console.error("Token refresh failed:", {
                status: tokenResponse.status,
                data: tokenData,
              });
              clearLocalStorageValue();
              await clearEntireIndexedDB();
              window.location.href = PAGE_ROUTES.LOGIN.path;
            }
          } catch (e) {
            console.error("Token refresh failed:", e);
            // If refresh fails, logout
            clearLocalStorageValue();
            await clearEntireIndexedDB();
            window.location.href = PAGE_ROUTES.LOGIN.path;
          }
        } else {
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
