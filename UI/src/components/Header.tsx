"use client";

import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Link as MuiLink,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/public/images/Footer Logo.png";

export default function Header() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "About Us", href: "/about-us" },
    { label: "Brands", href: "/brands" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar
          sx={{
            justifyContent: "start",
            height: 64,
            backgroundColor: "#000000",
            color: "#fff",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 90,
              width: 90,
              cursor: "pointer",
            }}
          >
            <Link href="/" passHref>
              <Image
                src={BrandLogo}
                alt="AGRO NEXIS Logo"
                layout="intrinsic"
                width={60}
                height={70}
                priority
              />
            </Link>
          </Box>

          {/* Desktop Nav */}
          {!isMobile ? (
            <Stack direction="row" spacing={4} sx={{ ml: 2.5 }}>
              {navLinks.map(({ label, href }) => {
                const isActive = pathname === href;
                return (
                  <MuiLink
                    component={Link}
                    key={label}
                    href={href}
                    underline="none"
                    sx={{
                      fontWeight: 700,
                      pb: 0.5,
                      backgroundColor: isActive ? "#e67e22" : "#000000",
                      color: isActive ? "#ffffff" : "#e67e22",
                    }}
                  >
                    {label.toUpperCase()}
                  </MuiLink>
                );
              })}
            </Stack>
          ) : (
            <IconButton edge="end" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1}
          >
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navLinks.map(({ label, href }) => (
              <ListItem
                button
                key={label}
                component={Link}
                href={href}
                selected={pathname === href}
              >
                <ListItemText primary={label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
