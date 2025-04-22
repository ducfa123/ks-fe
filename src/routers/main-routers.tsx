import { Navigate } from "react-router-dom";
import { LoginPage } from "../pages/login";
import { RouterLink } from "./routers";
import ProtectedOutlet from "./protected-outlet";
import { HomePage } from "../pages/home";
import { MainLayout } from "../layouts";
import { VaiTroPage } from "../pages/management/vai-tro";
import { PhanQuyenPage } from "../pages/management/quyen";
import { NguoiDungPage } from "../pages/management/nguoi-dung";
import { SystemFeatures, SystemAction } from "../types";

const MainRoutes = [
  { path: "*", element: <Navigate to={RouterLink.LOGIN} replace /> },

  {
    path: RouterLink.LOGIN,
    element: <LoginPage />,
  },
  {
    key: "private",
    path: "",
    element: <ProtectedOutlet requireLogin={true} />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          {
            path: RouterLink.HOME,
            element: <HomePage />,
          },
          {
            path: RouterLink.QUAN_LY_NGUOI_DUNG,
            element: <NguoiDungPage />,
            module: SystemFeatures.QuanLyNguoiDung,
            action: [SystemAction.View, SystemAction.Edit],
          },
          {
            path: RouterLink.QUAN_LY_VAI_TRO,
            element: <VaiTroPage />,
            module: SystemFeatures.PhanQuyen,
            action: [SystemAction.View, SystemAction.Edit],
          },
          {
            path: RouterLink.QUAN_LY_PHAN_QUYEN,
            element: <PhanQuyenPage />,
            module: SystemFeatures.PhanQuyen,
            action: [SystemAction.View, SystemAction.Edit],
          },
        ],
      },
    ],
  },
];

export default MainRoutes;
