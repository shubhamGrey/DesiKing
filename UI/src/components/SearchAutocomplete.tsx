"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  InputAdornment,
  Chip,
  Skeleton,
  useMediaQuery,
  Fade,
  Button,
} from "@mui/material";
import {
  SearchOutlined,
  TrendingUpOutlined,
  CategoryOutlined,
  CloseOutlined,
  ArrowForwardOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import theme from "@/styles/theme";
import { michroma } from "@/styles/fonts";

import { ProductFormData } from "@/types/product";

interface SearchAutocompleteProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function SearchAutocomplete({
  isMobile = false,
  onClose,
}: SearchAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductFormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    }
  }, []);

  // Save to recent searches
  const saveToRecentSearches = (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  // Load products on component mount
  useEffect(() => {
    if (!allProductsLoaded) {
      loadProducts();
    }
  }, [allProductsLoaded]);

  const searchMatchesProduct = (product: Product, query: string): boolean => {
    const matchesName = product.name.toLowerCase().includes(query);
    const matchesDescription = product.description
      .toLowerCase()
      .includes(query);
    const matchesCategory = product.categoryName.toLowerCase().includes(query);
    const matchesFeatures = product.keyFeatures.some((feature) =>
      feature.toLowerCase().includes(query)
    );
    const matchesUses = product.uses.some((use) =>
      use.toLowerCase().includes(query)
    );

    return (
      matchesName ||
      matchesDescription ||
      matchesCategory ||
      matchesFeatures ||
      matchesUses
    );
  };

  // Filter products when search query changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        const query = searchQuery.toLowerCase();
        const filtered = products.filter((product) =>
          searchMatchesProduct(product, query)
        );
        setFilteredProducts(filtered.slice(0, 8)); // Limit to 8 results
        setShowDropdown(true);
      } else if (searchQuery.trim().length > 0) {
        setFilteredProducts([]);
        setShowDropdown(true); // Show dropdown with "keep typing" message
      } else {
        setFilteredProducts([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, products]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: Product[] = await response.json();
      setProducts(data);
      setAllProductsLoaded(true);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    saveToRecentSearches(searchQuery);
    router.push(`/product/${productId}`);
    setSearchQuery("");
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (onClose) {
      onClose();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    // Show dropdown when focused, even with empty query (to show recent/popular searches)
    setShowDropdown(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (event.key) {
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      case "ArrowDown":
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredProducts.length - 1
        );
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && filteredProducts[selectedIndex]) {
          handleProductClick(filteredProducts[selectedIndex].id);
        } else if (searchQuery.trim()) {
          handleSearch();
        }
        break;
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveToRecentSearches(searchQuery);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowDropdown(false);
      setSelectedIndex(-1);
      if (onClose) {
        onClose();
      }
    }
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setShowDropdown(false);
    if (onClose) {
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent_searches");
  };

  return (
    <Box ref={searchRef} sx={{ position: "relative", width: "100%" }}>
      <TextField
        ref={inputRef}
        fullWidth
        placeholder="Search products, spices, categories..."
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        variant="outlined"
        size={isMobile ? "medium" : "small"}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading ? (
                <Skeleton
                  variant="circular"
                  width={20}
                  height={20}
                  animation="pulse"
                />
              ) : (
                <SearchOutlined sx={{ color: "inherit", opacity: 0.7 }} />
              )}
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <CloseOutlined
                sx={{
                  color: "inherit",
                  opacity: 0.7,
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  "&:hover": { opacity: 1 },
                }}
                onClick={() => {
                  setSearchQuery("");
                  setShowDropdown(false);
                  inputRef.current?.focus();
                }}
              />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: isMobile
              ? "rgba(255,255,255,0.15)"
              : "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: isMobile
                ? "rgba(255,255,255,0.25)"
                : "rgba(255,255,255,0.2)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(255,255,255,0.25)",
              transform: "translateY(-1px)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "1px solid rgba(255,255,255,0.4)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "2px solid rgba(255,255,255,0.6)",
            },
            color: "inherit",
            borderRadius: "12px",
          },
        }}
        sx={{
          "& .MuiInputBase-input::placeholder": {
            color: "inherit",
            opacity: 0.7,
            fontWeight: 400,
          },
        }}
      />

      {/* Enhanced Dropdown */}
      {showDropdown && (
        <Fade in={showDropdown} timeout={200}>
          <Paper
            elevation={12}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 2000,
              maxHeight: isSmallScreen ? "70vh" : "500px",
              overflowY: "auto",
              overflowX: "hidden",
              mt: 1,
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: "16px",
              background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2)",
            }}
          >
            {/* Search Results */}
            {filteredProducts.length > 0 && renderSearchResults()}

            {/* Recent and Popular Searches (when no query) */}
            {filteredProducts.length === 0 &&
              searchQuery.trim().length === 0 &&
              renderEmptyState()}

            {/* No Results (when query but no matches) */}
            {filteredProducts.length === 0 &&
              searchQuery.trim().length > 0 &&
              renderNoResults()}
          </Paper>
        </Fade>
      )}
    </Box>
  );

  // Render search results
  function renderSearchResults() {
    return (
      <>
        {/* Results Header */}
        <Box
          sx={{
            p: 2,
            pb: 1,
            borderBottom: "1px solid",
            borderColor: "grey.100",
            background: "linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SearchOutlined fontSize="small" />
            Found {filteredProducts.length} result
            {filteredProducts.length > 1 ? "s" : ""}
          </Typography>
        </Box>

        <List sx={{ p: 0, width: "100%", overflow: "hidden" }}>
          {filteredProducts.map((product, index) => (
            <ListItem
              key={product.id}
              component="div"
              onClick={() => handleProductClick(product.id)}
              sx={{
                background:
                  selectedIndex === index
                    ? "linear-gradient(90deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.04) 100%)"
                    : "transparent",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.04) 100%)",
                  transform: "translateX(4px)",
                },
                borderBottom:
                  index < filteredProducts.length - 1 ? "1px solid" : "none",
                borderColor: "grey.100",
                py: 2,
                px: 3,
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
                width: "100%",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: selectedIndex === index ? "4px" : "0px",
                  backgroundColor: "primary.main",
                  transition: "width 0.2s ease",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 56,
                    height: 56,
                    mr: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    border: "2px solid",
                    borderColor: "grey.100",
                  }}
                >
                  {product.thumbnailUrl ?? product.imageUrls[0] ? (
                    <Image
                      src={product.thumbnailUrl ?? product.imageUrls[0]}
                      alt={product.name}
                      width={56}
                      height={56}
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "grey.200",
                        fontSize: "12px",
                        color: "grey.600",
                      }}
                    >
                      No Image
                    </Box>
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                }}
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontFamily: michroma.style.fontFamily,
                      fontSize: "0.95rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                      mb: 0.5,
                    }}
                  >
                    {product.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ width: "100%", overflow: "hidden" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 0.5,
                        fontSize: "0.85rem",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "100%",
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      <CategoryOutlined
                        sx={{
                          fontSize: "0.9rem",
                          color: "primary.main",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          fontSize: "0.75rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {product.categoryName}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <ArrowForwardOutlined
                sx={{
                  color: "grey.400",
                  fontSize: "1.2rem",
                  opacity: 0.6,
                  transition: "all 0.2s ease",
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* View All Results */}
        {filteredProducts.length >= 8 && (
          <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "grey.100" }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSearch}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                py: 1,
              }}
            >
              View all results for &ldquo;{searchQuery}&rdquo;
            </Button>
          </Box>
        )}
      </>
    );
  }

  // Render empty state with recent and popular searches
  function renderEmptyState() {
    return (
      <Box>
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <TrendingUpOutlined fontSize="small" />
                Recent Searches
              </Typography>
              <Button
                size="small"
                onClick={clearRecentSearches}
                sx={{
                  minWidth: "auto",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                Clear
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {recentSearches.map((search) => (
                <Chip
                  key={search}
                  label={search}
                  onClick={() => handleRecentSearchClick(search)}
                  size="small"
                  variant="outlined"
                  sx={{
                    "&:hover": {
                      backgroundColor: "primary.50",
                      borderColor: "primary.main",
                    },
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  function renderNoResults() {
    if (searchQuery.trim().length >= 2) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <SearchOutlined
            sx={{
              fontSize: 64,
              color: "grey.300",
              mb: 2,
              opacity: 0.7,
            }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try searching with different keywords or browse our categories
          </Typography>
        </Box>
      );
    } else if (searchQuery.trim().length > 0) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <SearchOutlined
            sx={{
              fontSize: 48,
              color: "grey.400",
              mb: 2,
              opacity: 0.7,
            }}
          />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            Keep typing...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter at least 2 characters to search
          </Typography>
        </Box>
      );
    }
    return null;
  }
}
