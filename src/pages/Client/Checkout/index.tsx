import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { RouterLink } from "../../../routers/routers";
import { TCouponInput } from "../../../components/tCounponInput";
import { APIServices } from "../../../utils";
import { selectCartTotal, updateQuantity, removeFromCart } from "../../../redux/slices/cartSlice";

interface CouponInfo {
  loai: string;
  giam: number;
  giam_phan_tram: number;
  valid: boolean;
  message: string;
}

export const ClientCheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const total = useSelector(selectCartTotal);
  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState<CouponInfo | null>(null);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleVerifyCoupon = async (code: string): Promise<CouponInfo> => {
    try {
      const response = await APIServices.PhieuGiamGiaService.getListEntity(
        1,
        1,
        code
      );
      if (response.items.length > 0) {
        const coupon = response.items[0];
        return {
          loai: coupon.loai,
          giam: coupon.giam_tien,
          giam_phan_tram: coupon.giam_phan_tram,
          valid: true,
          message: "",
        };
      }
      return {
        loai: "",
        giam: 0,
        giam_phan_tram: 0,
        valid: false,
        message: "Mã giảm giá không hợp lệ",
      };
    } catch (err) {
      console.error("Error verifying coupon:", err);
      return {
        loai: "",
        giam: 0,
        giam_phan_tram: 0,
        valid: false,
        message: "Có lỗi xảy ra khi kiểm tra mã giảm giá",
      };
    }
  };

  const handleCouponChange = (code: string) => {
    setCouponCode(code);
    if (code) {
      handleVerifyCoupon(code).then((info) => {
        setCouponInfo(info);
      });
    } else {
      setCouponInfo(null);
    }
  };

  let discount = 0;
  if (couponInfo?.valid) {
    if (couponInfo.loai === "giam_phan_tram") {
      discount = (total * couponInfo.giam_phan_tram) / 100;
    } else {
      discount = couponInfo.giam || 0;
    }
  }
  const finalTotal = total - discount;

  if (items.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
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
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
            Giỏ hàng trống
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(RouterLink.CLIENT_PRODUCTS)}
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Đơn hàng của bạn
            </Typography>
            <Divider sx={{ my: 3 }} />
            {items.map((item) => (
              <Box key={item.id} sx={{ mb: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={3}>
                    {!item.isCombo && (
                      <Grid item xs={4}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: "100%",
                            height: 70,
                            objectFit: "contain",
                            borderRadius: 1,
                            p: 2,
                            backgroundColor: "background.paper",
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={item.isCombo ? 12 : 8}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          textAlign: "left",
                        }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold", mb: 2 }}
                            >
                              {item.name}
                            </Typography>
                            <IconButton 
                              onClick={() => handleRemoveItem(item.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          {item.isCombo && (
                            <Box sx={{ mt: 3 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                Sản phẩm trong combo:
                              </Typography>
                              <Grid container spacing={2}>
                                {item.danh_sach_san_pham_detail?.map(
                                  (product) => (
                                    <Grid item xs={6} key={product._id}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          p: 2,
                                          border: "1px solid",
                                          borderColor: "divider",
                                          borderRadius: 1,
                                          backgroundColor: "background.paper",
                                        }}
                                      >
                                        <Box
                                          component="img"
                                          src={product.hinh_anh[0]}
                                          alt={product.ten}
                                          sx={{
                                            width: "100%",
                                            height: 60,
                                            objectFit: "contain",
                                            mb: 2,
                                            p: 1,
                                          }}
                                        />
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            textAlign: "center",
                                            fontSize: "0.75rem",
                                            fontWeight: 500,
                                          }}
                                        >
                                          {product.ten}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  )
                                )}
                              </Grid>
                            </Box>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            mt: 3,
                            pt: 3,
                            borderTop: "1px solid",
                            borderColor: "divider",
                          }}
                        >
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
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{ fontWeight: "bold" }}
                          >
                            {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Payment Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Tổng đơn hàng
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography>Tạm tính</Typography>
              <Typography>{total.toLocaleString("vi-VN")}đ</Typography>
            </Box>
            {couponInfo?.valid && (
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography>Giảm giá</Typography>
                <Typography color="error">
                  -{discount.toLocaleString("vi-VN")}đ
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h6">Tổng cộng</Typography>
              <Typography variant="h6" color="primary">
                {finalTotal.toLocaleString("vi-VN")}đ
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TCouponInput
                label="Mã giảm giá"
                value={couponCode}
                onChange={handleCouponChange}
                fetchCouponInfo={handleVerifyCoupon}
                info={couponInfo}
                onChangeInfo={setCouponInfo}
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => {
                // Handle payment
                console.log("Processing payment...");
                navigate(RouterLink.CLIENT_HOME);
              }}
            >
              Thanh toán
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
