"use client";

import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { NavigateNext, Home } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import NextLink from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsNavProps {
  items?: BreadcrumbItem[];
}

const BreadcrumbsNav = ({ items }: BreadcrumbsNavProps) => {
  const pathname = usePathname();

  // Auto-generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    if (!pathname) return [{ label: "Home", href: "/" }];

    const paths = pathname.split("/").filter((x) => x);
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

    paths.forEach((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      breadcrumbs.push({ label, href });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (pathname === "/") return null;

  return (
    <Box
      sx={{
        py: 2,
        px: { xs: 2, md: 4 },
        backgroundColor: "#f9f9f9",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          fontSize: "0.875rem",
          "& .MuiBreadcrumbs-separator": {
            color: "text.secondary",
          },
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          if (isLast) {
            return (
              <Typography
                key={item.label}
                color="primary.main"
                fontSize="inherit"
                fontWeight={600}
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                {index === 0 && <Home fontSize="small" />}
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={item.label}
              component={NextLink}
              href={item.href || "/"}
              underline="hover"
              color="text.secondary"
              fontSize="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {index === 0 && <Home fontSize="small" />}
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsNav;
