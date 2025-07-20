"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputLabel,
  Skeleton,
  useMediaQuery,
  IconButton,
  Stack,
} from "@mui/material";
import {
  ArrowForward,
  Email,
  Facebook,
  Instagram,
  LinkedIn,
  LocationOn,
  Phone,
  YouTube,
} from "@mui/icons-material";
import { michroma } from "@/styles/fonts";
import theme from "@/styles/theme";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BrandLogo from "../../../public/AgroNexisWhite.png";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "sendEmail",
            name: [data.firstName, data.lastName].join(" "),
            email: data.email,
            message: data.message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const result = await response.json();
      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    setIsSubmitting(false);
    reset();
  };

  const socialMedia = [
    {
      icon: <Instagram fontSize="large" />,
      href: "https://www.instagram.com/agronexis/?__pwa=1",
    },
    {
      icon: <YouTube fontSize="large" />,
      href: "https://www.youtube.com/@AgroNexisIndiaOverseasPrivateL",
    },
    {
      icon: <Facebook fontSize="large" />,
      href: "https://www.facebook.com/profile.php?id=61575821300609",
    },
    {
      icon: <LinkedIn fontSize="large" />,
      href: "https://www.linkedin.com/in/aniopl",
    },
  ];

  const contactDetails = [
    {
      label: "care@agronexis.com",
      icon: <Email fontSize="small" />,
      href: "mailto:care@agronexis.com",
    },
    {
      label: "Plot 29G/1, Kaushik Building, Mehrauli, New Delhi 110030",
      icon: <LocationOn fontSize="small" />,
    },
    {
      label: "+91 95820 00963",
      icon: <Phone fontSize="small" />,
      href: "tel:+919582000963",
    },
  ];

  return (
    <Grid container spacing={0}>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          p: isMobile ? 4 : 12,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "primary.main",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant={isMobile ? "h3" : "h2"}
            color="primary.contrastText"
            sx={{ mb: 2, textAlign: "left" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
          >
            We&apos;d love to hear from you!
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              my: 8,
            }}
          >
            <Image src={BrandLogo} alt="Brand Logo" height={316} width={300} />
          </Box>
          <Stack direction={"column"} spacing={2} alignItems="center">
            <Typography
              variant="h4"
              color="primary.contrastText"
              sx={{ mb: 4, textAlign: "left", width: "100%" }}
              fontFamily={michroma.style.fontFamily}
              fontWeight={600}
              textAlign={"left"}
            >
              Let&apos;s Get In Touch
            </Typography>
            {contactDetails.map((item) => (
              <Box
                sx={{
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  mb: 1.5,
                  cursor: item.href ? "pointer" : "default",
                  width: "100%",
                }}
                key={item.label}
                onClick={() => {
                  if (item.href) {
                    router.push(item.href);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                {item.icon}
                <Typography
                  key={item.label}
                  variant="body1"
                  sx={{ ml: 1.5, color: "primary.contrastText" }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
        <Box sx={{ height: 200 }}></Box>
      </Grid>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          p: isMobile ? 4 : 12,
          overflowY: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="h3"
            sx={{ mb: 6 }}
            color="primary.main"
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
            textAlign={"center"}
          >
            Contact us
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputLabel
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 1,
                  }}
                >
                  First Name
                </InputLabel>
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      variant="filled"
                      placeholder="Enter your first name"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <InputLabel
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 1,
                  }}
                >
                  Last Name
                </InputLabel>
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      variant="filled"
                      placeholder="Enter your last name"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InputLabel
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 1,
                  }}
                >
                  Email
                </InputLabel>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="email"
                      variant="filled"
                      placeholder="Enter your email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <InputLabel
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 1,
                  }}
                >
                  Phone Number
                </InputLabel>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      variant="filled"
                      type="tel"
                      placeholder="Enter your phone number"
                      sx={{ mb: 2 }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box sx={{ mb: 5 }}>
              <InputLabel
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  mb: 1,
                }}
              >
                Message
              </InputLabel>
              <Controller
                name="message"
                control={control}
                rules={{ required: "Message is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    variant="filled"
                    rows={4}
                    placeholder="Enter your message"
                    error={!!errors.message}
                    helperText={errors.message?.message}
                  />
                )}
              />
            </Box>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              endIcon={
                isSubmitting ? (
                  <Skeleton
                    variant="circular"
                    width={16}
                    height={16}
                    animation="pulse"
                    sx={{ bgcolor: "currentColor" }}
                  />
                ) : (
                  <ArrowForward />
                )
              }
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

            <Box sx={{ mt: 12, display: "flex", justifyContent: "end" }}>
              {socialMedia.map((media, i) => (
                <IconButton key={i} sx={{ color: "primary.main" }}>
                  <a
                    href={media.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit" }}
                  >
                    {media.icon}
                  </a>
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
