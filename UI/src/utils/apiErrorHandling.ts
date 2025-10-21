/**
 * Enhanced API error handling utilities
 * Provides comprehensive error handling for the new API response format
 */

import { CustomError, AuthenticationError } from "@/types/errors";
import { ApiResponse } from "@/services/apiService";

/**
 * Process API response and handle both success and error cases
 * @param response - Raw response from fetch
 * @returns Parsed data or throws appropriate error
 */
export async function processApiResponse<T>(response: Response): Promise<T> {
  let responseData: any;

  try {
    responseData = await response.json();
  } catch (error) {
    // If response is not JSON, handle as HTTP error
    if (!response.ok) {
      throw new CustomError(
        `HTTP ${response.status}: ${response.statusText}`,
        "HTTP_ERROR",
        response.status
      );
    }
    throw new CustomError("Invalid response format", "PARSE_ERROR", 500);
  }

  // Check if response follows the standard API format
  if (
    responseData &&
    typeof responseData === "object" &&
    "info" in responseData
  ) {
    const apiResponse = responseData as ApiResponse<T>;

    // Handle error cases where isSuccess is false
    if (!apiResponse.info.isSuccess) {
      const statusCode = parseInt(apiResponse.info.code);
      const errorMessage = apiResponse.info.message;
      const correlationId = apiResponse.id || undefined;

      // Create specific error types based on status code
      switch (statusCode) {
        case 400:
          throw new CustomError(
            errorMessage,
            "VALIDATION_ERROR",
            400,
            correlationId
          );
        case 401:
          throw new AuthenticationError(errorMessage, correlationId);
        case 403:
          throw new CustomError(
            errorMessage,
            "AUTHORIZATION_ERROR",
            403,
            correlationId
          );
        case 404:
          throw new CustomError(
            errorMessage,
            "NOT_FOUND_ERROR",
            404,
            correlationId
          );
        case 409:
          throw new CustomError(
            errorMessage,
            "CONFLICT_ERROR",
            409,
            correlationId
          );
        case 422:
          throw new CustomError(
            errorMessage,
            "VALIDATION_ERROR",
            422,
            correlationId
          );
        case 500:
        case 502:
        case 503:
        case 504:
          throw new CustomError(
            errorMessage,
            "SERVER_ERROR",
            statusCode,
            correlationId
          );
        default:
          throw new CustomError(
            errorMessage,
            "API_ERROR",
            statusCode,
            correlationId
          );
      }
    }

    // Return data for successful responses
    return apiResponse.data as T;
  }

  // For non-standard responses, check HTTP status
  if (!response.ok) {
    throw new CustomError(
      `HTTP ${response.status}: ${response.statusText}`,
      "HTTP_ERROR",
      response.status
    );
  }

  // Return raw data if not in standard format but successful
  return responseData as T;
}

/**
 * Enhanced fetch wrapper with proper error handling
 * @param url - Request URL
 * @param options - Fetch options
 * @returns Promise with typed data or throws CustomError
 */
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    return await processApiResponse<T>(response);
  } catch (error) {
    // Re-throw CustomErrors as-is
    if (error instanceof CustomError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new CustomError(
        "Network connection failed. Please check your internet connection.",
        "NETWORK_ERROR",
        0
      );
    }

    // Handle timeout errors
    if (error instanceof Error && error.name === "AbortError") {
      throw new CustomError(
        "Request timeout. Please try again.",
        "TIMEOUT_ERROR",
        0
      );
    }

    // Handle other errors
    throw new CustomError(
      error instanceof Error ? error.message : "Unknown error occurred",
      "UNKNOWN_ERROR",
      500
    );
  }
}

/**
 * Example usage of the error handling
 */
export class ExampleApiUsage {
  static async fetchUser(userId: string) {
    try {
      const user = await apiRequest<{ name: string; email: string }>(
        `/api/users/${userId}`
      );
      return user;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        console.log("User needs to login");
        // Redirect to login
      } else if (error instanceof CustomError) {
        switch (error.code) {
          case "NOT_FOUND_ERROR":
            console.log("User not found");
            break;
          case "VALIDATION_ERROR":
            console.log("Invalid user ID format");
            break;
          case "NETWORK_ERROR":
            console.log("Network issue, please try again");
            break;
          default:
            console.log("An error occurred:", error.message);
        }
      }
      throw error; // Re-throw for caller to handle if needed
    }
  }

  static async createUser(userData: { name: string; email: string }) {
    try {
      const newUser = await apiRequest<{
        id: string;
        name: string;
        email: string;
      }>("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      console.log("User created successfully:", newUser);
      return newUser;
    } catch (error) {
      if (error instanceof CustomError) {
        if (error.code === "VALIDATION_ERROR") {
          console.log("Please check your input:", error.message);
        } else if (error.code === "CONFLICT_ERROR") {
          console.log("User already exists with this email");
        }
      }
      throw error;
    }
  }
}
