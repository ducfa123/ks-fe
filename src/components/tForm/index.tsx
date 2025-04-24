import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  FormControl,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { FaSave, FaTimes } from "react-icons/fa";
import { TAutoComplete } from "../tAutoComplete";
import { TTextField } from "../tTextField";
import { TCurrencyTextField } from "../tCurrencyTextField";
import { TDateTimePicker } from "../tDateTimePicker";
import { Grid } from "@mui/system";
import { TDatePicker } from "../tDatePicker";
import { formatTime } from "../../types";
import { TSelectFetch } from "../tSelectFetch";
import { TTimePicker } from "../tTimePicker";
import { TLabelFetch } from "../tLabelFetch";
import { TCouponInput } from "../tCounponInput";
import { TSelectDependent } from "../tSelectDependent";
import { TStarRating } from "../tStarRating";
import TSelectCustom from "../tSelectCustom";
import { TSanPhamImageViewer } from "../tSanPhamImageViewer";

interface Column {
  id: string;
  label: string;
  type?: string; // "select-coupon", "label", "coupon", "label-fetch", "text", "number", "email", "date", "textarea", "select", "date-time", "switch", "select-fetch", "hidden", "time", "multi-select"
  required?: boolean;
  options?: {
    value: string | number;
    label?: string;
    customLabel?: React.Component;
  }[];
  format?: formatTime;
  condition?: (formData: Record<string, any>) => boolean;
  fetchOptions?: (
    input: string
  ) => Promise<{ value: string | number; label: string }[]>;
  fetchLabel?: (formData: Record<string, any>) => Promise<string>; // label-fetch
  callOnce?: boolean; //label-fetch
  fetchCouponInfo?: (ma: string) => Promise<{
    loai: string;
    giam?: number;
    giam_phan_tram?: number;
    valid: boolean;
    message?: string;
  }>; // 👈 API xác minh
  parentId?: string; // 👈 field phụ thuộc select-dependent
  getOptionsFromParent?: (
    parentValue: any
  ) => Promise<{ value: string | number; label: string }[]>;
  defaultOptions?: (
    formData: Record<string, any>
  ) => { value: string | number; label: string }[];
  onChange?: (e: any) => void;
  validate?: (formData: Record<string, any>) => string | null;
}

interface FormComponentProps {
  columns: Column[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  onCancel: () => void;
}

export const TForm: React.FC<FormComponentProps> = ({
  columns,
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredColumns, setFilteredColumns] = useState<Column[]>([]);

  useEffect(() => {
    const newFiltered = columns.filter(
      (column) => !column.condition || column.condition(formData)
    );
    setFilteredColumns(newFiltered);
  }, [formData, columns]);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    filteredColumns.forEach((column) => {
      if (column.required && !formData[column.id]?.toString().trim()) {
        newErrors[column.id] = `${column.label} không được để trống`;
      }

      if (column.type === "currency") {
        const value = formData[column.id];
        if (value < 0) newErrors[column.id] = "Số tiền không được là số âm ";
      }

      // ✅ Kiểm tra điều kiện validate custom
      if (column.validate) {
        const errorMsg = column.validate(formData);
        if (errorMsg) {
          newErrors[column.id] = errorMsg;
        }
      }
    });

    const hasConfirmPassword = columns.some(
      (col) => col.id === "confirm_password"
    );
    if (
      hasConfirmPassword &&
      formData["confirm_password"] !== formData["mat_khau"]
    ) {
      newErrors["confirm_password"] = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formControl = (type, column) => {
    switch (type) {
      case "images":
        return (
          <FormControl fullWidth>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 500, mb: 0.5, fontSize: "0.85rem" }}
            >
              {column.label}
            </Typography>

            <Box>
              {Array.isArray(formData[column.id]) &&
              formData[column.id].length > 0 ? (
                <Box display="flex" flexDirection="column" gap={1}>
                  {formData[column.id].map((url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`img-${index}`}
                      style={{
                        width: 200,
                        maxHeight: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontSize: 14, color: "#90a4ae" }}>
                  Không có hình ảnh
                </Typography>
              )}
            </Box>
          </FormControl>
        );

      case "files":
        return (
          <FormControl fullWidth>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 500, mb: 0.5, fontSize: "0.85rem" }}
            >
              {column.label}
            </Typography>
            <Box
              sx={{
                border: "2px dashed #90caf9",
                borderRadius: "8px",
                p: 2,
                textAlign: "center",
                backgroundColor: "#f5faff",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
              onClick={() => {
                document.getElementById(`files-input-${column.id}`)?.click();
              }}
            >
              <input
                id={`files-input-${column.id}`}
                type="file"
                accept={column.accept || "*"}
                style={{ display: "none" }}
                multiple
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files ?? []);

                  // Tạo URL preview cho các ảnh
                  const filePreviews = selectedFiles.map((file) => ({
                    file,
                    preview: file.type.startsWith("image/")
                      ? URL.createObjectURL(file)
                      : null,
                  }));

                  setFormData({
                    ...formData,
                    [column.id]: filePreviews,
                  });

                  if (errors[column.id]) {
                    setErrors({ ...errors, [column.id]: "" });
                  }
                }}
              />
              <Typography sx={{ fontSize: 14, color: "#1976d2" }}>
                📁 Nhấn vào đây để chọn nhiều file
              </Typography>

              {Array.isArray(formData[column.id]) &&
                formData[column.id].length > 0 && (
                  <Box mt={2} display="flex" flexDirection="column" gap={1}>
                    {formData[column.id].map(
                      (
                        f: { file: File; preview: string | null },
                        i: number
                      ) => (
                        <Box key={i} display="flex" alignItems="center" gap={2}>
                          {f.preview ? (
                            <img
                              src={f.preview}
                              alt={`preview-${i}`}
                              style={{
                                width: 200,
                                maxHeight: 120,
                                objectFit: "cover",
                                borderRadius: 8,
                                border: "1px solid #ccc",
                              }}
                            />
                          ) : (
                            <Typography sx={{ fontSize: 13 }}>
                              {f.file.name}
                            </Typography>
                          )}
                          <Typography sx={{ fontSize: 13 }}>
                            {f.file.name}
                          </Typography>
                        </Box>
                      )
                    )}
                  </Box>
                )}
            </Box>

            {errors[column.id] && (
              <Typography variant="caption" color="error">
                {errors[column.id]}
              </Typography>
            )}
          </FormControl>
        );

      case "file":
        return (
          <FormControl fullWidth>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 500, mb: 0.5, fontSize: "0.85rem" }}
            >
              {column.label}
            </Typography>

            <Box
              sx={{
                border: "2px dashed #90caf9",
                borderRadius: "8px",
                p: 2,
                textAlign: "center",
                backgroundColor: "#f5faff",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
              onClick={() => {
                document.getElementById(`file-input-${column.id}`)?.click();
              }}
            >
              <input
                id={`file-input-${column.id}`}
                type="file"
                accept={column.accept || "*"}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({
                    ...formData,
                    [column.id]: file,
                  });

                  if (errors[column.id]) {
                    setErrors({ ...errors, [column.id]: "" });
                  }
                }}
              />
              <Typography sx={{ fontSize: 14, color: "#1976d2" }}>
                📎 Nhấn vào đây để tải lên
              </Typography>
              {formData[column.id] && (
                <Typography
                  sx={{
                    fontSize: 13,
                    mt: 1,
                    color: "#2e7d32",
                    fontWeight: 500,
                  }}
                >
                  {formData[column.id]?.name}
                </Typography>
              )}
            </Box>

            {errors[column.id] && (
              <Typography variant="caption" color="error">
                {errors[column.id]}
              </Typography>
            )}
          </FormControl>
        );

      case "select-coupon":
        return (
          <FormControl fullWidth>
            <TSelectCustom
              label={column.label}
              value={formData[column.id] || ""}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  [column.id]: val,
                })
              }
              options={column?.options}
              error={!!errors[column.id]}
              helperText={errors[column.id]}
            />
          </FormControl>
        );

      case "rating-star":
        return (
          <FormControl fullWidth sx={{ mt: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 500, mb: 0.5, fontSize: "0.85rem" }}
            >
              {column.label}
            </Typography>
            <TStarRating
              value={formData?.[column.id] || 0}
              onChange={(val) => {
                setFormData({
                  ...formData,
                  [column.id]: val,
                });
              }}
            />
            {errors[column.id] && (
              <Typography variant="caption" color="error">
                {errors[column.id]}
              </Typography>
            )}
          </FormControl>
        );

      case "select":
        return (
          <FormControl fullWidth>
            <TAutoComplete
              label={column.label}
              options={column.options}
              onChange={(value: any) => {
                const option = column.options?.find((i) => i.value === value);
                const text = option?.label || "";
                if (column?.onChange) {
                  column?.onChange(value);
                }
                setFormData({
                  ...formData,
                  [column.id]: value,
                  [column.id + "_text"]: text,
                });
              }}
              error={!!errors[column.id]}
              initValue={formData[column?.id] ?? null}
            />
          </FormControl>
        );

      case "select-fetch":
        return (
          <TSelectFetch
            label={column.label}
            fetchOptions={column.fetchOptions}
            defaultOptions={column.defaultOptions}
            value={formData[column.id]}
            onChange={(val) => {
              setFormData({ ...formData, [column.id]: val });
            }}
            error={!!errors[column.id]}
            helperText={errors[column.id]}
            formValue={formData}
          />
        );

      case "select-dependent":
        return (
          <FormControl fullWidth>
            <TSelectDependent
              label={column.label}
              value={formData[column.id]}
              parentValue={formData[column.parentId ?? ""]}
              getOptionsFromParent={column.getOptionsFromParent}
              onChange={(val) => {
                setFormData({ ...formData, [column.id]: val });
              }}
              error={!!errors[column.id]}
              helperText={errors[column.id]}
            />
          </FormControl>
        );

      case "currency":
        return (
          <FormControl fullWidth>
            <TCurrencyTextField
              id={column.id}
              value={formData?.[column.id]}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  [column.id]: value,
                })
              }
              fullWidth
              label={column.label}
              sx={{ fontSize: "13px" }}
              error={!!errors[column.id]}
              helperText={errors[column.id] ?? ""}
            />
          </FormControl>
        );

      case "date":
        return (
          <FormControl sx={{ width: "48%" }}>
            <TDatePicker
              value={formData?.[column.id]}
              label={column.label}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  [column.id]: value,
                })
              }
              format={column.format}
              error={!!errors[column.id]}
              helperText={errors[column.id] ?? ""}
            />
          </FormControl>
        );

      case "date-time":
        return (
          <FormControl sx={{ width: "48%" }}>
            <TDateTimePicker
              value={formData?.[column.id]}
              label={column.label}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  [column.id]: value,
                })
              }
              error={!!errors[column.id]}
              helperText={errors[column.id] ?? ""}
            />
          </FormControl>
        );

      case "time":
        return (
          <FormControl sx={{ width: "48%" }}>
            <TTimePicker
              value={formData?.[column.id]}
              label={column.label}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  [column.id]: value,
                })
              }
              error={!!errors[column.id]}
              helperText={errors[column.id] ?? ""}
            />
          </FormControl>
        );

      case "multi-select":
        return (
          <FormControl fullWidth>
            <TAutoComplete
              label={column.label}
              options={column.options}
              multiple={true}
              required={column.required}
              error={!!errors[column.id]}
              helperText={errors[column.id]}
              initValue={formData?.[column.id] ?? []}
              onChange={(value: any[]) => {
                setFormData({
                  ...formData,
                  [column.id]: value,
                });
              }}
            />
          </FormControl>
        );

      case "switch":
        return (
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Switch
                  checked={formData?.[column.id] ?? false}
                  onChange={(e) => {
                    const value = Boolean(e.target.checked);
                    setFormData({
                      ...formData,
                      [column.id]: value,
                    });
                  }}
                />
              }
              label={column.label}
            />
          </FormControl>
        );

      case "number":
        return (
          <FormControl fullWidth>
            <TTextField
              sx={{ fontSize: "13px" }}
              fullWidth
              label={column.label}
              name={column.id}
              type="number"
              value={formData?.[column.id] || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  [column.id]: value === "" ? "" : Number(value),
                });
              }}
              variant="outlined"
              error={!!errors[column.id]}
              helperText={errors[column.id] ?? ""}
            />
          </FormControl>
        );

      case "label-fetch":
        return (
          <FormControl fullWidth>
            <TLabelFetch
              label={column.label}
              formValue={formData}
              fetchLabel={column.fetchLabel}
              callOnce={column.callOnce}
            />
          </FormControl>
        );

      case "label":
        return (
          <FormControl fullWidth>
            <Box sx={{ px: 0, py: 0 }}>
              <Typography variant="caption" color="textSecondary">
                {column.label}
              </Typography>
              <Typography
                sx={{ fontSize: 15, fontWeight: 500, color: "black" }}
              >
                {formData?.[column.id] ?? ""}
              </Typography>
            </Box>
          </FormControl>
        );

      case "coupon":
        return (
          <FormControl fullWidth>
            <TCouponInput
              label={column.label}
              value={formData[column.id] || ""}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  [column.id]: val,
                })
              }
              info={formData[`${column.id}_info`]}
              fetchCouponInfo={column.fetchCouponInfo}
              error={!!errors[column.id]}
              helperText={errors[column.id]}
              onChangeInfo={(info) => {
                setFormData((prev) => ({
                  ...prev,
                  [`${column.id}_info`]: info,
                }));
              }}
            />
          </FormControl>
        );

      default:
        return (
          <FormControl fullWidth>
            <TTextField
              sx={{ fontSize: "13px" }}
              fullWidth
              label={column.label}
              name={column.id}
              type={column.type}
              value={formData?.[column.id] || ""}
              onChange={handleChange}
              variant="outlined"
              multiline={column.type === "textarea"}
              minRows={column.type === "textarea" ? 3 : 1}
              error={!!errors[column.id]}
              helperText={errors[column.id] ?? ""}
            />
          </FormControl>
        );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Grid container spacing={2}>
        {filteredColumns.map((column) => {
          return formControl(column.type, column);
        })}
      </Grid>
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button
          onClick={onCancel}
          variant="contained"
          startIcon={<FaTimes />}
          sx={{
            backgroundColor: "gray",
            textTransform: "none !important",
            fontFamily: "Be Vietnam Pro",
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          type="submit"
          startIcon={<FaSave />}
          sx={{
            backgroundColor: "#0A8DEE",
            textTransform: "none !important",
            fontFamily: "Be Vietnam Pro",
          }}
        >
          Lưu
        </Button>
      </Box>
    </Box>
  );
};
