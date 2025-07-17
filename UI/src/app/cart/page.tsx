"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stack,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import Image from "next/image";
import theme from "@/styles/theme";
import { michroma } from "@/styles/fonts";

// Helper function to check if image needs to be unoptimized
const shouldUnoptimizeImage = (imageSrc: string): boolean => {
  return imageSrc.includes("cloud.agronexis.com");
}; // Import michroma font style
import EmptyCart from "@/components/EmptyCart"; // Import EmptyCart component

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const cartItems: CartItem[] = [
    // {
    //   name: "Portable Stereo Speaker",
    //   price: 250.49,
    //   quantity: 1,
    //   image: "/images/speaker.png",
    // },
    // {
    //   name: "i-Type Instant Camera",
    //   price: 630.2,
    //   quantity: 2,
    //   image: "/images/camera.png",
    // },
    // {
    //   name: "Positive Vibration ANC",
    //   price: 320.0,
    //   quantity: 1,
    //   image: "/images/headphones.png",
    // },
  ];

  const subtotal: number = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return <EmptyCart />; // Render EmptyCart component if cart is empty
  }

  return (
    <Box sx={{ mt: isMobile ? 8 : 12, mb: 6, px: isMobile ? 2 : 4 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontFamily={michroma.style.fontFamily} // Apply michroma font style
        fontWeight={600}
        color="primary.main"
        sx={{ mb: 4 }}
      >
        Cart
      </Typography>
      <Grid container spacing={4}>
        {/* Left Column: Delivery Info and Payment Method */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              mb: 4,
              backgroundColor: "transparent",
              boxShadow: "none",
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontFamily={michroma.style.fontFamily} // Apply michroma font style
                color="primary.main"
                sx={{ mb: 3 }}
              >
                Delivery Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    size="small"
                    placeholder="Enter your name"
                    defaultValue="Bryan Cranston"
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    label="Mobile Number"
                    fullWidth
                    size="small"
                    placeholder="Enter your mobile number"
                    defaultValue="+1 424-236-3574"
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    size="small"
                    placeholder="Enter your email"
                    defaultValue="thejon.l"
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    label="City"
                    fullWidth
                    size="small"
                    placeholder="Enter your city"
                    defaultValue="Hawthorne"
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="State"
                    fullWidth
                    size="small"
                    placeholder="Enter your state"
                    defaultValue="California"
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="ZIP"
                    fullWidth
                    size="small"
                    placeholder="Enter your ZIP code"
                    defaultValue="90250"
                  />
                </Grid>
                <Grid size={4}>
                  <TextField
                    label="State"
                    select
                    fullWidth
                    size="small"
                    SelectProps={{ native: true }}
                    defaultValue="CA"
                  >
                    <option value="CA">CA</option>
                    <option value="TX">TX</option>
                  </TextField>
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Address"
                    fullWidth
                    size="small"
                    placeholder="Enter your address"
                    defaultValue="4796 Libby Street"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card
            sx={{
              mb: 4,
              backgroundColor: "transparent",
              boxShadow: "none",
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontFamily={michroma.style.fontFamily} // Apply michroma font style
                color="primary.main"
                sx={{ mb: 3 }}
              >
                Payment Method
              </Typography>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="credit"
                  control={<Radio />}
                  label="Credit Card"
                />
                <FormControlLabel
                  value="debit"
                  control={<Radio />}
                  label="Debit Card"
                />
                <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                <FormControlLabel
                  value="netbanking"
                  control={<Radio />}
                  label="Internet Banking"
                />
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
              </RadioGroup>
              <Box mt={2}>
                {paymentMethod === "credit" && (
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <TextField
                        label="Card Number"
                        fullWidth
                        size="small"
                        placeholder="Enter your card number"
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        label="Expiry Date (MM/YY)"
                        fullWidth
                        size="small"
                        placeholder="MM/YY"
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        label="CVV"
                        fullWidth
                        size="small"
                        placeholder="Enter CVV"
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label="Name on Card"
                        fullWidth
                        size="small"
                        placeholder="Enter name on card"
                      />
                    </Grid>
                  </Grid>
                )}
                {paymentMethod === "debit" && (
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <TextField
                        label="Card Number"
                        fullWidth
                        size="small"
                        placeholder="Enter your card number"
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        label="Expiry Date (MM/YY)"
                        fullWidth
                        size="small"
                        placeholder="MM/YY"
                      />
                    </Grid>
                    <Grid size={6}>
                      <TextField
                        label="CVV"
                        fullWidth
                        size="small"
                        placeholder="Enter CVV"
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        label="Name on Card"
                        fullWidth
                        size="small"
                        placeholder="Enter name on card"
                      />
                    </Grid>
                  </Grid>
                )}
                {paymentMethod === "upi" && (
                  <TextField
                    label="UPI ID"
                    fullWidth
                    size="small"
                    placeholder="Enter your UPI ID"
                  />
                )}
                {paymentMethod === "netbanking" && (
                  <TextField
                    label="Bank Name"
                    select
                    fullWidth
                    size="small"
                    SelectProps={{ native: true }}
                  >
                    <option value="">Select Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                  </TextField>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Order Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              mb: 4,
              backgroundColor: "transparent",
              boxShadow: "none",
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontFamily={michroma.style.fontFamily} // Apply michroma font style
                color="primary.main"
                sx={{ mb: 3 }}
              >
                Order Summary
              </Typography>
              <Stack spacing={2}>
                {cartItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        unoptimized={shouldUnoptimizeImage(item.image)}
                        style={{ borderRadius: "6px" }}
                      />
                      <Box>
                        <Typography fontWeight={500}>{item.name}</Typography>
                        <Typography variant="body2">
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography>x{item.quantity}</Typography>
                  </Box>
                ))}

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Shipping</Typography>
                  <Typography>--</Typography>
                </Box>

                <Divider />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                  }}
                >
                  <Typography>Total (USD)</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
                >
                  Confirm Order
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cart;
