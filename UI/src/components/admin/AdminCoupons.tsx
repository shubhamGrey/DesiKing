"use client";

import { useState, useEffect } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, IconButton, FormControlLabel, Switch
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Cookies from "js-cookie";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "", discountType: "percentage", discountValue: 10,
    minOrderAmount: 0, usageLimit: "", expiresAt: "", isActive: true,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchCoupons = async () => {
    const token = Cookies.get("access_token");
    const res = await fetch(`${apiUrl}/Coupon`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (json.info?.isSuccess) setCoupons(json.data || []);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async () => {
    const token = Cookies.get("access_token");
    const res = await fetch(`${apiUrl}/Coupon`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        code: newCoupon.code,
        discountType: newCoupon.discountType,
        discountValue: Number(newCoupon.discountValue),
        minOrderAmount: Number(newCoupon.minOrderAmount),
        usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : null,
        expiresAt: newCoupon.expiresAt || null,
        isActive: newCoupon.isActive,
      }),
    });
    const json = await res.json();
    if (json.info?.isSuccess) {
      setCreateDialogOpen(false);
      fetchCoupons();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const token = Cookies.get("access_token");
    await fetch(`${apiUrl}/Coupon/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCoupons();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>Coupon Codes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
          New Coupon
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Min Order</TableCell>
            <TableCell>Usage</TableCell>
            <TableCell>Expires</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell><strong>{coupon.code}</strong></TableCell>
              <TableCell>{coupon.discountType}</TableCell>
              <TableCell>{coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</TableCell>
              <TableCell>₹{coupon.minOrderAmount}</TableCell>
              <TableCell>{coupon.usageCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}</TableCell>
              <TableCell>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("en-IN") : "Never"}</TableCell>
              <TableCell>
                <Chip label={coupon.isActive ? "Active" : "Inactive"} color={coupon.isActive ? "success" : "default"} size="small" />
              </TableCell>
              <TableCell>
                <IconButton size="small" color="error" onClick={() => handleDelete(coupon.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Coupon</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField label="Code" value={newCoupon.code} onChange={(e) => setNewCoupon(p => ({...p, code: e.target.value.toUpperCase()}))} variant="filled" />
            <TextField
              label="Discount Type"
              select
              SelectProps={{ native: true }}
              value={newCoupon.discountType}
              onChange={(e) => setNewCoupon(p => ({...p, discountType: e.target.value}))}
              variant="filled"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </TextField>
            <TextField label="Discount Value" type="number" value={newCoupon.discountValue} onChange={(e) => setNewCoupon(p => ({...p, discountValue: Number(e.target.value)}))} variant="filled" />
            <TextField label="Min Order Amount" type="number" value={newCoupon.minOrderAmount} onChange={(e) => setNewCoupon(p => ({...p, minOrderAmount: Number(e.target.value)}))} variant="filled" />
            <TextField label="Usage Limit (optional)" type="number" value={newCoupon.usageLimit} onChange={(e) => setNewCoupon(p => ({...p, usageLimit: e.target.value}))} variant="filled" />
            <TextField label="Expires At (optional)" type="datetime-local" value={newCoupon.expiresAt} onChange={(e) => setNewCoupon(p => ({...p, expiresAt: e.target.value}))} variant="filled" InputLabelProps={{ shrink: true }} />
            <FormControlLabel control={<Switch checked={newCoupon.isActive} onChange={(e) => setNewCoupon(p => ({...p, isActive: e.target.checked}))} />} label="Active" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!newCoupon.code}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
