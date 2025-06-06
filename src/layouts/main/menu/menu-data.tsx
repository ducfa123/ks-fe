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
import { BsClockHistory } from "react-icons/bs";

export const menus: Array<SideMenuItem> = [
  {
    key: RouterLink.ADMIN_HOME,
    icon: <RiDashboardLine />,
    text: "Trang chủ",
    children: [],
    url: RouterLink.ADMIN_HOME,
  },
  {
    key: RouterKey.ADMIN_QUAN_LY_KHAO_SAT,
    icon: <CiShop />,
    text: "Quản lý khảo sát",
    children: [],
    url: RouterLink.ADMIN_QUAN_LY_KHAO_SAT,
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
