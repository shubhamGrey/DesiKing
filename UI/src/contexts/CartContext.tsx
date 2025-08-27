"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from "react";

// Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productId: string;
  brandId: string;
  sku?: string;
  maxQuantity?: number;
}

export interface EnhancedCartItem extends CartItem {
  productDetails?: {
    name: string;
    description: string;
    imageUrls: string[];
    thumbnailUrl?: string;
    pricesAndSkus: Array<{
      id: string;
      price: number;
      isDiscounted: boolean;
      discountPercentage: number;
      discountedAmount: number;
      skuNumber: string;
      weightValue: number;
      weightUnit: string;
    }>;
    categoryName: string;
    brandName?: string;
    ingredients: string;
    nutritionalInfo: string;
    keyFeatures: string[];
    uses: string[];
    origin: string;
    shelfLife: string;
    storageInstructions: string;
    certifications: string[];
  };
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity?: number };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[]; skipSave?: boolean };

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  syncCartWithDatabase: () => Promise<void>;
  getEnhancedItems: () => Promise<EnhancedCartItem[]>;
}

// Helper function to fetch product details by productId
const fetchProductDetails = async (productId: string): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching product: ${response.statusText}`);
    }

    const productData = await response.json();
    return productData;
  } catch (error) {
    console.error(`❌ Error fetching product details for ${productId}:`, error);
    return null;
  }
};

// Helper function to save cart item to database (for new items)
const saveCartItemToDatabase = async (cartItem: CartItem): Promise<void> => {
  try {
    const userProfileRaw = sessionStorage.getItem("user_profile");
    if (!userProfileRaw) {
      console.warn("User not logged in, skipping database save");
      return;
    }

    const userProfile = JSON.parse(userProfileRaw);
    const userId = userProfile?.id;

    if (!userId) {
      console.warn("User ID not found, skipping database save");
      return;
    }

    // Generate a GUID for the cart item if it doesn't have one
    const cartItemId = cartItem.id || crypto.randomUUID();

    const cartRequest = {
      id: cartItemId,
      userId: userId,
      productId: cartItem.productId,
      brandId: cartItem.brandId,
      quantity: cartItem.quantity,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": crypto.randomUUID(),
      },
      body: JSON.stringify(cartRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cart API error response:", errorText);
      console.error("Request URL:", `${process.env.NEXT_PUBLIC_API_URL}/Cart`);
      console.error("Request headers:", {
        "Content-Type": "application/json",
        "X-Correlation-ID": crypto.randomUUID(),
      });
      console.error("Request body:", JSON.stringify(cartRequest, null, 2));
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }
    const result = await response.json();

    if (result.info?.code !== "200") {
      throw new Error(result.info?.message || "Failed to save cart item");
    }
  } catch (error) {
    console.error("Error saving cart item to database:", error);
    // Continue with local storage as fallback
  }
};

// Helper function to update existing cart item in database
const updateCartItemToDatabase = async (cartItem: CartItem): Promise<void> => {
  try {
    const userProfileRaw = sessionStorage.getItem("user_profile");
    if (!userProfileRaw) {
      console.warn("User not logged in, skipping database update");
      return;
    }

    const userProfile = JSON.parse(userProfileRaw);
    const userId = userProfile?.id;

    if (!userId) {
      console.warn("User ID not found, skipping database update");
      return;
    }

    const cartRequest = {
      id: cartItem.id,
      userId: userId,
      productId: cartItem.productId,
      brandId: cartItem.brandId,
      quantity: cartItem.quantity,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Cart`, {
      method: "POST", // Backend handles upsert logic
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": crypto.randomUUID(),
      },
      body: JSON.stringify(cartRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cart update API error response:", errorText);
      console.error("Request URL:", `${process.env.NEXT_PUBLIC_API_URL}/Cart`);
      console.error("Request headers:", {
        "Content-Type": "application/json",
        "X-Correlation-ID": crypto.randomUUID(),
      });
      console.error("Request body:", JSON.stringify(cartRequest, null, 2));
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }

    const result = await response.json();

    if (result.info?.code !== "200") {
      throw new Error(result.info?.message || "Failed to update cart item");
    }
  } catch (error) {
    console.error("❌ Error updating cart item in database:", error);
    // Continue with local storage as fallback
  }
};

// Helper function to delete cart item from database
const deleteCartItemFromDatabase = async (
  cartItemId: string
): Promise<void> => {
  try {
    const userProfileRaw = sessionStorage.getItem("user_profile");
    if (!userProfileRaw) {
      console.warn("User not logged in, skipping database delete");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Cart/${cartItemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.info?.code !== "200") {
      throw new Error(result.info?.message || "Failed to delete cart item");
    }
  } catch (error) {
    console.error("Error deleting cart item from database:", error);
    // Continue with local storage as fallback
  }
};

// Helper function to load cart items from database
const loadCartItemsFromDatabase = async (): Promise<CartItem[]> => {
  try {
    // Ensure we're on the client side
    if (typeof window === "undefined") {
      return [];
    }

    const userProfileRaw = sessionStorage.getItem("user_profile");

    if (!userProfileRaw) {
      console.warn("⚠️ User not logged in, loading from localStorage");
      return [];
    }

    const userProfile = JSON.parse(userProfileRaw);
    const userId = userProfile?.id;

    if (!userId) {
      console.warn("⚠️ User ID not found, loading from localStorage");
      return [];
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/Cart/${userId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }

    const result = await response.json();

    if (result.info?.code !== "200") {
      throw new Error(result.info?.message || "Failed to load cart items");
    }

    // Ensure all cart items have valid image URLs and fetch missing product details
    const processedCartItems = await Promise.all(
      (result.data || []).map(async (item: any) => {
        // If item is missing price or name, fetch from product API
        if (!item.price || !item.name) {
          try {
            const productDetails = await fetchProductDetails(item.productId);
            if (productDetails) {
              const price = productDetails.pricesAndSkus?.[0]?.price || 0;
              const name = productDetails.name || "Unknown Product";
              const image =
                productDetails.thumbnailUrl ||
                productDetails.imageUrls?.[0] ||
                "/ProductBackground.png";

              return {
                ...item,
                price: price,
                name: name,
                image: image,
              };
            }
          } catch (error) {
            console.error(
              `❌ Error fetching product details for ${item.productId}:`,
              error
            );
          }
        }

        return {
          ...item,
          image: item.image || "/ProductBackground.png", // Fallback for missing images
          name: item.name || "Unknown Product", // Fallback for missing names
          price: item.price || 0, // Fallback for missing prices
        };
      })
    );

    return processedCartItems;
  } catch (error) {
    console.error("❌ Error loading cart items from database:", error);
    // Fallback to localStorage
    return [];
  }
};

// Helper function to clear all cart items from database
const clearCartInDatabase = async (): Promise<void> => {
  try {
    const userProfileRaw = sessionStorage.getItem("user_profile");
    if (!userProfileRaw) {
      console.warn("User not logged in, skipping database clear");
      return;
    }

    const userProfile = JSON.parse(userProfileRaw);
    const userId = userProfile?.id;

    if (!userId) {
      console.warn("User ID not found, skipping database clear");
      return;
    }

    // Get all cart items for this user and delete them individually
    const cartItems = await loadCartItemsFromDatabase();
    for (const item of cartItems) {
      await deleteCartItemFromDatabase(item.id);
    }
  } catch (error) {
    console.error("Error clearing cart from database:", error);
  }
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // Validate the payload data
      if (!action.payload.productId) {
        console.error("❌ Missing productId in ADD_ITEM payload");
        return state;
      }

      if (!action.payload.name) {
        console.warn("⚠️ Missing name in ADD_ITEM payload");
      }

      if (!action.payload.price || action.payload.price <= 0) {
        console.warn(
          "⚠️ Invalid price in ADD_ITEM payload:",
          action.payload.price
        );
      }

      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      const quantityToAdd = action.payload.quantity ?? 1;

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;
        const maxQty = existingItem.maxQuantity ?? 99;
        const updatedQuantity = Math.min(newQuantity, maxQty);
        const updatedItems = state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: updatedQuantity }
            : item
        );

        // Update existing item in database
        const updatedItem = updatedItems.find(
          (item) => item.productId === action.payload.productId
        );
        if (updatedItem) {
          updateCartItemToDatabase(updatedItem);
        }

        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      } else {
        const newItem: CartItem = {
          ...action.payload,
          id: action.payload.id || crypto.randomUUID(), // Ensure we have a proper GUID
          quantity: quantityToAdd,
        };

        const updatedItems = [...state.items, newItem];

        // Save new item to database
        saveCartItemToDatabase(newItem);

        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      }
    }

    case "REMOVE_ITEM": {
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );

      // Delete item from database
      if (itemToRemove) {
        deleteCartItemFromDatabase(itemToRemove.id);
      }

      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: action.payload.id,
        });
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              quantity: Math.min(
                action.payload.quantity,
                item.maxQuantity ?? 99
              ),
            }
          : item
      );

      // Update existing item in database using the new update function
      const updatedItem = updatedItems.find(
        (item) => item.id === action.payload.id
      );
      if (updatedItem) {
        updateCartItemToDatabase(updatedItem);
      }

      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }

    case "CLEAR_CART": {
      // Clear cart from database
      clearCartInDatabase();

      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    }

    case "LOAD_CART": {
      // If this is initial load (state is empty), just load the items
      // If this is a merge operation, prevent duplicates by productId
      let finalItems: CartItem[];

      if (state.items.length === 0) {
        // Initial load - just use the payload items directly
        finalItems = action.payload.filter((item) => item.productId); // Filter out items without productId
      } else {
        // Merge operation - prevent duplicates
        const currentItems = [...state.items];
        const newItems: CartItem[] = [];

        action.payload.forEach((newItem) => {
          if (!newItem.productId) {
            console.warn("⚠️ Item missing productId, skipping:", newItem);
            return;
          }

          const existingIndex = currentItems.findIndex(
            (item) => item.productId === newItem.productId
          );

          if (existingIndex !== -1) {
            // Update existing item quantity
            currentItems[existingIndex].quantity += newItem.quantity;
          } else {
            // Add new item
            newItems.push(newItem);
          }
        });

        finalItems = [...currentItems, ...newItems];
      }

      // Only save loaded items to database if not explicitly loading from database
      if (!action.skipSave) {
        finalItems.forEach((item: CartItem) => {
          // For new loads, save all items; for merges, handle appropriately
          if (state.items.length === 0) {
            saveCartItemToDatabase(item);
          } else {
            updateCartItemToDatabase(item);
          }
        });
      }

      return {
        ...state,
        items: finalItems,
        total: calculateTotal(finalItems),
        itemCount: calculateItemCount(finalItems),
      };
    }

    default:
      return state;
  }
};

// Helper functions
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from database or localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        // First try to load from database if user is logged in
        const dbCartItems = await loadCartItemsFromDatabase();

        if (dbCartItems.length > 0) {
          dispatch({ type: "LOAD_CART", payload: dbCartItems, skipSave: true });
          return;
        }

        // Fallback to localStorage if no database items or user not logged in
        const savedCart = localStorage.getItem("agronexis_cart");
        if (savedCart) {
          const cartItems: CartItem[] = JSON.parse(savedCart);
          // Ensure all cart items have valid image URLs
          const processedCartItems = cartItems.map((item) => ({
            ...item,
            image: item.image || "/ProductBackground.png", // Fallback for missing images
            name: item.name || "Unknown Product", // Fallback for missing names
          }));
          dispatch({
            type: "LOAD_CART",
            payload: processedCartItems,
            skipSave: true,
          });
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Fallback to localStorage
        try {
          const savedCart = localStorage.getItem("agronexis_cart");
          if (savedCart) {
            const cartItems: CartItem[] = JSON.parse(savedCart);
            dispatch({ type: "LOAD_CART", payload: cartItems, skipSave: true });
          }
        } catch (localError) {
          console.error("Error loading cart from localStorage:", localError);
        }
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      const serializedCart = JSON.stringify(state.items);

      localStorage.setItem("agronexis_cart", serializedCart);

      // Verify it was saved correctly
      const savedVerification = localStorage.getItem("agronexis_cart");
    } catch (error) {
      console.error("❌ Error saving cart to localStorage:", error);
    }
  }, [state.items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      dispatch({ type: "ADD_ITEM", payload: item });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const isInCart = useCallback(
    (productId: string): boolean => {
      return state.items.some((item) => item.productId === productId);
    },
    [state.items]
  );

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = state.items.find((item) => item.productId === productId);
      return item?.quantity ?? 0;
    },
    [state.items]
  );

  const syncCartWithDatabase = useCallback(async (): Promise<void> => {
    try {
      // Load cart items from database
      const dbCartItems = await loadCartItemsFromDatabase();

      if (dbCartItems.length > 0) {
        // Merge local cart with database cart, avoiding duplicates
        const mergedItems = [...state.items];

        dbCartItems.forEach((dbItem) => {
          if (!dbItem.productId) {
            console.warn(
              "⚠️ Database item missing productId, skipping:",
              dbItem
            );
            return;
          }

          const existingLocalIndex = mergedItems.findIndex(
            (localItem) => localItem.productId === dbItem.productId
          );

          if (existingLocalIndex !== -1) {
            // Update quantity if item exists locally (use max to avoid losing items)
            mergedItems[existingLocalIndex].quantity = Math.max(
              mergedItems[existingLocalIndex].quantity,
              dbItem.quantity
            );
          } else {
            // Add item if it doesn't exist locally
            mergedItems.push(dbItem);
          }
        });

        // Update state with merged items (skipSave to avoid recursion)
        dispatch({ type: "LOAD_CART", payload: mergedItems, skipSave: true });

        // Save all items to database to ensure sync
        for (const item of mergedItems) {
          await updateCartItemToDatabase(item);
        }
      } else {
        // No database items, sync all local items to database
        for (const item of state.items) {
          await saveCartItemToDatabase(item);
        }
      }
    } catch (error) {
      console.error("Error syncing cart with database:", error);
    }
  }, [state.items]);

  const getEnhancedItems = useCallback(async (): Promise<
    EnhancedCartItem[]
  > => {
    try {
      const enhancedItems: EnhancedCartItem[] = await Promise.all(
        state.items.map(async (item): Promise<EnhancedCartItem> => {
          const productDetails = await fetchProductDetails(item.productId);

          if (productDetails) {
            return {
              ...item,
              productDetails: {
                name: productDetails.name || item.name,
                description: productDetails.description || "",
                imageUrls: productDetails.imageUrls || [item.image],
                thumbnailUrl: productDetails.thumbnailUrl || item.image,
                pricesAndSkus: productDetails.pricesAndSkus || [],
                categoryName: productDetails.categoryName || "",
                brandName: productDetails.brandName || "",
                ingredients: productDetails.ingredients || "",
                nutritionalInfo: productDetails.nutritionalInfo || "",
                keyFeatures: productDetails.keyFeatures || [],
                uses: productDetails.uses || [],
                origin: productDetails.origin || "",
                shelfLife: productDetails.shelfLife || "",
                storageInstructions: productDetails.storageInstructions || "",
                certifications: productDetails.certifications || [],
              },
            };
          } else {
            // Fallback to cart item data if product fetch fails
            return {
              ...item,
              productDetails: {
                name: item.name,
                description: "",
                imageUrls: [item.image],
                thumbnailUrl: item.image,
                pricesAndSkus: [],
                categoryName: "",
                brandName: "",
                ingredients: "",
                nutritionalInfo: "",
                keyFeatures: [],
                uses: [],
                origin: "",
                shelfLife: "",
                storageInstructions: "",
                certifications: [],
              },
            };
          }
        })
      );

      return enhancedItems;
    } catch (error) {
      console.error("❌ Error getting enhanced items:", error);
      // Return cart items with basic product details as fallback
      return state.items.map((item) => ({
        ...item,
        productDetails: {
          name: item.name,
          description: "",
          imageUrls: [item.image],
          thumbnailUrl: item.image,
          pricesAndSkus: [],
          categoryName: "",
          brandName: "",
          ingredients: "",
          nutritionalInfo: "",
          keyFeatures: [],
          uses: [],
          origin: "",
          shelfLife: "",
          storageInstructions: "",
          certifications: [],
        },
      }));
    }
  }, [state.items]);

  const contextValue: CartContextType = useMemo(
    () => ({
      ...state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
      syncCartWithDatabase,
      getEnhancedItems,
    }),
    [
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
      syncCartWithDatabase,
      getEnhancedItems,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
