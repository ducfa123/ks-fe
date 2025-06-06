import {
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useAppSelector } from "../hooks";
import { useClientAuth } from "../hooks/useClientAuth";

interface UserInfo {
  _id: string;
  nguoi_gioi_thieu: string | null;
  vai_tro: string;
  tai_khoan: string;
  ho_ten: string;
  so_du: number;
  created_date: number;
  last_update: number;
  __v: number;
  chi_tiet_vai_tro: {
    _id: string;
    ten: string;
    last_update: number;
    created_date: number;
    __v: number;
  };
}

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useAppSelector(
    (state: RootState) => state.authClient.info
  ) as UserInfo | null;

  useClientAuth();

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        minHeight: "100vh",
        backgroundColor: "#f9f9f9"  // Light background for survey
      }}
    >
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 3, md: 5 }
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{ 
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
            p: { xs: 2, sm: 3, md: 4 },
            my: 4
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};