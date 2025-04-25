import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { RouterLink } from "../../../routers/routers";
import { TCouponInput } from "../../../components/tCounponInput";
import { APIServices } from "../../../utils";

interface CouponInfo {
  loai: string;
  giam: number;
  giam_phan_tram: number;
  valid: boolean;
  message: string;
}

const steps = [
  "Thông tin giao hàng",
  "Phương thức thanh toán",
  "Xác nhận đơn hàng",
];

export const ClientCheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    note: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState<CouponInfo | null>(null);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Handle order submission
      console.log("Submitting order...");
      navigate(RouterLink.CLIENT_HOME);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVerifyCoupon = async (code: string): Promise<CouponInfo> => {
    try {
      const response = await APIServices.PhieuGiamGiaService.getListEntity(1, 1, code);
      if (response.items.length > 0) {
        const coupon = response.items[0];
        return {
          loai: coupon.loai,
          giam: coupon.giam_tien,
          giam_phan_tram: coupon.giam_phan_tram,
          valid: true,
          message: ""
        };
      }
      return { 
        loai: "",
        giam: 0,
        giam_phan_tram: 0,
        valid: false,
        message: "Mã giảm giá không hợp lệ" 
      };
    } catch (err) {
      console.error("Error verifying coupon:", err);
      return { 
        loai: "",
        giam: 0,
        giam_phan_tram: 0,
        valid: false,
        message: "Có lỗi xảy ra khi kiểm tra mã giảm giá" 
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

  const shippingFee = 30000;
  let discount = 0;
  if (couponInfo?.valid) {
    if (couponInfo.loai === "giam_phan_tram") {
      discount = (total * couponInfo.giam_phan_tram) / 100;
    } else {
      discount = couponInfo.giam || 0;
    }
  }
  const finalTotal = total + shippingFee - discount;

  if (items.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Giỏ hàng trống
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(RouterLink.CLIENT_PRODUCTS)}
          sx={{ mt: 2 }}
        >
          Tiếp tục mua sắm
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Đơn hàng của bạn
            </Typography>
            <Divider sx={{ my: 2 }} />
            {items.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{ width: "100%", borderRadius: 1 }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Số lượng: {item.quantity}
                    </Typography>
                    <Typography variant="body1" color="primary">
                      {item.price.toLocaleString("vi-VN")}đ
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Tạm tính</Typography>
              <Typography>{total.toLocaleString("vi-VN")}đ</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Phí vận chuyển</Typography>
              <Typography>{shippingFee.toLocaleString("vi-VN")}đ</Typography>
            </Box>
            {couponInfo?.valid && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Giảm giá</Typography>
                <Typography color="error">
                  -{discount.toLocaleString("vi-VN")}đ
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Tổng cộng</Typography>
              <Typography variant="h6" color="primary">
                {finalTotal.toLocaleString("vi-VN")}đ
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <TCouponInput
                label="Mã giảm giá"
                value={couponCode}
                onChange={handleCouponChange}
                fetchCouponInfo={handleVerifyCoupon}
                info={couponInfo}
                onChangeInfo={setCouponInfo}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Shipping and Payment Forms */}
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin giao hàng
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Thành phố"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quận/Huyện"
                    name="district"
                    value={shippingInfo.district}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ghi chú"
                    name="note"
                    value={shippingInfo.note}
                    onChange={handleShippingInfoChange}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {activeStep === 1 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Phương thức thanh toán
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label="Thanh toán khi nhận hàng (COD)"
                  />
                  <FormControlLabel
                    value="bank"
                    control={<Radio />}
                    label="Chuyển khoản ngân hàng"
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
          )}

          {activeStep === 2 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Xác nhận đơn hàng
              </Typography>
              <Typography>
                Vui lòng kiểm tra lại thông tin đơn hàng trước khi xác nhận
              </Typography>
            </Paper>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Quay lại
            </Button>
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Đặt hàng" : "Tiếp tục"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
