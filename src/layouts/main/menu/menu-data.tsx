import { RouterKey, RouterLink } from "../../../routers/routers";
import { SideMenuItem, SystemAction, SystemFeatures } from "../../../types";
import { IoGift, IoPeople, IoSettings } from "react-icons/io5";
import { RiDashboardLine, RiListCheck3 } from "react-icons/ri";
import {
  MdAdminPanelSettings,
  MdOutlineAccountTree,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { CiShop } from "react-icons/ci";
import { TbCategory2 } from "react-icons/tb";

export const menus: Array<SideMenuItem> = [
  {
    key: RouterLink.ADMIN_HOME,
    icon: <RiDashboardLine />,
    text: "Trang chủ",
    children: [],
    url: RouterLink.ADMIN_HOME,
  },
  {
    key: RouterKey.ADMIN_QUAN_LY_BAN_HANG,
    icon: <CiShop />,
    text: "Quản lý bán hàng",
    children: [
      {
        key: RouterLink.ADMIN_QUAN_LY_DANH_MUC_SAN_PHAM,
        icon: <TbCategory2 />,
        text: "Danh mục sản phẩm",
        children: [],
        url: RouterLink.ADMIN_QUAN_LY_DANH_MUC_SAN_PHAM,
        module: SystemFeatures.QuanLyDanhMucSanPham,
        action: [SystemAction.View, SystemAction.Edit],
      },
      {
        key: RouterLink.ADMIN_QUAN_LY_SAN_PHAM,
        icon: <MdOutlineProductionQuantityLimits />,
        text: "Sản phẩm",
        children: [],
        url: RouterLink.ADMIN_QUAN_LY_SAN_PHAM,
        module: SystemFeatures.QuanLySanPham,
        action: [SystemAction.View, SystemAction.Edit],
      },
      {
        key: RouterLink.ADMIN_QUAN_LY_PHIEU_GIAM_GIA,
        icon: <IoGift />,
        text: "Giảm giá",
        children: [],
        url: RouterLink.ADMIN_QUAN_LY_PHIEU_GIAM_GIA,
        module: SystemFeatures.QuanLyPhieuGiamGia,
        action: [SystemAction.View, SystemAction.Edit],
      },
      {
        key: RouterLink.ADMIN_QUAN_LY_COMBO_SAN_PHAM,
        icon: <RiListCheck3 />,
        text: "Combo sản phẩm",
        children: [],
        url: RouterLink.ADMIN_QUAN_LY_COMBO_SAN_PHAM,
        module: SystemFeatures.QuanLySanPham,
        action: [SystemAction.View, SystemAction.Edit],
      },
      {
        key: RouterLink.ADMIN_QUAN_LY_TAI_KHOAN_SAN_PHAM,
        icon: <MdOutlineAccountTree />,
        text: "Tài khoản sản phẩm",
        children: [],
        url: RouterLink.ADMIN_QUAN_LY_TAI_KHOAN_SAN_PHAM,
        module: SystemFeatures.QuanLySanPham,
        action: [SystemAction.View, SystemAction.Edit],
      },
    ],
  },
  {
    key: RouterKey.ADMIN_QUAN_LY_HE_THONG,
    icon: <IoSettings />,
    text: "Quản lý hệ thống",
    children: [
      {
        key: RouterLink.ADMIN_QUAN_LY_NGUOI_DUNG,
        icon: <IoPeople />,
        text: "Người dùng",
        children: [],
        url: RouterLink.ADMIN_QUAN_LY_NGUOI_DUNG,
        module: SystemFeatures.QuanLyNguoiDung,
        action: [SystemAction.View, SystemAction.Edit],
      },
      {
        key: RouterLink.ADMIN_QUAN_LY_VAI_TRO,
        icon: <MdAdminPanelSettings />,
        text: "Vai trò",
        children: [],
        url: RouterLink.ADMIN_QUAN_LY_VAI_TRO,
        module: SystemFeatures.PhanQuyen,
        action: [SystemAction.View, SystemAction.Edit],
      },
    ],
  },
];
