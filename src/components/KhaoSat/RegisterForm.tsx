import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert,
  Grid,
  Divider,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Auth } from '../../utils/apis/auth';
import {  DonViService } from '../../utils/apis/don-vi';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../../redux/userSlice';
import { loginSuccess, setToken } from '../../redux/auth/auth.slice';
import { loginClientSuccess, setClientToken } from '../../redux/auth-client/auth-client.slice';

interface RegisterFormProps {
  onSuccess: () => void;
  maKhaoSat?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const RegisterForm = ({ onSuccess, maKhaoSat }: RegisterFormProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [donViList, setDonViList] = useState<any[]>([]);
  const [registerFormData, setRegisterFormData] = useState({
    ten_nguoi_dung: '',
    email: '',
    sdt: '',
    ma_don_vi: '',
    gioi_tinh: ''
  });
  const [loginFormData, setLoginFormData] = useState({
    ten_dang_nhap: '',
    mat_khau: ''
  });

  const { isAuthenticated } = useSelector((state: any) => state.user || {});
  const adminAuth = useSelector((state: any) => state.auth || {});
  const clientAuth = useSelector((state: any) => state.authClient || {});
  const initialAuthCheckDone = useRef(false);

  useEffect(() => {

    if (initialAuthCheckDone.current) {
      return;
    }
    
    if (isAuthenticated) {
      initialAuthCheckDone.current = true;
      onSuccess();
      return;
    }
    
    if (adminAuth?.isLogin) {
      initialAuthCheckDone.current = true;
      onSuccess();
      return;
    }
    
    if (clientAuth?.isLogin) {
      initialAuthCheckDone.current = true;
      onSuccess();
      return;
    }
    
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    if (token && userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        dispatch(setUserInfo(userData));
        initialAuthCheckDone.current = true;
        onSuccess();
      } catch (e) {
        console.error("Error parsing stored user info:", e);
        initialAuthCheckDone.current = true;
      }
    } else {
      initialAuthCheckDone.current = true;
    }
  }, [isAuthenticated, adminAuth, clientAuth, onSuccess, dispatch]);

  useEffect(() => {
    const fetchDonViList = async () => {
      try {
        const response = await DonViService.getListEntityNoAuth(1, 100); 
        if (response && response.status === "Success" && response.data?.danh_sach_don_vi) {
          setDonViList(response.data.danh_sach_don_vi);
          if (response.data.danh_sach_don_vi.length > 0) {
            setRegisterFormData(prev => ({
              ...prev,
              ma_don_vi: response.data.danh_sach_don_vi[0]._id
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching don vi list:', error);
      }
    };

    fetchDonViList();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target;
    setRegisterFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!registerFormData.ten_nguoi_dung || !registerFormData.email || !registerFormData.gioi_tinh) {
      setError('Vui lòng nhập họ tên, email và chọn giới tính');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerFormData.email)) {
      setError('Email không hợp lệ');
      return;
    }
    
    try {
      setLoading(true);
      const response = await Auth.register(registerFormData);
      
      
      if (response && response.status === "Success" && response.data) {
        const userData = response.data.nguoi_dung;
        const accessToken = response.data.access_token;
        

        if (userData && accessToken) {
          localStorage.setItem('userInfo', JSON.stringify(userData));
          localStorage.setItem('token', accessToken);
          
          dispatch(setUserInfo(userData));
          dispatch(loginSuccess(userData));
          dispatch(setToken(accessToken));
          dispatch(loginClientSuccess(userData));
          dispatch(setClientToken(accessToken));
          
          initialAuthCheckDone.current = true;
          
          onSuccess();
        } else {
          console.error("Missing user data or token in response:", response.data);
          setError('Đăng ký thành công nhưng không thể lấy thông tin người dùng');
        }
      } else {
        console.error("Registration response error:", response);
        setError(response?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err?.response?.data?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!loginFormData.ten_dang_nhap || !loginFormData.mat_khau) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    
    try {
      setLoading(true);

      
      const response = await Auth.login(loginFormData.ten_dang_nhap, loginFormData.mat_khau);
      
      
      if (response && response.status === "Success" && response.data) {
        const userData = response.data.nguoi_dung || response.data.user;
        const accessToken = response.data.access_token || response.data.token;
        
        if (userData && accessToken) {

          
          localStorage.setItem('userInfo', JSON.stringify(userData));
          localStorage.setItem('token', accessToken);
          
          dispatch(setUserInfo(userData));
          dispatch(loginSuccess(userData));
          dispatch(setToken(accessToken));
          dispatch(loginClientSuccess(userData));
          dispatch(setClientToken(accessToken));
          
          onSuccess();
        } else {
          console.error("Missing user data or token in login response:", response.data);
          setError('Đăng nhập thành công nhưng không thể lấy thông tin người dùng');
        }
      } else {
        console.error("Login response error:", response);
        setError(response?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.response?.data?.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Xác thực người dùng
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
        <Tab label="Đăng ký" />
        <Tab label="Đăng nhập" />
      </Tabs>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <TabPanel value={tabValue} index={0}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Vui lòng điền thông tin để tham gia khảo sát này. 
          Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích khảo sát.
        </Typography>
        
        <Box component="form" onSubmit={handleRegisterSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Họ và tên"
                name="ten_nguoi_dung"
                value={registerFormData.ten_nguoi_dung}
                onChange={handleRegisterChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={registerFormData.email}
                onChange={handleRegisterChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="sdt"
                value={registerFormData.sdt}
                onChange={handleRegisterChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={registerFormData.gioi_tinh}
                  label="Giới tính"
                  name="gioi_tinh"
                  onChange={handleRegisterChange}
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Đơn vị</InputLabel>
                <Select
                  value={registerFormData.ma_don_vi}
                  label="Đơn vị"
                  name="ma_don_vi"
                  onChange={handleRegisterChange}
                >
                  {donViList.map((donVi) => (
                    <MenuItem key={donVi._id} value={donVi._id}>
                      {donVi.ten_don_vi}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Đăng ký và tiếp tục'}
          </Button>
        </Box>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Đăng nhập để tham gia khảo sát nếu bạn đã có tài khoản.
        </Typography>
        
        <Box component="form" onSubmit={handleLoginSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Tên đăng nhập"
                name="ten_dang_nhap"
                value={loginFormData.ten_dang_nhap}
                onChange={handleLoginChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Mật khẩu"
                name="mat_khau"
                type="password"
                value={loginFormData.mat_khau}
                onChange={handleLoginChange}
                variant="outlined"
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Đăng nhập và tiếp tục'}
          </Button>
        </Box>
      </TabPanel>
    </Paper>
  );
};
