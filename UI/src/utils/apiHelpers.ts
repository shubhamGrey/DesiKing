// Utility functions for handling API responses
import { Product } from "@/types/product";

export interface ApiResponse<T> {
  info: {
    isSuccess: boolean;
    code: string;
    message: string;
  };
  data: T | null;
  id: string | null;
}

/**
 * Handles API response and extracts data whether it's wrapped or direct
 * @param response - The fetch response
 * @returns The extracted data
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to parse error response for better error message
    try {
      const errorData = await response.json();
      if (errorData && typeof errorData === "object" && "info" in errorData) {
        const apiErrorResponse = errorData as ApiResponse<any>;
        throw new Error(`API Error: ${apiErrorResponse.info.message}`);
      }
    } catch (error) {
      // Fall back to generic error if JSON parsing fails
      console.log(error);
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Check if response is wrapped in standard API response format
  if (data && typeof data === "object" && "info" in data) {
    const apiResponse = data as ApiResponse<T>;

    if (!apiResponse.info.isSuccess) {
      throw new Error(`API Error: ${apiResponse.info.message}`);
    }

    return apiResponse.data as T;
  }

  // Return data directly if not wrapped
  return data as T;
}

/**
 * Fetches a product by ID with proper error handling
 * @param productId - The product ID to fetch
 * @returns Promise<Product>
 */
export async function fetchProductById(productId: string): Promise<Product> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // For server-side only
    }
  );

  return handleApiResponse<Product>(response);
}

/**
 * Fetches products by category ID
 * @param categoryId - The category ID
 * @returns Promise<Product[]>
 */
export async function fetchProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/category/${categoryId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleApiResponse<Product[]>(response);
}
