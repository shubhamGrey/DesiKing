import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  Chip,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  LocationOn,
  Home,
  Business,
} from "@mui/icons-material";
import AddressForm, { AddressFormData } from "./AddressForm";

// Address interfaces
export interface AddressResponse {
  id: string;
  userId: string;
  fullAddress: string;
}

export interface ApiResponse<T> {
  info: {
    isSuccess: boolean;
    code: string;
    message: string;
  };
  data: T;
  id: string;
}

interface AddressManagerProps {
  userId: string;
  onAddressSelect?: (address: AddressResponse) => void;
  showSelectionMode?: boolean;
  selectedAddressId?: string;
  hideAddNewButton?: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  userId,
  onAddressSelect,
  showSelectionMode = false,
  selectedAddressId,
  hideAddNewButton = false,
}) => {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    addressId: string;
  }>({ open: false, addressId: "" });
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/address/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Get addresses API error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }

      const result: ApiResponse<AddressResponse[]> = await response.json();

      if (result.info?.code !== "200") {
        throw new Error(result.info?.message || "Failed to get addresses");
      }

      console.log("✅ Addresses retrieved successfully:", result.data);
      setAddresses(result.data || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setError("Failed to load addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, fetchAddresses]);

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Delete address API error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }

      const result: ApiResponse<boolean> = await response.json();

      if (result.info?.code !== "200") {
        throw new Error(result.info?.message || "Failed to delete address");
      }

      console.log("✅ Address deleted successfully");
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      setDeleteDialog({ open: false, addressId: "" });
    } catch (error) {
      console.error("Failed to delete address:", error);
      setError("Failed to delete address. Please try again.");
    }
  };

  const handleAddressSelect = (address: AddressResponse) => {
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  const handleSaveAddress = async (addressData: AddressFormData) => {
    try {
      const payload = {
        id: "00000000-0000-0000-0000-000000000000", // New address
        userId: userId,
        fullName: addressData.fullName,
        phoneNumber: addressData.phoneNumber,
        addressLine: addressData.addressLine,
        landMark: addressData.landMark || "",
        city: addressData.city,
        pinCode: addressData.pinCode,
        stateCode: addressData.stateCode,
        countryCode: addressData.countryCode,
        addressType: addressData.addressType,
        isActive: true,
        isDeleted: false,
      };

      console.log("🚀 Saving address:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Address save API error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }

      const result: ApiResponse<string> = await response.json();

      if (result.info?.code !== "200") {
        throw new Error(result.info?.message || "Failed to save address");
      }

      console.log("✅ Address saved successfully:", result.data);

      // Refresh the addresses list
      await fetchAddresses();

      setShowAddForm(false);
    } catch (error: any) {
      console.error("❌ Error saving address:", error);
      throw error;
    }
  };

  const getAddressTypeIcon = (fullAddress: string) => {
    // Simple logic to determine address type based on content
    if (
      fullAddress.toLowerCase().includes("office") ||
      fullAddress.toLowerCase().includes("company") ||
      fullAddress.toLowerCase().includes("business")
    ) {
      return <Business color="primary" />;
    }
    return <Home color="primary" />;
  };

  const getAddressTypeLabel = (fullAddress: string) => {
    if (
      fullAddress.toLowerCase().includes("office") ||
      fullAddress.toLowerCase().includes("company") ||
      fullAddress.toLowerCase().includes("business")
    ) {
      return "Business";
    }
    return "Home";
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Your Addresses
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((item) => (
            <Grid size={{ xs: 12, md: 6 }} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={20}
                    sx={{ mt: 1 }}
                  />
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="60%" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6">Your Addresses</Typography>
        {!hideAddNewButton && (
          <Button
            variant="outlined"
            startIcon={<Add />}
            size="small"
            onClick={() => setShowAddForm(true)}
          >
            Add New Address
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {addresses.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <LocationOn sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No addresses saved
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add an address to save it for future orders
            </Typography>
            {!hideAddNewButton && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowAddForm(true)}
              >
                Add Your First Address
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {addresses.map((address) => (
            <Grid size={{ xs: 12, md: 6 }} key={address.id}>
              <Card
                sx={{
                  cursor: showSelectionMode ? "pointer" : "default",
                  border:
                    showSelectionMode && selectedAddressId === address.id
                      ? 2
                      : 1,
                  borderColor:
                    showSelectionMode && selectedAddressId === address.id
                      ? "primary.main"
                      : "grey.300",
                  "&:hover": showSelectionMode
                    ? {
                        borderColor: "primary.main",
                        boxShadow: 1,
                      }
                    : {},
                }}
                onClick={() =>
                  showSelectionMode && handleAddressSelect(address)
                }
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {getAddressTypeIcon(address.fullAddress)}
                      <Chip
                        label={getAddressTypeLabel(address.fullAddress)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    {!showSelectionMode && (
                      <Box>
                        <IconButton size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              addressId: address.id,
                            })
                          }
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ overflowWrap: "break-word" }}
                  >
                    {address.fullAddress}
                  </Typography>

                  {showSelectionMode && selectedAddressId === address.id && (
                    <Chip
                      label="Selected"
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, addressId: "" })}
      >
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this address? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, addressId: "" })}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteAddress(deleteDialog.addressId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Address Form Dialog */}
      <AddressForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleSaveAddress}
        title="Add New Address"
      />
    </Box>
  );
};

export default AddressManager;
