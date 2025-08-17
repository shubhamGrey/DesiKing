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
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  syncCartWithDatabase: () => Promise<void>;
}

// Helper function to save cart item to database
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

    const cartRequest = {
      id: cartItem.id,
      userId: userId,
      productId: cartItem.productId,
      brandId: cartItem.brandId,
      quantity: cartItem.quantity,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartRequest),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.info?.code !== "200") {
      throw new Error(result.info?.message || "Failed to save cart item");
    }

    console.log("Cart item saved to database successfully");
  } catch (error) {
    console.error("Error saving cart item to database:", error);
    // Continue with local storage as fallback
  }
};

// Helper function to delete cart item from database
const deleteCartItemFromDatabase = async (cartItemId: string): Promise<void> => {
  try {
    const userProfileRaw = sessionStorage.getItem("user_profile");
    if (!userProfileRaw) {
      console.warn("User not logged in, skipping database delete");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Cart/${cartItemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.info?.code !== "200") {
      throw new Error(result.info?.message || "Failed to delete cart item");
    }

    console.log("Cart item deleted from database successfully");
  } catch (error) {
    console.error("Error deleting cart item from database:", error);
    // Continue with local storage as fallback
  }
};

// Helper function to load cart items from database
const loadCartItemsFromDatabase = async (): Promise<CartItem[]> => {
  try {
    const userProfileRaw = sessionStorage.getItem("user_profile");
    if (!userProfileRaw) {
      console.warn("User not logged in, loading from localStorage");
      return [];
    }

    const userProfile = JSON.parse(userProfileRaw);
    const userId = userProfile?.id;

    if (!userId) {
      console.warn("User ID not found, loading from localStorage");
      return [];
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Cart/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.info?.code !== "200") {
      throw new Error(result.info?.message || "Failed to load cart items");
    }

    console.log("Cart items loaded from database successfully");
    return result.data || [];
  } catch (error) {
    console.error("Error loading cart items from database:", error);
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

    console.log("Cart cleared from database successfully");
  } catch (error) {
    console.error("Error clearing cart from database:", error);
  }
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
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

        // Save updated item to database
        const updatedItem = updatedItems.find(item => item.productId === action.payload.productId);
        if (updatedItem) {
          saveCartItemToDatabase(updatedItem);
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
      const itemToRemove = state.items.find(item => item.id === action.payload);
      
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

      // Save updated item to database
      const updatedItem = updatedItems.find(item => item.id === action.payload.id);
      if (updatedItem) {
        saveCartItemToDatabase(updatedItem);
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
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload),
        itemCount: calculateItemCount(action.payload),
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
          dispatch({ type: "LOAD_CART", payload: dbCartItems });
          return;
        }

        // Fallback to localStorage if no database items or user not logged in
        const savedCart = localStorage.getItem("agronexis_cart");
        if (savedCart) {
          const cartItems: CartItem[] = JSON.parse(savedCart);
          dispatch({ type: "LOAD_CART", payload: cartItems });
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Fallback to localStorage
        try {
          const savedCart = localStorage.getItem("agronexis_cart");
          if (savedCart) {
            const cartItems: CartItem[] = JSON.parse(savedCart);
            dispatch({ type: "LOAD_CART", payload: cartItems });
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
      localStorage.setItem("agronexis_cart", JSON.stringify(state.items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
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
        // Merge local cart with database cart
        const mergedItems = [...state.items];
        
        dbCartItems.forEach((dbItem) => {
          const existingLocalItem = mergedItems.find(
            (localItem) => localItem.productId === dbItem.productId
          );
          
          if (existingLocalItem) {
            // Update quantity if item exists locally
            existingLocalItem.quantity = Math.max(existingLocalItem.quantity, dbItem.quantity);
          } else {
            // Add item if it doesn't exist locally
            mergedItems.push(dbItem);
          }
        });

        // Update state with merged items
        dispatch({ type: "LOAD_CART", payload: mergedItems });
        
        // Save all local items to database to ensure sync
        for (const item of mergedItems) {
          await saveCartItemToDatabase(item);
        }
      } else {
        // No database items, sync local items to database
        for (const item of state.items) {
          await saveCartItemToDatabase(item);
        }
      }
    } catch (error) {
      console.error("Error syncing cart with database:", error);
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
