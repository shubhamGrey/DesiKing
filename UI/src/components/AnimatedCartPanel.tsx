"use client";

import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Divider, 
  Button,
  List,
  ListItem,
  Stack,
} from "@mui/material";
import { Close, ShoppingCartOutlined } from "@mui/icons-material";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { playfairDisplay } from "@/styles/fonts";

interface AnimatedCartPanelProps {
  open: boolean;
  onClose: () => void;
}

const AnimatedCartPanel = ({ open, onClose }: AnimatedCartPanelProps) => {
  const { items, itemCount, total, removeItem } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push("/cart");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 400 },
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "primary.main",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ShoppingCartOutlined />
            <Typography 
              variant="h6" 
              fontWeight={700}
              fontFamily={playfairDisplay.style.fontFamily}
            >
              Shopping Cart
            </Typography>
            <Box
              sx={{
                backgroundColor: "secondary.main",
                color: "white",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {itemCount}
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        {items.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              textAlign: "center",
            }}
          >
            <ShoppingCartOutlined sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add some delicious spices to get started!
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                onClose();
                router.push("/products");
              }}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <>
            <List
              sx={{
                flex: 1,
                overflow: "auto",
                p: 2,
              }}
            >
              {items.map((item, index) => (
                <Box key={`${item.id}-${index}`}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 2,
                      alignItems: "flex-start",
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          position: "relative",
                          width: 80,
                          height: 80,
                          flexShrink: 0,
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "#f5f5f5",
                        }}
                      >
                        <Image
                          src={item.image || "/placeholder-image.jpg"}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{
                            mb: 0.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Qty: {item.quantity}
                        </Typography>
                        <Typography variant="body1" color="primary.main" fontWeight={700}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => removeItem(item.id)}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: "error.light",
                            color: "white",
                          },
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </Stack>
                  </ListItem>
                  {index < items.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            {/* Footer with Total and Checkout */}
            <Box
              sx={{
                p: 2.5,
                borderTop: "2px solid",
                borderColor: "divider",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Subtotal:
                </Typography>
                <Typography 
                  variant="h5" 
                  color="primary.main" 
                  fontWeight={700}
                  fontFamily={playfairDisplay.style.fontFamily}
                >
                  ₹{total.toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 700,
                  borderRadius: "10px",
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="text"
                fullWidth
                size="small"
                onClick={onClose}
                sx={{
                  mt: 1,
                  textTransform: "none",
                  color: "text.secondary",
                }}
              >
                Continue Shopping
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default AnimatedCartPanel;
