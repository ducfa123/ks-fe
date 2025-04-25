import { Box, Button, Container, TextField, Typography, Paper, Grid, Link } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouterLink } from "../../../routers/routers";

const ClientLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // try {
    //   const response = await clientLogin(username, password);
    //   if (response.success) {
    //     await login(response.data.token);
    //     navigate(RouterLink.CLIENT_HOME);
    //   } else {
    //     setError(response.message || "Đăng nhập thất bại");
    //   }
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi đăng nhập");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{ mb: 3, fontWeight: "bold", color: "#d32f2f" }}
              >
                Đăng nhập
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Tên đăng nhập"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: "#d32f2f" }}
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Quên mật khẩu?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      Đăng ký tài khoản
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                color: "white",
              }}
            >
              <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold" }}>
                Chào mừng đến với IntX shop
              </Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>
                Đăng nhập để mua sắm và quản lý đơn hàng của bạn
              </Typography>
              <Typography variant="body1">
                • Mua sắm nhanh chóng và tiện lợi
              </Typography>
              <Typography variant="body1">
                • Theo dõi đơn hàng dễ dàng
              </Typography>
              <Typography variant="body1">
                • Nhận thông báo khuyến mãi
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientLoginPage; 