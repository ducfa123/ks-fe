import {
  ArrowDropDown,
  LockOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaTelegram } from "react-icons/fa";
import { IoOptions } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import UserImage from "../../../assets/images/user.png";
import { ModalComponent } from "../../../components";
import { TelegramConnectBox } from "../../../components/tTelegramConnectQR";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { logout } from "../../../redux/auth/auth.slice";
import {
  setCollapsed,
  setModalChangePasswordState,
  setModalChangeUserInfoState,
} from "../../../redux/global/global.slice";
import { APIServices } from "../../../utils";
import { formatNumberVND } from "../../../utils/common";

const StyledAppBar = styled(AppBar)({
  background: "#FCFDFE",
  boxShadow: "none",
  height: "69px",
  position: "fixed",
  borderBottom: "1px solid #E0E0E0",
  zIndex: 1000,
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const HeaderCustom: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const info = useAppSelector((state) => state.auth.info);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);
  const [openTelegramModal, setOpenTelegramModal] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const { collapsed } = useAppSelector((state) => state.global);
  
  const setCollapse = (value: boolean) => dispatch(setCollapsed(value));
  const router = useNavigate();

  const checkTelegramStatus = async () => {
    try {
      const info = await APIServices.TelegramService.getMyTelegramInfo();
      setTelegramConnected(info?.telegram_id ? true : false);
    } catch (err) {
      setTelegramConnected(false);
    }
  };

  useEffect(() => {
    checkTelegramStatus();
  }, [openTelegramModal]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleOpenChangePassword = () => {
    dispatch(setModalChangePasswordState(true));
    handleMenuClose();
  };

  const handleOpenChangeUserInfo = () => {
    dispatch(setModalChangeUserInfoState(true));
    handleMenuClose();
  };

  const handleOpenTelegramConnect = () => {
    setOpenTelegramModal(true);
    handleMenuClose();
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    menuKey: string
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menuKey);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          fontFamily: "Be Vietnam Pro",
          position: "relative",
          width: `calc(100% - ${collapsed ? "100px" : "240px"})`,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}
        >
          <Box
            sx={{
              color: "black",
              cursor: "pointer",
              fontSize: "20px",
            }}
            onClick={() => {
              setCollapse(!collapsed);
            }}
          >
            <IoOptions />
          </Box>
          <Box
            sx={{
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              fontFamily: "Be Vietnam Pro",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={() => {
              router(-1);
            }}
          >
            <FaAngleLeft /> Quay lại
          </Box>
        </Box>

        <Box
          onClick={(event) => handleMenuOpen(event, "user")}
          sx={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
            color: "black",
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              fontFamily: "Be Vietnam Pro",
              marginRight: "10px",
              display: "flex",
              gap: "5px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Số dư:{" "}
            <Box sx={{ fontWeight: 600 }}>
              {formatNumberVND(info?.so_du ?? 0)}
            </Box>{" "}
            VNĐ
          </Box>
          <Tooltip
            title={
              telegramConnected
                ? "Đã kết nối Telegram"
                : "Chưa kết nối Telegram"
            }
          >
            <Box sx={{ mr: 2 }}>
              {telegramConnected ? (
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <FaTelegram style={{ fontSize: "20px", color: "#0088cc" }} />
                </StyledBadge>
              ) : (
                <FaTelegram style={{ fontSize: "20px", color: "#gray" }} />
              )}
            </Box>
          </Tooltip>
          <Avatar src={UserImage} sx={{ width: 24, height: 24 }} />
          <Box
            sx={{
              fontFamily: "Be Vietnam Pro",
              color: "black",
            }}
          >
            {info?.ho_ten}
          </Box>
          <ArrowDropDown />
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={currentMenu === "user"}
        onClose={handleMenuClose}
        sx={{ width: "300px" }}
      >
        <MenuItem
          onClick={handleOpenTelegramConnect}
          sx={{
            justifyContent: "flex-start",
            padding: "10px",
            fontFamily: "Be Vietnam Pro",
            fontSize: "14px",
          }}
        >
          <FaTelegram
            style={{
              fontSize: "20px",
              marginRight: "7px",
              color: telegramConnected ? "#0088cc" : "gray",
            }}
          />
          {telegramConnected ? "Đã liên kết Telegram" : "Liên kết Telegram"}
        </MenuItem>
        <MenuItem
          onClick={handleOpenChangeUserInfo}
          sx={{
            justifyContent: "flex-start",
            padding: "10px",
            fontFamily: "Be Vietnam Pro",
            fontSize: "14px",
          }}
        >
          <AccountCircleIcon sx={{ marginRight: 1, fontSize: "20px" }} />
          Cập nhật thông tin cá nhân
        </MenuItem>
        <MenuItem
          onClick={handleOpenChangePassword}
          sx={{
            justifyContent: "flex-start",
            padding: "10px",
            fontFamily: "Be Vietnam Pro",
            fontSize: "14px",
          }}
        >
          <LockOutlined sx={{ marginRight: 1, fontSize: "20px" }} />
          Đổi mật khẩu
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            justifyContent: "flex-start",
            padding: "10px",
            fontFamily: "Be Vietnam Pro",
            fontSize: "14px",
          }}
        >
          <LogoutOutlined sx={{ marginRight: 1, fontSize: "20px" }} />
          Đăng xuất
        </MenuItem>
      </Menu>

      <ModalComponent
        visible={openTelegramModal}
        onClose={() => setOpenTelegramModal(false)}
        title={""}
      >
        <TelegramConnectBox />
      </ModalComponent>
    </StyledAppBar>
  );
};

export default HeaderCustom;
