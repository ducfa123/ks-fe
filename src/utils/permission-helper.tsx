import { SystemAction, SystemFeatures } from "../types";
import { FaEye, FaEdit } from "react-icons/fa";

// 🔹 Object ánh xạ giữa Enum & Text hiển thị
const SystemFeaturesTextMap: Record<SystemFeatures, string> = {
  [SystemFeatures.QuanLyNguoiDung]: "Quản lý người dùng",
  [SystemFeatures.PhanQuyen]: "Phân quyền",
};

export const getTextOfChucNang = (chucNang: SystemFeatures): string => {
  return SystemFeaturesTextMap[chucNang] || "Chức năng không xác định";
};

const SystemQuyenColorMap: Record<SystemAction, string> = {
  [SystemAction.View]: "#4CAF50",
  [SystemAction.Edit]: "#2196F3",
};

export const getColorOfQuyen = (quyen: SystemAction) => {
  return SystemQuyenColorMap[quyen] || "#757575";
};

const SystemQuyenIconMap: Record<SystemAction, any> = {
  [SystemAction.View]: <FaEye />,
  [SystemAction.Edit]: <FaEdit />,
};

export const getIconOfQuyen = (quyen: SystemAction) => {
  return SystemQuyenIconMap[quyen] || <FaEye />; // Mặc định trả về FaEye nếu không tìm thấy
};

export const getOptionsFromEnum = <T extends Record<string, string>>(
  enumObject: T,
  textMap: Record<T[keyof T], string>
): { value: string; label: string }[] => {
  return Object.values(enumObject).map((key) => ({
    value: key,
    label: textMap[key] || key, // Nếu không có trong textMap thì dùng key
  }));
};

export const SystemFeaturesOptions = getOptionsFromEnum(
  SystemFeatures,
  SystemFeaturesTextMap
);

export const SystemActionsTextMap: Record<SystemAction, string> = {
  [SystemAction.View]: SystemAction.View,
  [SystemAction.Edit]: SystemAction.Edit,
};

// 🟢 Lấy danh sách options cho SystemActions
export const SystemActionsOptions = getOptionsFromEnum(
  SystemAction,
  SystemActionsTextMap
);
