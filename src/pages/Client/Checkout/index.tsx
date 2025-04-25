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

const steps = [
  "Thông tin giao hàng",
  "Phương thức thanh toán",
  "Xác nhận đơn hàng",
];

const cartItems = [
  {
    id: 1,
    name: "iPhone 13 Pro Max",
    price: "29.990.000đ",
    image:
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    quantity: 1,
  },
  {
    id: 2,
    name: "MacBook Pro M1",
    price: "39.990.000đ",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    quantity: 1,
  },
];

export const ClientCheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const total = cartItems.reduce(
    (sum, item: any) => sum + item?.price * item.quantity,
    0
  );

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
            {cartItems.map((item) => (
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
                      {item.price.toLocaleString()}đ
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Tạm tính</Typography>
              <Typography>{total.toLocaleString()}đ</Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Phí vận chuyển</Typography>
              <Typography>30,000đ</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Tổng cộng</Typography>
              <Typography variant="h6" color="primary">
                {(total + 30000).toLocaleString()}đ
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Checkout Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Thông tin giao hàng
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tỉnh/Thành phố"
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Quận/Huyện"
                      required
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ghi chú"
                      multiline
                      rows={3}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
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
                    <FormControlLabel
                      value="momo"
                      control={<Radio />}
                      label="Ví điện tử Momo"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Xác nhận đơn hàng
                </Typography>
                <Typography paragraph>
                  Vui lòng kiểm tra lại thông tin đơn hàng trước khi xác nhận.
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Thông tin giao hàng
                </Typography>
                <Typography paragraph>
                  Nguyễn Văn A
                  <br />
                  0123 456 789
                  <br />
                  123 Đường ABC, Quận 1, TP.HCM
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Phương thức thanh toán
                </Typography>
                <Typography paragraph>
                  {paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : paymentMethod === "bank"
                    ? "Chuyển khoản ngân hàng"
                    : "Ví điện tử Momo"}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Quay lại
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
              >
                {activeStep === steps.length - 1 ? "Hoàn tất" : "Tiếp tục"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
