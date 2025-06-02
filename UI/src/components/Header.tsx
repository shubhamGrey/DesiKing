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
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  SearchOutlined,
  PermIdentityOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "../../public/AgroNexisGreen.png";
import theme from "@/styles/theme";
import DesiKing from "../../public/DesiKing.png";
import Carousal from "@/components/Carousal";
import Purity from "../../public/Purity.png";
import Quality from "../../public/Quality.png";
import Taste from "../../public/Taste.png";
import Globe from "../../public/Globe.png";
import { michroma } from "@/app/layout";

const carousalImages = [
  { image: Purity },
  { image: Quality },
  { image: Taste },
  { image: Globe },
];

export default function Header() {
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const leftNavLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
  ];

  const rightNavLinks = [
    { icon: <SearchOutlined /> },
    { icon: <PermIdentityOutlined /> },
    { icon: <ShoppingCartOutlined /> },
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
            backgroundColor: "primary.main",
            color: "primary.contrastText",
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
                  ml: 1,
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
              <Grid container sx={{ flexGrow: 1, ml: 2.5 }}>
                <Grid
                  size={{ xs: 12, md: 6 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                  }}
                >
                  <Stack direction="row" spacing={4}>
                    {leftNavLinks.map(({ label, href }) => {
                      const isActive = pathname === href;
                      return (
                        <MuiLink
                          component={Link}
                          key={label}
                          href={href}
                          underline="none"
                          sx={{
                            color: isActive
                              ? "secondary.main"
                              : "primary.contrastText",
                            fontFamily: michroma.style.fontFamily,
                            fontSize: "14px",
                          }}
                        >
                          {label.toUpperCase()}
                        </MuiLink>
                      );
                    })}
                  </Stack>
                </Grid>
                <Grid
                  size={{ xs: 12, md: 6 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "right",
                  }}
                >
                  <Stack direction="row" spacing={1}>
                    {rightNavLinks.map(({ icon }, index) => (
                      <IconButton
                        key={index}
                        sx={{
                          color: "primary.contrastText",
                        }}
                      >
                        {icon}
                      </IconButton>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
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
                  ml: 1,
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
              <Box>
                {rightNavLinks.map(({ icon }, index) => (
                  <IconButton
                    key={index}
                    edge="end"
                    sx={{
                      color: "primary.contrastText",
                      mr: 1,
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
                <IconButton
                  edge="end"
                  onClick={toggleDrawer(true)}
                  sx={{ color: "primary.contrastText" }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {pathname !== "/" ? (
        <Box
          sx={{
            backgroundImage: 'url("/Header Image.png")',
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
          <Typography
            variant="body1"
            sx={{ mb: 4, mt: 2 }}
            color="#000000"
            fontSize={isMobile ? "0.2rem" : "1rem"}
          >
            A legacy of authenticity in every pinch.
          </Typography>
        </Box>
      ) : (
        <Carousal items={carousalImages} />
      )}

      {/* Drawer for Mobile */}
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {leftNavLinks.map(({ label, href }) => (
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
