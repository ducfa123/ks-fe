import React from "react";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import {
  ShoppingCart,
  Menu,
  Search,
  Person,
  Facebook,
  Instagram,
  Twitter,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { RouterLink } from "../routers/routers";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const menuItems = [
    { text: "Trang chủ", path: RouterLink.CLIENT_HOME },
    { text: "Sản phẩm", path: RouterLink.CLIENT_PRODUCTS },
    { text: "Giới thiệu", path: RouterLink.CLIENT_ABOUT },
    { text: "Liên hệ", path: RouterLink.CLIENT_CONTACT },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <Menu />
              </IconButton>
              <Box
                component="img"
                src="/assets/images/logo.png"
                alt="Logo"
                sx={{ height: 40, cursor: "pointer" }}
                onClick={() => navigate(RouterLink.CLIENT_HOME)}
              />
            </Box>

            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton color="inherit">
                <Search />
              </IconButton>
              <IconButton color="inherit" onClick={() => navigate(RouterLink.CLIENT_LOGIN)}>
                <Person />
              </IconButton>
              <IconButton color="inherit" onClick={() => navigate(RouterLink.CLIENT_CHECKOUT)}>
                <Badge badgeContent={4} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{ cursor: "pointer" }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem
              onClick={() => navigate(RouterLink.CLIENT_LOGIN)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemText primary="Đăng nhập" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "background.paper",
          py: 3,
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
                Chúng tôi cung cấp các sản phẩm chất lượng với giá cả phải chăng
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Liên hệ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: support@example.com
                <br />
                Điện thoại: 0123 456 789
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
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
