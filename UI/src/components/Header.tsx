"use client";

import React, { useState } from "react";
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
  InputBase,
  styled,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  SearchOutlined,
  PermIdentityOutlined,
  ShoppingCartOutlined,
  Add,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandLogo from "../../public/AgroNexisGreen.png";
import theme from "@/styles/theme";
import { michroma } from "@/app/layout";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Header() {
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const leftNavLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Contact", href: "/contact" },
  ];

  const rightNavLinks = [
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
            backgroundColor:
              pathname === "/contact" ? "primary.contrastText" : "primary.main",
            color:
              pathname === "/contact" ? "primary.main" : "primary.contrastText",
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
                              : pathname === "/contact"
                              ? "primary.main"
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
                    <Search>
                      <SearchIconWrapper>
                        <SearchOutlined />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                      />
                    </Search>
                    {rightNavLinks.map(({ icon }, index) => (
                      <IconButton
                        key={index}
                        sx={{
                          color:
                            pathname === "/contact"
                              ? "primary.main"
                              : "primary.contrastText",
                        }}
                        onClick={() => {
                          if (icon.type === ShoppingCartOutlined) {
                            router.push("/cart");
                          } else if (icon.type === PermIdentityOutlined) {
                            router.push("/profile");
                          }
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
                      color:
                        pathname == "/contact"
                          ? "primary.main"
                          : "primary.contrastText",
                      mr: 1,
                    }}
                    onClick={(e) => {
                      if (icon.type === ShoppingCartOutlined) {
                        router.push("/cart");
                      } else if (icon.type === PermIdentityOutlined) {
                        router.push("/profile");
                      } else if (icon.type === SearchOutlined) {
                        router.push("/search");
                      }
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
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
