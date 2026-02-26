"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
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
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  PermIdentityOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "../../public/AgroNexisGreen.png";
import BrandLogoWhite from "../../public/AgroNexisWhite.png";
import theme from "@/styles/theme";
import { useCart } from "@/contexts/CartContext";
import SearchAutocomplete from "./SearchAutocomplete";
import { isLoggedIn, isAdmin } from "@/utils/auth";

export default function Header() {
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const { itemCount } = useCart();

  // Check auth status after hydration to prevent hydration mismatches
  useEffect(() => {
    setUserLoggedIn(isLoggedIn());
  }, []);

  // Track scroll position with wide hysteresis to prevent flickering
  useEffect(() => {
    const scrollToCollapsedThreshold = 250; // Must scroll past 250px to collapse
    const scrollToExpandedThreshold = 50; // Must scroll above 50px to expand
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;

          // Only change state if we're clearly above or below the zone
          if (scrollTop > scrollToCollapsedThreshold) {
            setIsScrolled(true);
          } else if (scrollTop < scrollToExpandedThreshold) {
            setIsScrolled(false);
          }
          // If between 50-250px, maintain current state (no change)

          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    const initialScrollTop = window.scrollY;
    setIsScrolled(initialScrollTop > scrollToCollapsedThreshold);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const leftNavLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
    ...(isAdmin() ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  const rightNavLinks = [
    {
      icon: <PermIdentityOutlined />,
      key: "profile",
      label: userLoggedIn ? "Profile" : "Login",
      getHref: () => (userLoggedIn ? "/profile" : "/login"),
    },
    {
      icon: (
        <Badge badgeContent={itemCount} color="secondary">
          <ShoppingCartOutlined />
        </Badge>
      ),
      key: "cart",
      label: userLoggedIn ? "Cart" : "Login",
      getHref: () => (userLoggedIn ? "/cart" : "/login"),
    },
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
            height: isScrolled ? 64 : 80,
            backgroundColor:
              pathname === "/contact"
                ? isScrolled
                  ? "rgba(254, 249, 243, 0.95)"
                  : "primary.contrastText"
                : isScrolled
                ? "rgba(31, 79, 64, 0.95)"
                : "primary.main",
            backdropFilter: isScrolled ? "blur(12px)" : "none",
            WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
            color:
              pathname === "/contact" ? "primary.main" : "primary.contrastText",
            borderBottom: isScrolled
              ? "1px solid rgba(179, 106, 38, 0.3)"
              : "0.5px solid #b36a26",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: isScrolled ? "0 4px 20px rgba(31, 79, 64, 0.1)" : "none",
          }}
        >
          {/* Desktop Nav */}
          {!isMobile ? (
            <>
              <Box
                sx={{
                  backgroundColor: isScrolled ? "transparent" : "#fff",
                  borderRadius: isScrolled ? 0 : 5,
                  boxShadow: isScrolled
                    ? "none"
                    : "0px 4px 15px rgba(0, 0, 0, 0.3)",
                  p: isScrolled ? 0.5 : 1,
                  pt: isScrolled ? 0.5 : 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: isScrolled ? 40 : 110,
                  width: isScrolled ? 40 : 100,
                  cursor: "pointer",
                  ml: 1,
                  mt: isScrolled ? 1 : 3,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth material design transition
                }}
              >
                <Link href="/" passHref>
                  {isScrolled && pathname !== "/contact" ? (
                    <Image
                      src={BrandLogoWhite}
                      alt="AGRO NEXIS Logo"
                      priority
                      height={35}
                      width={35}
                    />
                  ) : (
                    <Image
                      src={BrandLogo}
                      alt="AGRO NEXIS Logo"
                      priority
                      height={85}
                      width={85}
                    />
                  )}
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
                  <Stack direction="row" spacing={5}>
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
                              : pathname === "/contact"
                              ? "primary.main"
                              : "primary.contrastText",
                            fontSize: "16px",
                            fontWeight: isActive ? 600 : 500,
                            letterSpacing: "1.5px",
                            position: "relative",
                            py: 0.5,
                            transition: "all 0.3s ease",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: 0,
                              left: "50%",
                              transform: isActive
                                ? "translateX(-50%) scaleX(1)"
                                : "translateX(-50%) scaleX(0)",
                              width: "100%",
                              height: "2px",
                              backgroundColor: "secondary.main",
                              transition: "transform 0.3s ease",
                            },
                            "&:hover": {
                              color: "secondary.main",
                              "&::after": {
                                transform: "translateX(-50%) scaleX(1)",
                              },
                            },
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
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ minWidth: isMobile ? 200 : 250 }}>
                      <SearchAutocomplete />
                    </Box>
                    {rightNavLinks.map(({ icon, getHref, key }) => {
                      const href = getHref();
                      const isActive = pathname === href;
                      return (
                        <IconButton
                          key={key}
                          sx={{
                            color: isActive
                              ? "secondary.main"
                              : pathname === "/contact"
                              ? "primary.main"
                              : "primary.contrastText",
                          }}
                          onClick={() => {
                            const targetHref = userLoggedIn ? href : "/login";
                            router.push(targetHref);
                          }}
                        >
                          {icon}
                        </IconButton>
                      );
                    })}
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
                  backgroundColor: isScrolled ? "transparent" : "#fff",
                  borderRadius: isScrolled ? 0 : 5,
                  boxShadow: isScrolled
                    ? "none"
                    : "0px 4px 15px rgba(0, 0, 0, 0.3)",
                  p: isScrolled ? 0.5 : 1,
                  pt: isScrolled ? 0.5 : 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: isScrolled ? 40 : 110,
                  width: isScrolled ? 40 : 100,
                  cursor: "pointer",
                  ml: 1,
                  mt: isScrolled ? 1 : 3,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth material design transition
                }}
              >
                <Link href="/" passHref>
                  {isScrolled && pathname !== "/contact" ? (
                    <Image
                      src={BrandLogoWhite}
                      alt="AGRO NEXIS Logo"
                      priority
                      height={35}
                      width={35}
                    />
                  ) : (
                    <Image
                      src={BrandLogo}
                      alt="AGRO NEXIS Logo"
                      priority
                      height={85}
                      width={85}
                    />
                  )}
                </Link>
              </Box>
              <Box>
                {rightNavLinks.map(({ icon, getHref, key }) => {
                  const href = getHref();
                  const isActive = pathname === href;
                  return (
                    <IconButton
                      key={key}
                      edge="end"
                      sx={{
                        color: isActive
                          ? "secondary.main"
                          : pathname === "/contact"
                          ? "primary.main"
                          : "primary.contrastText",
                        mr: 1,
                      }}
                      onClick={() => {
                        const targetHref = userLoggedIn ? href : "/login";
                        router.push(targetHref);
                      }}
                    >
                      {icon}
                    </IconButton>
                  );
                })}
                <IconButton
                  edge="end"
                  onClick={toggleDrawer(true)}
                  sx={{
                    color:
                      pathname == "/contact"
                        ? "primary.main"
                        : "primary.contrastText",
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: "100%",
            backgroundColor:
              pathname != "/contact" ? "primary.main" : "primary.contrastText",
            color:
              pathname != "/contact" ? "primary.contrastText" : "primary.main",
          }}
          role="presentation"
        >
          {/* Mobile Search */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <SearchAutocomplete isMobile={true} onClose={toggleDrawer(false)} />
          </Box>

          <List onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            {leftNavLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <ListItem key={label} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={href}
                    selected={pathname === href}
                    sx={{
                      color: isActive
                        ? "secondary.main"
                        : pathname === "/contact"
                        ? "primary.main"
                        : "primary.contrastText",
                      fontSize: "16px",
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: "1px",
                      py: 1.5,
                      transition: "all 0.3s ease",
                      borderLeft: isActive
                        ? "3px solid"
                        : "3px solid transparent",
                      borderColor: isActive ? "secondary.main" : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "secondary.main",
                      },
                    }}
                  >
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontWeight: "inherit",
                        letterSpacing: "inherit",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
