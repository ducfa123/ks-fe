import dayjs, { Dayjs } from "dayjs";
import { toNumber } from "./parse";

// Common utility functions

/**
 * Formats a date string to a localized format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

/**
 * Formats a number as currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Truncates a string to a specified length and adds ellipsis
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const formatNumberVND = (number: number): string => {
  if (typeof number !== "number" || isNaN(number)) {
    throw new Error("Giá trị nhập vào phải là một số hợp lệ.");
  }
  return number.toLocaleString("en-US", {}); // Dùng chuẩn Việt Nam với dấu `.`
};
export const formatToCurrencyTypeToFixed = (
  currency,
  fixed = 0,
  type: any = "en-US"
) => {
  return currency || currency == 0
    ? toNumber(currency).toLocaleString(type, {
        minimumFractionDigits: 0,
        maximumFractionDigits: fixed,
      })
    : "";
};
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);

  // Lấy giờ, phút, ngày, tháng, năm
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng tính từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const formatDateToDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatDateToStringFormat = (
  data: string | Date | null | undefined,
  format: string = "DD/MM/YYYY"
): string => {
  if (!data) return "";

  const d = dayjs(data);

  if (!d.isValid()) return "";

  return d.format(format);
};

export const formatDateToString = (
  date: Dayjs | string | null | undefined,
  format: string = "YYYY-MM-DD"
): string => {
  if (!date) return "";
  const d = typeof date === "string" ? dayjs(date) : date;

  // Nếu định dạng là giờ phút
  if (format === "HH:mm") {
    return d.format("HH:mm");
  }

  // Mặc định là ngày đầy đủ
  return d.format(format);
};

export const buildFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof Blob) {
      formData.append(key, value, (value as File).name);
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      formData.append(key, value.toString());
    } else if (value !== undefined && value !== null) {
      formData.append(key, JSON.stringify(value));
    }
  });

  return formData;
};

export const normalizeBooleans = (data: any) => {
  const result = { ...data };
  Object.keys(result).forEach((key) => {
    if (result[key] === "true") result[key] = true;
    else if (result[key] === "false") result[key] = false;
  });
  return result;
};
