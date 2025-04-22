import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { TForm } from "../tForm";
import { Column } from "../tTable/types";

interface TFormModalProps {
  open: boolean;
  onClose: () => void;
  columns: Column[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  customTitle?: string;
}

export const TFormModal: React.FC<TFormModalProps> = ({
  open,
  onClose,
  columns,
  initialValues = {},
  onSubmit,
  customTitle = "",
}) => {
  const handleSubmit = (values: Record<string, any>) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {customTitle !== "" ? (
        <DialogTitle>{customTitle}</DialogTitle>
      ) : (
        <DialogTitle>
          {initialValues?._id ? "Sửa thông tin" : "Thêm mới"}
        </DialogTitle>
      )}

      <DialogContent>
        <TForm
          columns={columns}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
