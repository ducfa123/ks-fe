import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box
} from "@mui/material";
import { Warning } from "@mui/icons-material";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  target: {
    type: 'phan' | 'cauHoi' | 'gioiHanVungMien' | 'gioiHanDonVi';
    id: string;
    name: string;
    extraData?: any;
  } | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  target
}) => {
  const getDeleteMessage = () => {
    if (!target) return '';
    
    switch (target.type) {
      case 'phan':
        return `Bạn có chắc chắn muốn xóa phần "${target.name}"? Tất cả câu hỏi trong phần này cũng sẽ bị xóa.`;
      case 'cauHoi':
        return `Bạn có chắc chắn muốn xóa câu hỏi "${target.name}"?`;
      case 'gioiHanVungMien':
        return `Bạn có chắc chắn muốn xóa giới hạn cho vùng miền "${target.name}"?`;
      case 'gioiHanDonVi':
        return `Bạn có chắc chắn muốn xóa giới hạn cho đơn vị "${target.name}"?`;
      default:
        return 'Bạn có chắc chắn muốn xóa mục này?';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning color="warning" sx={{ mr: 1 }} />
          Xác nhận xóa
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography>{getDeleteMessage()}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};
