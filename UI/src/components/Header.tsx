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
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "../../public/AgroNexisGreen.png";
import theme from "@/styles/theme";
import DesiKing from "../../public/DesiKing.png";

export default function Header() {
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: "About Us", href: "/about" },
    { label: "Brands", href: "/brands" },
    { label: "Contact Us", href: "/contact" },
  ];

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar
          sx={{
            justifyContent: "start",
            height: 64,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderBottom: "0.5px solid #b36a26",
          }}
        >
          {/* Desktop Nav */}
          {!isMobile ? (
            <>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 5,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                  p: 1.5,
                  pt: 8,
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
                    priority
                  />
                </Link>
              </Box>
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
                        color: theme.palette.primary.contrastText,
                        fontWeight: isActive ? "bold" : "normal",
                      }}
                    >
                      {label.toUpperCase()}
                    </MuiLink>
                  );
                })}
              </Stack>
            </>
          ) : (
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              sx={{ width: "100%" }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 5,
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                  p: 1.5,
                  pt: 8,
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
                    priority
                  />
                </Link>
              </Box>
              <IconButton
                edge="end"
                onClick={toggleDrawer(true)}
                sx={{ color: theme.palette.primary.contrastText }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {pathname !== "/" && (
        <Box
          sx={{
            backgroundImage: 'url("/LoginBackground.png")',
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            px: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={DesiKing}
            alt="Desi King"
            style={{ width: "30%", height: "30%", marginTop: 32 }}
          />
          <Typography variant="body1" sx={{ mb: 4, mt: 2 }}>
            A legacy of authenticity in every pinch.
          </Typography>
        </Box>
      )}

      {/* Drawer for Mobile */}
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: "100%",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navLinks.map(({ label, href }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={href}
                  selected={pathname === href}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
