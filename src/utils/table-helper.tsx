import { Box, Button } from "@mui/material";
import React, { ReactNode } from "react";

export const addActionToRows = (rows, actions = [], align = "center") => {
  return addFieldToItems(rows, "actions", (row) => (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        gap: "10px",
        alignItems: "center",
        justifyContent: align,
      }}
    >
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="contained"
          onClick={() => action.onClick(row)}
          startIcon={action.icon}
          sx={{
            backgroundColor: action.color || "#0A8DEE", // Màu mặc định là xanh
            textTransform: "none !important",
          }}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  ));
};

export const addFieldToItems = <T extends object, K extends keyof any>(
  items: T[], // Danh sách items (có thể là rows, quyền, hoặc bất kỳ đối tượng nào)
  fieldName: K, // Tên của field cần thêm
  generateValue: (item: T) => any // Hàm để sinh giá trị cho field mới
): (T & Record<K, any>)[] => {
  return items?.map((item) => ({
    ...(item as T), // 🟢 Đảm bảo item giữ nguyên kiểu T
    [fieldName]: generateValue(item),
  })) as (T & Record<K, any>)[]; // 🟢 Ép kiểu để TypeScript không báo lỗi
};

export const addOptionsToColumns = <T extends object>(
  columns: T[],
  fieldId: string,
  options: { value: any; label?: string; customLabel?: ReactNode }[]
): T[] => {
  return columns.map((column: any) =>
    column.id === fieldId ? { ...column, options } : column
  );
};
export const addOnChangeToColumns = <T extends object>(
  columns: T[],
  fieldId: string,
  onChange: (value) => void
): T[] => {
  return columns.map((column: any) =>
    column.id === fieldId ? { ...column, onChange } : column
  );
};

export const addFetchOptionsToColumns = <T extends object>(
  columns: T[],
  fieldId: string,
  fetchOptions: (input: string) => Promise<{ value: any; label: string }[]>
): T[] => {
  return columns.map((column: any) =>
    column.id === fieldId ? { ...column, fetchOptions } : column
  );
};

export const addFieldToColumns = <T extends object>(
  columns: T[],
  fieldId: string,
  name: string,
  value: any
): T[] => {
  return columns.map((column: any) =>
    column.id === fieldId
      ? {
          ...column,
          ...{
            [name]: value,
          },
        }
      : column
  );
};
