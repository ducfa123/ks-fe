import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./index";
import { useNavigate } from "react-router-dom";
import { RouterLink } from "../routers/routers";
import { APIServices } from "../utils";
import { updateClientInfo } from "../redux/auth-client/auth-client.slice";
import { RootState } from "../redux/store";

export const useClientAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state: RootState) => state.authClient.token);

  useEffect(() => {
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await APIServices.Auth.getPermission();
          if (response.data) {
            dispatch(updateClientInfo(response.data));
          } else {
            navigate(RouterLink.CLIENT_LOGIN);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          navigate(RouterLink.CLIENT_LOGIN);
        }
      };

      fetchUserInfo();
    }
  }, [dispatch, navigate, token]);
};
