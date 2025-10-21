import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useApiWithoutAuth } from "@/hooks/useApi";

// API response interfaces
interface CountryResponse {
  countryName: string;
  countryCode: string;
}

interface StateResponse {
  stateName: string;
  stateCode: string;
  countryCode: string;
}

export interface AddressFormData {
  fullName: string;
  phoneNumber: string;
  addressLine: string;
  landMark?: string;
  city: string;
  pinCode: string;
  stateCode: string;
  countryCode: string;
  addressType: "SHIPPING" | "BILLING";
}

interface AddressFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (addressData: AddressFormData) => Promise<void>;
  initialData?: Partial<AddressFormData>;
  title?: string;
  addressType?: "SHIPPING" | "BILLING";
}

export const AddressForm: React.FC<AddressFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  title = "Add New Address",
  addressType = "SHIPPING",
}) => {
  const api = useApiWithoutAuth(); // Using without auth since these are public endpoints

  const [formData, setFormData] = useState<AddressFormData>({
    fullName: initialData?.fullName || "",
    phoneNumber: initialData?.phoneNumber || "",
    addressLine: initialData?.addressLine || "",
    landMark: initialData?.landMark || "",
    city: initialData?.city || "",
    pinCode: initialData?.pinCode || "",
    stateCode: initialData?.stateCode || "",
    countryCode: initialData?.countryCode || "IN",
    addressType: addressType,
  });

  const [formErrors, setFormErrors] = useState<Partial<AddressFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dropdown data states
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [states, setStates] = useState<StateResponse[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  // Fetch countries from API using unified API service
  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      setError(null);

      const countries = await api.get<CountryResponse[]>(
        "/Common/GetCountries",
        {},
        {
          onError: () => {
            setError("Failed to load countries. Please try again.");
          },
        }
      );

      setCountries(countries || []);
      console.log("✅ Countries loaded:", countries);
    } catch (error) {
      // Error is already handled by the API hook
      console.error("Failed to fetch countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fetch states based on selected country using unified API service
  const fetchStates = async (countryCode: string) => {
    if (!countryCode) {
      setStates([]);
      return;
    }

    try {
      setLoadingStates(true);
      setError(null);

      const states = await api.get<StateResponse[]>(
        `/Common/GetStates/${countryCode}`,
        {},
        {
          onError: () => {
            setError("Failed to load states. Please try again.");
          },
        }
      );

      setStates(states || []);
      console.log("✅ States loaded:", states);
    } catch (error) {
      // Error is already handled by the API hook
      console.error("Failed to fetch states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  // Load countries when component mounts
  useEffect(() => {
    fetchCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.countryCode) {
      fetchStates(formData.countryCode);
    }
  }, [formData.countryCode]);

  const validateForm = (): boolean => {
    const errors: Partial<AddressFormData> = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber))
      errors.phoneNumber = "Phone number must be 10 digits starting with 6-9";
    if (!formData.addressLine.trim())
      errors.addressLine = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.countryCode.trim())
      errors.countryCode = "Country is required";
    if (!formData.stateCode.trim()) errors.stateCode = "State is required";
    if (!formData.pinCode.trim()) errors.pinCode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pinCode))
      errors.pinCode = "Pincode must be 6 digits";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle country change
  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    const countryCode = event.target.value;
    setFormData((prev) => ({
      ...prev,
      countryCode,
      stateCode: "", // Reset state when country changes
    }));
    if (formErrors.countryCode) {
      setFormErrors((prev) => ({ ...prev, countryCode: undefined }));
    }
    if (formErrors.stateCode) {
      setFormErrors((prev) => ({ ...prev, stateCode: undefined }));
    }
  };

  // Handle state change
  const handleStateChange = (event: SelectChangeEvent<string>) => {
    const stateCode = event.target.value;
    setFormData((prev) => ({ ...prev, stateCode }));
    if (formErrors.stateCode) {
      setFormErrors((prev) => ({ ...prev, stateCode: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(formData);

      // Show success message
      api.showSuccess("Address saved successfully!");

      onClose();
      // Reset form
      setFormData({
        fullName: "",
        phoneNumber: "",
        addressLine: "",
        landMark: "",
        city: "",
        pinCode: "",
        stateCode: "",
        countryCode: "IN",
        addressType: "SHIPPING",
      });
    } catch (error: any) {
      // Use unified error handling
      api.handleError(error, "Failed to save address");
      setError(error.message || "Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Full Name *"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              error={!!formErrors.fullName}
              helperText={formErrors.fullName}
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Phone Number *"
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Only digits
                if (value.length <= 10) {
                  handleInputChange("phoneNumber", value);
                }
              }}
              error={!!formErrors.phoneNumber}
              helperText={formErrors.phoneNumber || "10-digit mobile number"}
              inputProps={{
                maxLength: 10,
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="House No., Building Name, Street, Area *"
              value={formData.addressLine}
              onChange={(e) => handleInputChange("addressLine", e.target.value)}
              error={!!formErrors.addressLine}
              helperText={formErrors.addressLine}
              multiline
              rows={2}
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Landmark (Optional)"
              value={formData.landMark || ""}
              onChange={(e) => handleInputChange("landMark", e.target.value)}
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Pincode *"
              value={formData.pinCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Only digits
                if (value.length <= 6) {
                  handleInputChange("pinCode", value);
                }
              }}
              error={!!formErrors.pinCode}
              helperText={formErrors.pinCode || "6-digit pincode"}
              inputProps={{
                maxLength: 6,
                pattern: "[0-9]*",
                inputMode: "numeric",
              }}
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="City *"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              error={!!formErrors.city}
              helperText={formErrors.city}
              disabled={isLoading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!formErrors.countryCode}>
              <InputLabel id="country-select-label">Country *</InputLabel>
              <Select
                labelId="country-select-label"
                label="Country *"
                value={formData.countryCode}
                onChange={handleCountryChange}
                disabled={isLoading || loadingCountries}
              >
                {loadingCountries ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading countries...
                  </MenuItem>
                ) : (
                  countries.map((country) => (
                    <MenuItem
                      key={country.countryCode}
                      value={country.countryCode}
                    >
                      {country.countryName}
                    </MenuItem>
                  ))
                )}
              </Select>
              {formErrors.countryCode && (
                <Alert severity="error" sx={{ mt: 1, fontSize: "0.75rem" }}>
                  {formErrors.countryCode}
                </Alert>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!formErrors.stateCode}>
              <InputLabel id="state-select-label">State *</InputLabel>
              <Select
                labelId="state-select-label"
                label="State *"
                value={formData.stateCode}
                onChange={handleStateChange}
                disabled={isLoading || loadingStates || !formData.countryCode}
              >
                {!formData.countryCode ? (
                  <MenuItem disabled>Please select a country first</MenuItem>
                ) : loadingStates ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading states...
                  </MenuItem>
                ) : states.length === 0 ? (
                  <MenuItem disabled>No states available</MenuItem>
                ) : (
                  states.map((state) => (
                    <MenuItem key={state.stateCode} value={state.stateCode}>
                      {state.stateName}
                    </MenuItem>
                  ))
                )}
              </Select>
              {formErrors.stateCode && (
                <Alert severity="error" sx={{ mt: 1, fontSize: "0.75rem" }}>
                  {formErrors.stateCode}
                </Alert>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? "Saving..." : "Save Address"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressForm;
