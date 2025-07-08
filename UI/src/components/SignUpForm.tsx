import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  Theme,
} from "@mui/material";

interface SignUpFormProps {
  handleSignUp: (credentials: {
    username: string;
    password: string;
    email: string;
    full_name: string;
    phone_number: string;
  }) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ handleSignUp }) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: isMobile ? "90%" : 375,
        backgroundColor: "transparent",
        borderRadius: 2,
        p: isMobile ? 2 : 4,
        textAlign: "center",
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        fontWeight="bold"
        fontFamily="Rockwell"
        fontSize={isMobile ? 30 : 40}
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
          py: isMobile ? 1 : 1.2,
          borderRadius: 8,
          mt: 2,
        }}
        onClick={() => {
          const credentials = {
            username: "exampleUsername", // Replace with actual form data
            password: "examplePassword", // Replace with actual form data
            email: "exampleEmail", // Replace with actual form data
            full_name: "exampleFullName", // Replace with actual form data
            phone_number: "examplePhoneNumber", // Replace with actual form data
          };
          handleSignUp(credentials);
        }}
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
