import { RouterKey, RouterLink } from "../../../routers/routers";
import { SideMenuItem, SystemAction, SystemFeatures } from "../../../types";
import { IoPeople, IoSettings } from "react-icons/io5";
import { RiDashboardLine } from "react-icons/ri";
import {
  MdAdminPanelSettings,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { CiShop } from "react-icons/ci";
import { TbCategory2 } from "react-icons/tb";

export const menus: Array<SideMenuItem> = [
  {
    key: RouterLink.HOME,
    icon: <RiDashboardLine />,
    text: "Trang chủ",
    children: [],
    url: RouterLink.HOME,
  },
  {
    key: RouterKey.QUAN_LY_BAN_HANG,
    icon: <CiShop />,
    text: "Quản lý bán hàng",
    children: [
      {
        key: RouterLink.QUAN_LY_DANH_MUC_SAN_PHAM,
        icon: <TbCategory2 />,
        text: "Danh mục sản phẩm",
        children: [],
        url: RouterLink.QUAN_LY_DANH_MUC_SAN_PHAM,
        module: SystemFeatures.QuanLyDanhMucSanPham,
        action: [SystemAction.View, SystemAction.Edit],
      },

      {
        key: RouterLink.QUAN_LY_SAN_PHAM,
        icon: <MdOutlineProductionQuantityLimits />,
        text: "Sản phẩm",
        children: [],
        url: RouterLink.QUAN_LY_SAN_PHAM,
        module: SystemFeatures.QuanLySanPham,
        action: [SystemAction.View, SystemAction.Edit],
      },
    ],
  },
  {
    key: RouterKey.QUAN_LY_HE_THONG,
    icon: <IoSettings />,
    text: "Quản lý hệ thống",
    children: [
      {
        key: RouterLink.QUAN_LY_NGUOI_DUNG,
        icon: <IoPeople />,
        text: "Người dùng",
        children: [],
        url: RouterLink.QUAN_LY_NGUOI_DUNG,
        module: SystemFeatures.QuanLyNguoiDung,
        action: [SystemAction.View, SystemAction.Edit],
      },

      {
        key: RouterLink.QUAN_LY_VAI_TRO,
        icon: <MdAdminPanelSettings />,
        text: "Vai trò",
        children: [],
        url: RouterLink.QUAN_LY_VAI_TRO,
        module: SystemFeatures.PhanQuyen,
        action: [SystemAction.View, SystemAction.Edit],
      },
    ],
  },
];
