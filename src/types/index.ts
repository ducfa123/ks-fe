export * from "./menu-items.type";
export * from "./param-search.type";
export * from "./format-time.enum";
export * from "./field-type.enum";
export * from "./permissions.type";

export enum SystemFeatures {
  QuanLyNguoiDung = "QuanLyNguoiDung",
  PhanQuyen = "PhanQuyen",
  QuanLyDanhMucSanPham = "QuanLyDanhMucSanPham",
  QuanLySanPham = "QuanLySanPham",
  QuanLyPhieuGiamGia = "QuanLyPhieuGiamGia",
}

export enum SystemAction {
  View = "View",
  Edit = "Edit",
}
