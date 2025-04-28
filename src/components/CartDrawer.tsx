import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { removeFromCart, updateQuantity, selectCartTotal } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { RouterLink } from "../routers/routers";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.cart.items);
  const total = useSelector(selectCartTotal);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    onClose();
    navigate(RouterLink.CLIENT_CHECKOUT);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 400, maxWidth: "100%" },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Giỏ hàng</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {items.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 8,
            textAlign: 'center'
          }}>
            <Box sx={{ 
              width: 120, 
              height: 120, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'grey.100',
              borderRadius: '50%',
              mb: 2
            }}>
              <ShoppingCartIcon sx={{ fontSize: 60, color: 'grey.400' }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              Giỏ hàng trống
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                onClose();
                navigate(RouterLink.CLIENT_PRODUCTS);
              }}
              sx={{ 
                borderRadius: 2,
                px: 4,
                py: 1
              }}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        ) : (
          <>
            <List>
              {items.map((item) => (
                <Box key={item.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleRemoveItem(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 60,
                          height: 60,
                          objectFit: 'contain',
                          borderRadius: 1,
                          p: 1,
                          backgroundColor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                            }
                            inputProps={{ min: 1, style: { textAlign: "center" } }}
                            sx={{ width: 60 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                    />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </Typography>
                  </ListItem>
                  <Divider />
                </Box>
              ))}
            </List>

            <Box sx={{ mt: 2, p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6">Tổng cộng:</Typography>
                <Typography variant="h6" color="primary">
                  {total.toLocaleString("vi-VN")}đ
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckout}
                sx={{ mt: 2 }}
              >
                Thanh toán
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer; 