import { Navigate, Outlet } from "react-router-dom";
import { LoginPage } from "../pages/login";
import { RouterLink } from "./routers";
import ProtectedOutlet from "./protected-outlet";
import { MainLayout } from "../layouts/main";
import { VaiTroPage } from "../pages/management/vai-tro";
import { PhanQuyenPage } from "../pages/management/quyen";
import { NguoiDungPage } from "../pages/management/nguoi-dung";
import { SystemFeatures, SystemAction } from "../types";
import { DanhMucSanPhamPage } from "../pages/management/danh-muc-san-pham";
import { SanPhamPage } from "../pages/management/san-pham";
import { PhieuGiamGiaPage } from "../pages/management/phieu-giam-gia";
import { ComboSanPhamPage } from "../pages/management/combo-san-pham";
import { TaiKhoanSanPhamPage } from "../pages/management/tai-khoan-san-pham";
import { ClientLayout } from "../layouts/ClientLayout";
import { ClientHomePage } from "../pages/Client/Home";
import { ClientProductsPage } from "../pages/Client/Products";
import { ClientCheckoutPage } from "../pages/Client/Checkout";
import { ChartDashboard } from "../components/ChartDashboard";
import { ClientAboutPage } from "../pages/Client/About";
import { ClientContactPage } from "../pages/Client/Contact";
import ClientLoginPage from "../pages/Client/login";
import { ClientOrderHistoryPage } from "../pages/Client/OrderHistory";

const MainRoutes = [
  // Client routes
  {
    path: "/",
    element: (
      <ClientLayout>
        <Outlet />
      </ClientLayout>
    ),
    children: [
      // { path: "", element: <Navigate to={RouterLink.CLIENT_HOME} replace /> },
      {
        path: RouterLink.CLIENT_HOME,
        element: <ClientHomePage />,
      },
      {
        path: RouterLink.CLIENT_PRODUCTS.replace("/", ""),
        element: <ClientProductsPage />,
      },
      {
        path: RouterLink.CLIENT_CHECKOUT.replace("/", ""),
        element: <ClientCheckoutPage />,
      },
      {
        path: RouterLink.CLIENT_ABOUT.replace("/", ""),
        element: <ClientAboutPage />,
      },
      {
        path: RouterLink.CLIENT_CONTACT.replace("/", ""),
        element: <ClientContactPage />,
      },
      {
        path: "order-history",
        element: <ClientOrderHistoryPage />,
      },
      { path: "*", element: <Navigate to={RouterLink.CLIENT_HOME} replace /> },
    ],
  },
  // Admin routes
  {
    path: "/admin",
    element: <ProtectedOutlet requireLogin={true} />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          {
            path: "",
            element: <Navigate to={RouterLink.ADMIN_LOGIN} replace />,
          },
          {
            path: RouterLink.ADMIN_HOME,
            element: <ChartDashboard />,
          },
          {
            path: RouterLink.ADMIN_QUAN_LY_NGUOI_DUNG,
            element: <NguoiDungPage />,
            module: SystemFeatures.QuanLyNguoiDung,
            action: [SystemAction.View, SystemAction.Edit],
          },
          {
            path: RouterLink.ADMIN_QUAN_LY_VAI_TRO,
            element: <VaiTroPage />,
            module: SystemFeatures.PhanQuyen,
            action: [SystemAction.View, SystemAction.Edit],
          },
          {
            path: RouterLink.ADMIN_QUAN_LY_PHAN_QUYEN,
            element: <PhanQuyenPage />,
            module: SystemFeatures.PhanQuyen,
            action: [SystemAction.View, SystemAction.Edit],
          },
          {
            path: RouterLink.ADMIN_QUAN_LY_DANH_MUC_SAN_PHAM,
            element: <DanhMucSanPhamPage />,
            module: SystemFeatures.QuanLyDanhMucSanPham,
            action: [SystemAction.View, SystemAction.Edit],
          },
          {
            path: RouterLink.ADMIN_QUAN_LY_SAN_PHAM,
            element: <SanPhamPage />,
            module: SystemFeatures.QuanLySanPham,
            action: [SystemAction.View, SystemAction.Edit],
          },
          {
            path: RouterLink.ADMIN_QUAN_LY_PHIEU_GIAM_GIA,
            element: <PhieuGiamGiaPage />,
            module: SystemFeatures.QuanLyPhieuGiamGia,
            action: [SystemAction.View, SystemAction.Edit],
          },
          {
            path: RouterLink.ADMIN_QUAN_LY_COMBO_SAN_PHAM,
            element: <ComboSanPhamPage />,
            module: SystemFeatures.QuanLySanPham,
            action: [SystemAction.View, SystemAction.Edit],
          },
          {
            path: RouterLink.ADMIN_QUAN_LY_TAI_KHOAN_SAN_PHAM,
            element: <TaiKhoanSanPhamPage />,
            module: SystemFeatures.QuanLySanPham,
            action: [SystemAction.View, SystemAction.Edit],
          },
        ],
      },
    ],
  },
  // Auth routes
  { path: RouterLink.ADMIN_LOGIN, element: <LoginPage /> },
  { path: RouterLink.CLIENT_LOGIN, element: <ClientLoginPage /> },
  // Default route
  // { path: "*", element: <Navigate to={RouterLink.CLIENT_HOME} replace /> },
];

export default MainRoutes;
