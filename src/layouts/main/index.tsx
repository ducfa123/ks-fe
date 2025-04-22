import {Outlet} from "react-router-dom";
import {ModalChangePassword} from "./modal-change-password";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
  setModalChangePasswordState,
  setModalChangeUserInfoState,
} from "../../redux/global/global.slice";
import {Layout} from "antd";
import {Box} from "@mui/material";
import HeaderCustom from "./header";
import {Menu} from "./menu";
import {ModalUpdateUserInfo} from "./modal-update-user-info";

export const MainLayout = () => {
  const modalChangePasswordState = useAppSelector(
    state => state.global.modalChangePasswordState
  );
  const modalUpdateUserInfoState = useAppSelector(
    state => state.global.modalUpdateUserInfoState
  );

  const {collapsed} = useAppSelector(state => state.global);

  const dispatch = useAppDispatch();

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box sx={{display: "flex", flex: 1, flexDirection: "row"}}>
        <Box sx={{position: "fixed"}}>
          <Menu />
        </Box>

        <Layout
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            backgroundColor: "#F0F7FC",
            zIndex: "0 !important",
            marginLeft: collapsed ? "100px" : "240px",
            width: `calc(100vw - ${collapsed ? "100px" : "240px"})`,
          }}
        >
          <HeaderCustom />
          <Box
            sx={{
              display: "flex",
              marginTop: "70px",
              width: `100%`,
              flex: 1,
              padding: "20px",
            }}
          >
            <Outlet />
          </Box>
        </Layout>
      </Box>

      <ModalChangePassword
        visible={modalChangePasswordState}
        onClose={() => {
          dispatch(setModalChangePasswordState(false));
        }}
      />
      <ModalUpdateUserInfo
        visible={modalUpdateUserInfoState}
        onClose={() => {
          dispatch(setModalChangeUserInfoState(false));
        }}
      />
    </Box>
  );
};
