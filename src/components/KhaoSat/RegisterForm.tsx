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
  Tab
} from '@mui/material';
import { Auth } from '../../utils/apis/auth';
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
  const [registerFormData, setRegisterFormData] = useState({
    ten_nguoi_dung: '',
    email: '',
    sdt: '',
    ma_don_vi: '683d5eba869f753261eb0a4f' // Default unit ID
  });
  const [loginFormData, setLoginFormData] = useState({
    ten_dang_nhap: '',
    mat_khau: ''
  });

  // Check if user is already authenticated in any section
  const { isAuthenticated } = useSelector((state: any) => state.user || {});
  const adminAuth = useSelector((state: any) => state.auth || {});
  const clientAuth = useSelector((state: any) => state.authClient || {});

  // Prevent useEffect from triggering onSuccess for component remounts
  // Add a ref to track if we've already done the initial auth check
  const initialAuthCheckDone = useRef(false);

  useEffect(() => {
    console.log("RegisterForm initialized with maKhaoSat:", maKhaoSat);
    console.log("Current auth state:", { 
      isAuthenticated, 
      adminAuth: adminAuth?.isLogin ? 'logged in' : 'not logged in',
      clientAuth: clientAuth?.isLogin ? 'logged in' : 'not logged in'
    });
    
    // Skip the check if we've already done it once to prevent loops
    if (initialAuthCheckDone.current) {
      return;
    }
    
    // If user is already authenticated in any section, trigger success callback
    if (isAuthenticated) {
      console.log("User is authenticated in user state, calling onSuccess");
      initialAuthCheckDone.current = true;
      onSuccess();
      return;
    }
    
    if (adminAuth?.isLogin) {
      console.log("User is authenticated in admin state, calling onSuccess");
      initialAuthCheckDone.current = true;
      onSuccess();
      return;
    }
    
    if (clientAuth?.isLogin) {
      console.log("User is authenticated in client state, calling onSuccess");
      initialAuthCheckDone.current = true;
      onSuccess();
      return;
    }
    
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    if (token && userInfo) {
      try {
        console.log("Found token and userInfo in localStorage");
        const userData = JSON.parse(userInfo);
        dispatch(setUserInfo(userData));
        initialAuthCheckDone.current = true;
        onSuccess();
      } catch (e) {
        console.error("Error parsing stored user info:", e);
        initialAuthCheckDone.current = true;
      }
    } else {
      console.log("No token or userInfo found in localStorage, staying on registration form");
      initialAuthCheckDone.current = true;
      // Form will remain visible since we're not calling onSuccess
    }
  }, [isAuthenticated, adminAuth, clientAuth, onSuccess, dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // Basic validation
    if (!registerFormData.ten_nguoi_dung || !registerFormData.email) {
      setError('Vui lòng nhập họ tên và email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerFormData.email)) {
      setError('Email không hợp lệ');
      return;
    }
    
    try {
      setLoading(true);
      console.log("Submitting register data:", registerFormData);
      const response = await Auth.register(registerFormData);
      
      console.log("Register response:", response);
      
      if (response && response.status === "Success" && response.data) {
        // Extract data from the response using the correct structure
        const userData = response.data.nguoi_dung;
        const accessToken = response.data.access_token;
        
        console.log("User data extracted:", userData);
        console.log("Access token extracted:", accessToken);
        
        if (userData && accessToken) {
          // Store user info in localStorage with the right structure
          localStorage.setItem('userInfo', JSON.stringify(userData));
          localStorage.setItem('token', accessToken);
          
          // Update all Redux states
          dispatch(setUserInfo(userData));
          dispatch(loginSuccess(userData));
          dispatch(setToken(accessToken));
          dispatch(loginClientSuccess(userData));
          dispatch(setClientToken(accessToken));
          
          initialAuthCheckDone.current = true;
          
          console.log("Registration successful, calling onSuccess");
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
    
    // Basic validation
    if (!loginFormData.ten_dang_nhap || !loginFormData.mat_khau) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    
    try {
      setLoading(true);
      console.log("Submitting login data to server:", {
        username: loginFormData.ten_dang_nhap,
        password: '********' // Don't log actual password
      });
      
      const response = await Auth.login(loginFormData.ten_dang_nhap, loginFormData.mat_khau);
      
      console.log("Login response:", response);
      
      if (response && response.status === "Success" && response.data) {
        // Get user data from the login response - handle different response formats
        const userData = response.data.nguoi_dung || response.data.user;
        const accessToken = response.data.access_token || response.data.token;
        
        if (userData && accessToken) {
          console.log("User data:", userData);
          console.log("Access token:", accessToken);
          
          // Store user info in localStorage
          localStorage.setItem('userInfo', JSON.stringify(userData));
          localStorage.setItem('token', accessToken);
          
          // Update all Redux states
          dispatch(setUserInfo(userData));
          dispatch(loginSuccess(userData));
          dispatch(setToken(accessToken));
          dispatch(loginClientSuccess(userData));
          dispatch(setClientToken(accessToken));
          
          // Call the success callback - this will trigger a page reload
          console.log("Login successful, calling onSuccess");
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
