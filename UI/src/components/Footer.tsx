"use client";

import { Box, Grid, Typography, IconButton } from "@mui/material";
import {
  Instagram,
  YouTube,
  Facebook,
  LinkedIn,
  Email,
  LocationOn,
  Phone,
  HomeRounded,
  InfoRounded,
  InventoryRounded,
  ContactPageRounded,
  ArticleRounded,
  PrivacyTipRounded,
  PolicyRounded,
  LocalShippingRounded,
  MonetizationOnRounded,
} from "@mui/icons-material";
import BrandLogo from "../../public/AgroNexisWhite.png";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  const [quickLinks] = useState([
    { label: "Home", href: "/", icon: <HomeRounded fontSize="small" /> },
    {
      label: "About",
      href: "/about",
      icon: <InfoRounded fontSize="small" />,
    },
    {
      label: "Products",
      href: "/products",
      icon: <InventoryRounded fontSize="small" />,
    },
    {
      label: "Contact",
      href: "/contact",
      icon: <ContactPageRounded fontSize="small" />,
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
      icon: <PrivacyTipRounded fontSize="small" />,
    },
    {
      label: "Terms & Conditions",
      href: "/terms-and-conditions",
      icon: <ArticleRounded fontSize="small" />,
    },
    {
      label: "Terms of Services",
      href: "/terms-of-services",
      icon: <PolicyRounded fontSize="small" />,
    },
    {
      label: "Refund Policy",
      href: "/refund-policy",
      icon: <MonetizationOnRounded fontSize="small" />,
    },
    {
      label: "Shipping Policy",
      href: "/shipping-policy",
      icon: <LocalShippingRounded fontSize="small" />,
    },
  ]);

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

  const socialMedia = [
    {
      icon: <Instagram fontSize="medium" />,
      href: "https://www.instagram.com/agronexis/?__pwa=1",
    },
    {
      icon: <YouTube fontSize="medium" />,
      href: "https://www.youtube.com/@AgroNexisIndiaOverseasPrivateL",
    },
    {
      icon: <Facebook fontSize="medium" />,
      href: "https://www.facebook.com/profile.php?id=61575821300609",
    },
    {
      icon: <LinkedIn fontSize="medium" />,
      href: "https://www.linkedin.com/in/aniopl",
    },
  ];

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #1B4D3E 0%, #0F2E24 100%)",
        color: "primary.contrastText",
        px: { xs: 3, md: 8 },
        pt: 8,
        pb: 3,
        position: "relative",
        borderTop: "1px solid rgba(179, 106, 38, 0.5)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, #E85D04, transparent)",
        },
      }}
    >
      <Grid container spacing={4}>
        {/* Brand Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Image
            src={BrandLogo}
            alt="Brand Logo"
            width={150}
            height={150}
            style={{ marginBottom: 12 }}
          />
          <Typography
            variant="body1"
            sx={{ color: "primary.contrastText", mb: 2 }}
          >
            DesiKing, a trademark of AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED
            is committed to delivering pure, authentic Indian spices sourced
            directly from trusted farms. With a focus on quality, hygiene, and
            flavor, we bring the true taste of India to homes, restaurants, and
            global markets.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "primary.contrastText", mb: 2 }}
          >
            CIN No. - U47211DL2025PTC445306
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {socialMedia.map((media) => (
              <IconButton
                key={media.href}
                component="a"
                href={media.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "primary.contrastText",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "secondary.main",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 12px rgba(255, 140, 0, 0.4)",
                  },
                }}
              >
                {media.icon}
              </IconButton>
            ))}
          </Box>
        </Grid>

        {/* Links */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              mb: 3,
              color: "primary.contrastText",
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: 40,
                height: 3,
                borderRadius: 2,
                background: "linear-gradient(90deg, #E85D04, transparent)",
              },
            }}
          >
            Quick Links
          </Typography>
          {quickLinks.map((item) => (
            <Box
              sx={{
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                cursor: "pointer",
                padding: "6px 8px",
                marginLeft: "-8px",
                borderRadius: 1,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transform: "translateX(8px)",
                  "& .MuiTypography-root": {
                    color: "secondary.main",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "secondary.main",
                  },
                },
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
                variant="body2"
                sx={{
                  ml: 1.5,
                  color: "primary.contrastText",
                  transition: "color 0.3s ease",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Grid>

        {/* Contact */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              mb: 3,
              color: "primary.contrastText",
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -8,
                left: 0,
                width: 40,
                height: 3,
                borderRadius: 2,
                background: "linear-gradient(90deg, #E85D04, transparent)",
              },
            }}
          >
            Stay Connected
          </Typography>

          {contactDetails.map((item) => (
            <Box
              sx={{
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                mb: 1.5,
                cursor: item.href ? "pointer" : "default",
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

          <Box sx={{ width: "100%", height: 180, mt: 4 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.576362236079!2d77.1864422754848!3d28.67444917564279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3795c0e5c61%3A0x4f2c1f9ff7e64bdf!2sMehrauli%2C%20New%20Delhi%2C%20Delhi%20110030!5e0!3m2!1sen!2sin!4v1683719295123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="AgroNexis Office Location - Mehrauli, New Delhi"
            ></iframe>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box
        textAlign="center"
        mt={6}
        pt={3}
        sx={{
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          background:
            "linear-gradient(90deg, transparent, rgba(255, 140, 0, 0.1), transparent)",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            letterSpacing: "0.5px",
          }}
        >
          © 2026 AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
