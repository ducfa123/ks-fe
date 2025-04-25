import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Badge,
  Grid,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Facebook,
  Instagram,
  Twitter,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RouterLink } from "../routers/routers";
import logo from "../assets/images/logo.jpg";
import CartDrawer from "../components/CartDrawer";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);

  const menuItems = [
    { text: "Trang chủ", path: RouterLink.CLIENT_HOME },
    { text: "Sản phẩm", path: RouterLink.CLIENT_PRODUCTS },
    { text: "Giới thiệu", path: RouterLink.CLIENT_ABOUT },
    { text: "Liên hệ", path: RouterLink.CLIENT_CONTACT },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Box component="img" src={logo} alt="Intx" sx={{ height: "40px" }} />
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{ cursor: "pointer" }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        sx={{ bgcolor: "white", color: "black" }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: 40, mr: 2, cursor: "pointer" }}
              onClick={() => navigate(RouterLink.CLIENT_HOME)}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: "pointer" }}
              onClick={() => navigate(RouterLink.CLIENT_HOME)}
            >
              Shop Tools
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
              <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
                <Badge badgeContent={items.length} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <PersonIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              top: 64,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "#f5f5f5",
          py: 4,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Về chúng tôi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Shop Tools - Nơi cung cấp các công cụ và thiết bị chất lượng cao
                cho mọi nhu cầu của bạn.
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Liên hệ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: support@shoptools.com
                <br />
                Điện thoại: 0123 456 789
                <br />
                Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Theo dõi chúng tôi
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton color="primary">
                  <Facebook />
                </IconButton>
                <IconButton color="primary">
                  <Instagram />
                </IconButton>
                <IconButton color="primary">
                  <Twitter />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 2 }}
          >
            © {new Date().getFullYear()} Intx. All rights reserved.
          </Typography>
        </Container>
      </Box>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </Box>
  );
};
