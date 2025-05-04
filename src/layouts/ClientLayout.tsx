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
  Badge,
  Link,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Home,
  MenuBook,
  Info,
  ContactMail,
  Logout,
  History,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { RouterLink } from "../routers/routers";
import logo from "../assets/images/logo.jpg";
import CartDrawer from "../components/CartDrawer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useAppSelector } from "../hooks";
import { useClientAuth } from "../hooks/useClientAuth";
import { logoutClient } from "../redux/auth-client/auth-client.slice";

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

export const ClientLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { items } = useSelector((state: RootState) => state.cart);
  const user = useAppSelector((state: RootState) => state.authClient.info) as UserInfo | null;

  useClientAuth();

  const menuItems = [
    { text: "Trang chủ", path: RouterLink.CLIENT_HOME },
    { text: "Sản phẩm", path: RouterLink.CLIENT_PRODUCTS },
    { text: "Giới thiệu", path: RouterLink.CLIENT_ABOUT },
    { text: "Liên hệ", path: RouterLink.CLIENT_CONTACT },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutClient());
    handleMenuClose();
    navigate(RouterLink.CLIENT_LOGIN);
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
              IntX Shop
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
              {user ? (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <PersonIcon />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {user.ho_ten}
                    </Typography>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={() => {
                      navigate('/order-history');
                      handleMenuClose();
                    }}>
                      <History sx={{ mr: 1 }} />
                      Lịch sử đơn hàng
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <Logout sx={{ mr: 1 }} />
                      Đăng xuất
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <IconButton 
                  color="inherit"
                  onClick={() => navigate(RouterLink.CLIENT_LOGIN)}
                >
                  <PersonIcon />
                </IconButton>
              )}
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
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: theme.palette.primary.main,
          color: "white",
          py: 4,
          mt: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                IntX Shop
              </Typography>
              <Typography variant="body2">
                Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM
              </Typography>
              <Typography variant="body2">
                Điện thoại: 0123 456 789
              </Typography>
              <Typography variant="body2">
                Email: contact@intxshop.com
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Liên kết nhanh
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <IconButton
                  color="inherit"
                  onClick={() => navigate(RouterLink.CLIENT_HOME)}
                >
                  <Home />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => navigate(RouterLink.CLIENT_PRODUCTS)}
                >
                  <MenuBook />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => navigate(RouterLink.CLIENT_ABOUT)}
                >
                  <Info />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => navigate(RouterLink.CLIENT_CONTACT)}
                >
                  <ContactMail />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </Box>
  );
};
