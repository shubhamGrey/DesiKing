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
import BrandLogo from "../../public/Brand.png";
import DesiKingLogo from "../../public/DesiKing.png";
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
            justifyContent: "space-between",
            // height: isScrolled ? 80 : 100,
            height: 60,
            px: { xs: 2, md: 4 },
            background:
              pathname === "/contact"
                ? isScrolled
                  ? "rgba(254, 249, 243, 0.98)"
                  : "#FEF9F3"
                : isScrolled
                ? "linear-gradient(135deg, rgba(27, 77, 62, 0.98) 0%, rgba(31, 79, 64, 0.98) 100%)"
                : "linear-gradient(135deg, #1B4D3E 0%, #234F42 50%, #1B4D3E 100%)",
            backdropFilter: isScrolled ? "blur(20px)" : "none",
            WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
            color:
              pathname === "/contact" ? "primary.main" : "primary.contrastText",
            borderBottom: "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: isScrolled
              ? "0 4px 30px rgba(27, 77, 62, 0.15)"
              : "0 2px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Desktop Nav */}
          {!isMobile ? (
            <>
              {/* Logo Section - 3D Effect */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  perspective: "1000px",
                  transition: "all 0.4s ease",
                  "&:hover .logo-container": {
                    transform: "rotateY(-8deg) rotateX(5deg) scale(1.05)",
                  },
                }}
              >
                <Link href="/" passHref>
                  <Box
                    className="logo-container"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      transformStyle: "preserve-3d",
                      marginTop: isScrolled ? 0 : 3,
                      width: 250,
                    }}
                  >
                    {isScrolled ? (
                      <Image
                        src={DesiKingLogo}
                        alt="DESI KING Logo"
                        priority
                        height={80}
                        width={130}
                        style={{
                          objectFit: "contain",
                          filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.3))",
                        }}
                      />
                    ) : (
                      <Image
                        src={BrandLogo}
                        alt="DESI KING Logo"
                        priority
                        height={150}
                        width={200}
                        style={{
                          objectFit: "contain",
                          filter: "drop-shadow(3px 3px 6px rgba(0,0,0,0.3))",
                        }}
                      />
                    )}
                  </Box>
                </Link>
              </Box>

              {/* Center Navigation */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                          ? "#E85D04"
                          : pathname === "/contact"
                          ? "primary.main"
                          : "rgba(255, 255, 255, 0.9)",
                        fontSize: "14px",
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: "1px",
                        px: 2.5,
                        py: 1,
                        borderRadius: "25px",
                        backgroundColor: isActive
                          ? pathname === "/contact"
                            ? "rgba(232, 93, 4, 0.1)"
                            : "rgba(255, 255, 255, 0.15)"
                          : "transparent",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          color: "#E85D04",
                          backgroundColor:
                            pathname === "/contact"
                              ? "rgba(232, 93, 4, 0.08)"
                              : "rgba(255, 255, 255, 0.12)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      {label.toUpperCase()}
                    </MuiLink>
                  );
                })}
              </Box>

              {/* Right Section - Search & Icons */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ minWidth: 220 }}>
                  <SearchAutocomplete />
                </Box>
                {rightNavLinks.map(({ icon, getHref, key }) => {
                  const href = getHref();
                  const isActive = pathname === href;
                  const isContactPage = pathname === "/contact";
                  return (
                    <IconButton
                      key={key}
                      sx={{
                        color: isActive
                          ? "#E85D04"
                          : isContactPage
                          ? "primary.main"
                          : "rgba(255, 255, 255, 0.9)",
                        backgroundColor: isActive
                          ? "rgba(255, 255, 255, 0.15)"
                          : "transparent",
                        borderRadius: "12px",
                        p: 1,
                        transition: "all 0.25s ease",
                        "&:hover": {
                          color: "#E85D04",
                          backgroundColor: isContactPage
                            ? "rgba(232, 93, 4, 0.08)"
                            : "rgba(255, 255, 255, 0.12)",
                          transform: "translateY(-2px)",
                        },
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
            </>
          ) : (
            /* Mobile Layout */
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              {/* Mobile Logo - 3D Effect */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  perspective: "800px",
                }}
              >
                <Link href="/" passHref>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <Image
                      src={BrandLogo}
                      alt="DESI KING Logo"
                      priority
                      height={65}
                      width={65}
                      style={{
                        objectFit: "contain",
                        filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.3))",
                      }}
                    />
                  </Box>
                </Link>
              </Box>

              {/* Mobile Icons */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {rightNavLinks.map(({ icon, getHref, key }) => {
                  const href = getHref();
                  const isActive = pathname === href;
                  return (
                    <IconButton
                      key={key}
                      sx={{
                        color: isActive
                          ? "#E85D04"
                          : pathname === "/contact"
                          ? "primary.main"
                          : "rgba(255, 255, 255, 0.9)",
                        p: 1,
                        transition: "all 0.25s ease",
                        "&:hover": {
                          color: "#E85D04",
                        },
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
                  onClick={toggleDrawer(true)}
                  sx={{
                    color:
                      pathname === "/contact"
                        ? "primary.main"
                        : "rgba(255, 255, 255, 0.9)",
                    p: 1,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      color: "#E85D04",
                    },
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
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "70vh",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            background:
              pathname !== "/contact"
                ? "linear-gradient(180deg, #1B4D3E 0%, #234F42 100%)"
                : "linear-gradient(180deg, #FEF9F3 0%, #fff 100%)",
            color:
              pathname !== "/contact" ? "primary.contrastText" : "primary.main",
          }}
          role="presentation"
        >
          {/* Drawer Handle */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 1.5,
              pb: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor:
                  pathname !== "/contact"
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.2)",
              }}
            />
          </Box>

          {/* Mobile Search */}
          <Box
            sx={{
              px: 2,
              pb: 2,
              borderBottom:
                pathname !== "/contact"
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <SearchAutocomplete isMobile={true} onClose={toggleDrawer(false)} />
          </Box>

          <List
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
            sx={{ px: 1 }}
          >
            {leftNavLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={href}
                    selected={pathname === href}
                    sx={{
                      color: isActive
                        ? "#E85D04"
                        : pathname === "/contact"
                        ? "primary.main"
                        : "rgba(255, 255, 255, 0.9)",
                      fontSize: "15px",
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: "0.5px",
                      py: 1.5,
                      px: 2,
                      borderRadius: 2,
                      backgroundColor: isActive
                        ? pathname === "/contact"
                          ? "rgba(232, 93, 4, 0.1)"
                          : "rgba(255,255,255,0.1)"
                        : "transparent",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        backgroundColor:
                          pathname === "/contact"
                            ? "rgba(232, 93, 4, 0.08)"
                            : "rgba(255,255,255,0.08)",
                        color: "#E85D04",
                      },
                    }}
                  >
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontWeight: "inherit",
                        letterSpacing: "inherit",
                        fontSize: "inherit",
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
