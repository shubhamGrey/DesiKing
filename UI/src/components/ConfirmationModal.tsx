import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { michroma } from "@/app/layout";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  message = "Are you sure you want to delete this item?",
  title = "Confirm Deletion",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        <Typography
          variant="h6"
          color="primary.main"
          fontWeight={600}
          fontFamily={michroma.style.fontFamily}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          <Typography variant="body1" color="text.primary">
            {message}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button variant="text" onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
