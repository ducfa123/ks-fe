export const RouterLink = {
  // Admin routes
  ADMIN_LOGIN: "/admin/dang-nhap",
  ADMIN_HOME: "/admin/trang-chu",
  ADMIN_QUAN_LY_NGUOI_DUNG: "/admin/he-thong/quan-ly-nguoi-dung",
  ADMIN_QUAN_LY_VAI_TRO: "/admin/he-thong/quan-ly-vai-tro",
  ADMIN_QUAN_LY_PHAN_QUYEN: "/admin/he-thong/quan-ly-phan-quyen/:vaiTroId",
  ADMIN_QUAN_LY_COMBO_SAN_PHAM: "/admin/he-thong/quan-ly-combo-san-pham",
  ADMIN_QUAN_LY_TAI_KHOAN_SAN_PHAM:
    "/admin/he-thong/quan-ly-tai-khoan-san-pham",
  ADMIN_QUAN_LY_DANH_MUC_SAN_PHAM: "/admin/ban-hang/quan-ly-danh-muc-san-pham",
  ADMIN_QUAN_LY_SAN_PHAM: "/admin/ban-hang/quan-ly-san-pham",
  ADMIN_QUAN_LY_PHIEU_GIAM_GIA: "/admin/ban-hang/quan-ly-phieu-giam-gia",
  ADMIN_LICH_SU_DON_HANG: "/admin/ban-hang/lich-su-don-hang",
  ADMIN_QUAN_LY_KHAO_SAT: "/admin/khao-sat",

  // Client routes
  CLIENT_HOME: "/",
  CLIENT_PRODUCTS: "/san-pham",
  CLIENT_CHECKOUT: "/thanh-toan",
  CLIENT_LOGIN: "/dang-nhap",
  CLIENT_ABOUT: "/gioi-thieu",
  CLIENT_CONTACT: "/lien-he",
} as const;

export const RouterKey = {
  // Admin keys
  ADMIN_LOGIN: "ADMIN_LOGIN",
  ADMIN_HOME: "ADMIN_HOME",
  ADMIN_QUAN_LY_KHAO_SAT: "/admin/khao-sat",
  ADMIN_QUAN_LY_HE_THONG: "/admin/he-thong",
  ADMIN_LICH_SU_DON_HANG: "ADMIN_LICH_SU_DON_HANG",

  // Client keys
  CLIENT_HOME: "CLIENT_HOME",
  CLIENT_PRODUCTS: "CLIENT_PRODUCTS",
  CLIENT_CHECKOUT: "CLIENT_CHECKOUT",
  CLIENT_LOGIN: "CLIENT_LOGIN",
  CLIENT_ABOUT: "CLIENT_ABOUT",
  CLIENT_CONTACT: "CLIENT_CONTACT",
} as const;
