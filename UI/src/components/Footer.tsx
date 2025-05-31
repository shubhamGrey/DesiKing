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
      label: "Terms Condition",
      href: "/terms-condition",
      icon: <ArticleRounded fontSize="small" />,
    },
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
      icon: <PrivacyTipRounded fontSize="small" />,
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

  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        px: { xs: 3, md: 8 },
        pt: 6,
        pb: 2,
        position: "relative",
      }}
    >
      <Grid container spacing={4}>
        {/* Brand Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Image
            src={BrandLogo}
            alt="Brand Logo"
            width={150}
            style={{ marginBottom: 12 }}
          />
          <Box>
            {[Instagram, YouTube, Facebook, LinkedIn].map((Icon, i) => (
              <IconButton key={i} sx={{ color: "primary.contrastText" }}>
                <Icon fontSize="medium" />
              </IconButton>
            ))}
          </Box>
        </Grid>

        {/* Links */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 3, color: "primary.contrastText" }}
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
        </Grid>

        {/* Contact */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mb: 3, color: "primary.contrastText" }}
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
            ></iframe>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box textAlign="center" borderTop="1px solid #333" mt={6} pt={2}>
        <Typography variant="body2" sx={{ color: "primary.contrastText" }}>
          Copyright © 2025 AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
}
