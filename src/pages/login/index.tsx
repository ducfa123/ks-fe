import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaLock, FaUser } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useNotifier } from "../../provider/NotificationProvider";
import {
  loginSuccess,
  setIdToken,
  setToken,
  updatePermisson,
} from "../../redux/auth/auth.slice";
import { RouterLink } from "../../routers/routers";
import { APIServices } from "../../utils";
// import { APIServices } from "../../utils";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  width: "100%",
  padding: theme.spacing(3),
  boxShadow: "0 8px 40px -12px rgba(0,0,0,0.2)",
  transition: "0.3s",
  "&:hover": {
    boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

export const LoginPage = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isLogin } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.username) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const { success } = useNotifier();

  const loadPermission = async () => {
    try {
      const request = await APIServices.Auth.getPermission();
      const { data } = request;
      const { permisisons } = data;

      if (Array.isArray(permisisons)) {
        dispatch(
          updatePermisson(
            permisisons.map((i) => ({
              module: i?.chuc_nang,
              action: i?.quyen,
            }))
          )
        );
      }
    } catch (error) {}
  };

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setLoginError("");
      try {
        const response = await APIServices.Auth.login(
          formData.username,
          formData.password
        );
        

        const responseData = response.data;
        let userData, tokenValue;
           
        if (responseData?.nguoi_dung && responseData?.access_token) {
          userData = responseData.nguoi_dung;
          tokenValue = responseData.access_token;
        } 

        dispatch(
          loginSuccess({
            _id: userData._id,
            ho_ten: userData.ten_nguoi_dung,
            tai_khoan: userData.ten_dang_nhap, 
            vai_tro: userData.ma_vai_tro, 
            phong_ban: userData.phong_ban || null, 
            so_du: userData.so_du || null, 
            email: userData.email, 
            sdt: userData.sdt, 
          })
        );
        dispatch(setToken(tokenValue));
        dispatch(setIdToken(null));
        
        // Tách riêng loadPermission để không ảnh hưởng đến luồng đăng nhập
        try {
          await loadPermission();
        } catch (permError) {
          console.error("Permission loading error:", permError);
        }
    
        success("Đăng nhập thành công");
      } catch (error) {
        console.error("Login error:", error);
        if (error instanceof Error) {
          setLoginError(`Đăng nhập thất bại: ${error.message}`);
        } else {
          setLoginError("Đăng nhập thất bại. Vui lòng thử lại.");
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  if (isLogin) return <Navigate to={RouterLink.ADMIN_HOME} />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
        py: 4,
        width: "100%",
      }}
    >
      <StyledCard>
        <CardContent>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            PHẦN MỀM DỮ LIỆU XÃ HỘI
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="textSecondary"
            sx={{ mb: 4 }}
            fontFamily="Be Vietnam Pro"
          >
            Vui lòng đăng nhập để tiếp tục
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUser />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors?.password)}
                helperText={errors?.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaLock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {loginError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {loginError}
                </Alert>
              )}

              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 2, fontFamily: "Be Vietnam Pro" }}
              >
                {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
              </StyledButton>
            </Stack>
          </form>
        </CardContent>
      </StyledCard>
    </Box>
  );
};
