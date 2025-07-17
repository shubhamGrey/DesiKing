import React from "react";
import { Stack, Typography, Box, Chip, Card, CardContent } from "@mui/material";
import { michroma } from "@/styles/fonts";

interface CertificationsProps {
  certificationOptions: string[];
  selectedCertifications: string[];
  onToggle: (certification: string) => void;
}

const Certifications: React.FC<CertificationsProps> = ({
  certificationOptions,
  selectedCertifications,
  onToggle,
}) => {
  return (
    <Card
      sx={{
        mb: 4,
        backgroundColor: "transparent",
        boxShadow: "none",
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: "8px",
      }}
      elevation={0}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontFamily={michroma.style.fontFamily}
          color="primary.main"
          sx={{ mb: 3 }}
        >
          Certifications
        </Typography>
        <Stack spacing={1}>
          {certificationOptions.map((cert) => (
            <Box
              key={cert}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                border: "1px solid",
                borderColor: selectedCertifications.includes(cert)
                  ? "primary.main"
                  : "divider",
                borderRadius: 1,
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
              }}
              onClick={() => onToggle(cert)}
            >
              <Typography variant="body2">{cert}</Typography>
              {selectedCertifications.includes(cert) && (
                <Chip size="small" label="✓" color="primary" />
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Certifications;
