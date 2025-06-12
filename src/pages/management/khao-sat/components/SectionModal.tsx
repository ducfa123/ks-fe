import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from "@mui/material";

interface SectionModalProps {
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  formData: {
    tieu_de: string;
    mo_ta: string;
  };
  onFormChange: (formData: { tieu_de: string; mo_ta: string }) => void;
  onSubmit: () => void;
}

export const SectionModal: React.FC<SectionModalProps> = ({
  open,
  onClose,
  isEdit,
  formData,
  onFormChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Sửa phần khảo sát" : "Thêm phần khảo sát"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tiêu đề phần"
          fullWidth
          value={formData.tieu_de}
          onChange={(e) => onFormChange({...formData, tieu_de: e.target.value})}
        />
        <TextField
          margin="dense"
          label="Mô tả (không bắt buộc)"
          fullWidth
          multiline
          rows={3}
          value={formData.mo_ta}
          onChange={(e) => onFormChange({...formData, mo_ta: e.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          onClick={onSubmit}
          variant="contained"
          disabled={!formData.tieu_de}
        >
          {isEdit ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
