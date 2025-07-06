import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

interface SignUpFormProps {
  handleSignUp: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ handleSignUp }) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 375,
        backgroundColor: "transparent",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        fontFamily="Rockwell"
        fontSize={40}
        sx={{ color: "primary.dark" }}
        gutterBottom
      >
        Sign Up
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        margin="normal"
        variant="outlined"
        slotProps={{
          input: {
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 30,
            },
          },
        }}
      />
      <TextField
        fullWidth
        label="Email address"
        margin="normal"
        variant="outlined"
        slotProps={{
          input: {
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 30,
            },
          },
        }}
      />

      <TextField
        fullWidth
        label="Phone Number"
        margin="normal"
        variant="outlined"
        slotProps={{
          input: {
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 30,
            },
          },
        }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        variant="outlined"
        slotProps={{
          input: {
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 30,
            },
          },
        }}
      />
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        variant="outlined"
        slotProps={{
          input: {
            style: {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 30,
            },
          },
        }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: "primary.main", // orange color
          color: "#ffffff",
          border: "2px solid",
          borderColor: "primary.main",
          py: 1.2,
          borderRadius: 8,
          mt: 2,
        }}
        onClick={handleSignUp}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ color: "primary.contrastText" }}
        >
          Sign Up
        </Typography>
      </Button>
    </Box>
  );
};

export default SignUpForm;
