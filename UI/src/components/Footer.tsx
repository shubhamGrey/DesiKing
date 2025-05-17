"use client";

import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import {
  Instagram,
  YouTube,
  Facebook,
  LinkedIn,
  Email,
  LocationOn,
  Phone,
  WhatsApp,
} from "@mui/icons-material";
import BrandLogo from "@/public/images/Footer Logo.png";
import Image from "next/image";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        color: "#ffffff",
        px: { xs: 3, md: 8 },
        pt: 6,
        pb: 2,
        position: "relative",
      }}
    >
      <Grid container spacing={4}>
        {/* Brand Info */}
        <Grid size={3}>
          <Image
            src={BrandLogo}
            alt="Brand Logo"
            width={250}
            style={{ marginBottom: "75px" }}
          />
          <Typography variant="body2" sx={{ mb: 2, wordBreak: "break-word" }}>
            AGRO NEXIS is committed to delivering pure, authentic Indian spices
            sourced directly from trusted farms. With a focus on quality,
            hygiene, and flavor, we bring the true taste of India to homes,
            restaurants, and global markets.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>CIN No. -</strong> U47211DL2025PTC445306
          </Typography>
          <Box>
            {[Instagram, YouTube, Facebook, LinkedIn].map((Icon, i) => (
              <IconButton key={i} sx={{ color: "#fff" }}>
                <Icon fontSize="small" />
              </IconButton>
            ))}
          </Box>
        </Grid>

        {/* Links */}
        <Grid size={3}>
          <Typography variant="h6" gutterBottom>
            Links
          </Typography>
          {[
            "Home",
            "About Us",
            "Products",
            "Contact",
            "Terms Condition",
            "Privacy Policy",
          ].map((text, index) => (
            <Typography key={index} variant="body2">
              <Link href="#" color="inherit" underline="hover">
                {text}
              </Link>
            </Typography>
          ))}
        </Grid>

        {/* Contact */}
        <Grid size={3}>
          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Box display="flex" alignItems="start" mb={1}>
            <Email sx={{ mr: 1, mt: "2px" }} fontSize="small" />
            <Typography variant="body2">care@agronexis.com</Typography>
          </Box>
          <Box display="flex" alignItems="start" mb={1}>
            <LocationOn sx={{ mr: 1, mt: "2px" }} fontSize="small" />
            <Typography variant="body2">
              Plot 29G/1, Kaushik Building, Mehrauli, New Delhi 110030
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Phone sx={{ mr: 1 }} fontSize="small" />
            <Typography variant="body2">+91 958 2000 963</Typography>
          </Box>
        </Grid>

        {/* Location */}
        <Grid size={3}>
          <Typography variant="h6" gutterBottom>
            Location
          </Typography>
          <Box sx={{ width: "100%", height: 180 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.576362236079!2d77.1864422754848!3d28.67444917564279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3795c0e5c61%3A0x4f2c1f9ff7e64bdf!2sMehrauli%2C%20New%20Delhi%2C%20Delhi%20110030!5e0!3m2!1sen!2sin!4v1683719295123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Box>
        </Grid>
      </Grid>

      {/* WhatsApp Floating Button */}
      <Box
        component="a"
        href="https://wa.me/919582000963"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 1300,
          backgroundColor: "#25D366",
          p: 1.5,
          borderRadius: "50%",
          boxShadow: 3,
          transition: "0.3s",
          "&:hover": {
            backgroundColor: "#1EBE54",
            transform: "scale(1.1)",
          },
        }}
      >
        <WhatsApp sx={{ color: "#fff", fontSize: 28 }} />
      </Box>

      {/* Copyright */}
      <Box textAlign="center" borderTop="1px solid #333" mt={6} pt={2}>
        <Typography variant="body2">
          Copyright © 2025 AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
}
