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
  Link,
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
            sx={{ 
              cursor: "pointer",
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <ListItemText 
              primary={item.text} 
              sx={{
                textAlign: 'center',
                '& .MuiTypography-root': {
                  fontWeight: window.location.pathname === item.path ? 600 : 400,
                  color: window.location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ 
          bgcolor: "white", 
          color: "black",
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))',
          fontFamily: 'Be Vietnam Pro, sans-serif',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            minHeight: 80,
            fontFamily: 'inherit',
          }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ 
                height: 40, 
                mr: 2, 
                cursor: "pointer",
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onClick={() => navigate(RouterLink.CLIENT_HOME)}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                flexGrow: 1, 
                cursor: "pointer",
                fontWeight: 600,
                letterSpacing: '0.5px',
                fontFamily: 'inherit',
              }}
              onClick={() => navigate(RouterLink.CLIENT_HOME)}
            >
              Shop Tools
            </Typography>

            {!isMobile && (
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 4,
                mr: 4,
                fontFamily: 'inherit',
              }}>
                {menuItems.map((item) => (
                  <Link
                    key={item.text}
                    component="button"
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: window.location.pathname === item.path ? theme.palette.primary.main : 'text.primary',
                      textDecoration: 'none',
                      fontWeight: window.location.pathname === item.path ? 600 : 400,
                      position: 'relative',
                      fontFamily: 'inherit',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: window.location.pathname === item.path ? theme.palette.primary.main : 'transparent',
                        transition: 'all 0.3s ease',
                      },
                      '&:hover:after': {
                        backgroundColor: theme.palette.primary.main,
                      }
                    }}
                  >
                    {item.text}
                  </Link>
                ))}
              </Box>
            )}

            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 2,
              '& .MuiIconButton-root': {
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  transform: 'scale(1.1)'
                }
              }
            }}>
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
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              )}
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
              top: 80,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
