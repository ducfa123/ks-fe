import { FC, useCallback, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RouterLink } from "./routers";
import { useAppDispatch, useAppSelector } from "../hooks";
import { APIServices } from "../utils";
import { Permission } from "../types";
import { logout, updateInfo, updatePermisson } from "../redux/auth/auth.slice";

type RouterProps = {
  module?: string;
  action?: string;
  requireLogin?: boolean;
};

const ProtectedOutlet: FC<RouterProps> = ({ requireLogin = false }) => {
  const { isLogin } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const location = useLocation();

  const loadPermission = useCallback(async () => {
    try {
      const request = await APIServices.Auth.getPermission();
      const { data } = request;
      const { permisisons } = data;

      if (Array.isArray(permisisons)) {
        const ix: Array<Permission> = permisisons.map((i) => {
          return {
            module: i?.chuc_nang,
            action: i?.quyen,
          };
        });

        dispatch(updatePermisson(ix));
      }
    } catch {}
  }, [dispatch]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const ans: any = await APIServices.Auth.checkToken();
        const { data: user } = ans;

        dispatch(
          updateInfo({
            _id: user?._id,
            ho_ten: user?.ho_ten,
            tai_khoan: user?.tai_khoan,
            vai_tro: user?.vai_tro,
            phong_ban: user?.phong_ban,
            so_du: user?.so_du,
            email: user?.email,
            sdt: user?.sdt,
          })
        );
      } catch {
        dispatch(logout());
      }
    };

    checkToken();
  }, [dispatch, location]);

  useEffect(() => {
    loadPermission();
  }, [loadPermission]);

  if (requireLogin && !isLogin) return <Navigate to={RouterLink.ADMIN_LOGIN} />;

  return <Outlet />;
};

export default ProtectedOutlet;
