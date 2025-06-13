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
import { DonViService } from '../../utils/apis/don-vi';
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
  const [loadingDonVi, setLoadingDonVi] = useState(false);
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

  // Check if user is already authenticated in any section
  const { isAuthenticated } = useSelector((state: any) => state.user || {});
  const adminAuth = useSelector((state: any) => state.auth || {});
  const clientAuth = useSelector((state: any) => state.authClient || {});

  // Prevent useEffect from triggering onSuccess for component remounts
  // Add a ref to track if we've already done the initial auth check
  const initialAuthCheckDone = useRef(false);

  // Load danh sách đơn vị when component mounts
  useEffect(() => {
    const fetchDonViList = async () => {
      try {
        setLoadingDonVi(true);
        const response = await DonViService.getListEntityNoAuth(1, 100);
        
        if (response && response.status === "Success") {
          // Handle different response structures
          let donViData = [];
          if (response.data?.danh_sach_don_vi) {
            donViData = response.data.danh_sach_don_vi;
          } else if (Array.isArray(response.data)) {
            donViData = response.data;
          } else if (response.data) {
            donViData = [response.data];
          }
          
          setDonViList(donViData);
          
          // Set default đơn vị if available
          if (donViData.length > 0 && !registerFormData.ma_don_vi) {
            setRegisterFormData(prev => ({
              ...prev,
              ma_don_vi: donViData[0]._id || donViData[0].id
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching don vi list:', error);
        // If API fails, use fallback default
        setRegisterFormData(prev => ({
          ...prev,
          ma_don_vi: '683d5eba869f753261eb0a4f'
        }));
      } finally {
        setLoadingDonVi(false);
      }
    };

    fetchDonViList();
  }, []);

  useEffect(() => {
    console.log("RegisterForm initialized with maKhaoSat:", maKhaoSat);
    
    // Skip the check if we've already done it once to prevent loops
    if (initialAuthCheckDone.current) {
      return;
    }
    
    // PRIORITY: Check localStorage token first - SOURCE OF TRUTH
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (!token) {
      console.log("No token found in localStorage, form will be shown");
      initialAuthCheckDone.current = true;
      // Form will remain visible for user registration
      return;
    }
    
    if (token && userInfo) {
      try {
        console.log("Found token and userInfo in localStorage");
        const userData = JSON.parse(userInfo);
        
        // Validate user data before calling onSuccess
        if (userData && (userData._id || userData.id) && userData.ten_nguoi_dung) {
          dispatch(setUserInfo(userData));
          initialAuthCheckDone.current = true;
          onSuccess();
        } else {
          console.log("Invalid user data found, clearing localStorage");
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          initialAuthCheckDone.current = true;
          // Don't call onSuccess - stay on registration form
        }
      } catch (e) {
        console.error("Error parsing stored user info:", e);
        // Clear invalid data
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        initialAuthCheckDone.current = true;
        // Don't call onSuccess - stay on registration form
      }
    } else {
      console.log("Token exists but no userInfo, clearing token");
      localStorage.removeItem('token');
      initialAuthCheckDone.current = true;
      // Form will remain visible for user registration
    }
  }, [onSuccess, dispatch]);

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
    
    // Enhanced validation
    if (!registerFormData.ten_nguoi_dung || !registerFormData.email || !registerFormData.gioi_tinh) {
      setError('Vui lòng nhập họ tên, email và chọn giới tính');
      return;
    }

    if (!registerFormData.ma_don_vi) {
      setError('Vui lòng chọn đơn vị');
      return;
    }

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
      
      if (response && response.status === "Success") {
        let userData = null;
        let accessToken = null;
        
        // Try different response structures
        if (response.data) {
          userData = response.data.nguoi_dung || response.data.user || response.data;
          accessToken = response.data.access_token || response.data.token;
          
          // If userData is nested in response.data, try to extract it
          if (!userData || !userData.ten_nguoi_dung) {
            // Maybe the user data is directly in response.data
            if (response.data.ten_nguoi_dung) {
              userData = response.data;
            }
          }
        }
        
        console.log("Extracted userData:", userData);
        console.log("Extracted accessToken:", accessToken);
        
        // Validate extracted data
        if (userData && userData.ten_nguoi_dung && (userData._id || userData.id)) {
          localStorage.setItem('userInfo', JSON.stringify(userData));
          
          if (accessToken) {
            localStorage.setItem('token', accessToken);
            dispatch(setToken(accessToken));
            dispatch(setClientToken(accessToken));
          }
          
          dispatch(setUserInfo(userData));
          dispatch(loginSuccess(userData));
          dispatch(loginClientSuccess(userData));
          
          initialAuthCheckDone.current = true;
          
          console.log("Registration successful, calling onSuccess");
          
          // Small delay to ensure all Redux state updates are processed
          setTimeout(() => {
            onSuccess();
          }, 200);
          
        } else {
          console.error("Invalid user data in response:", userData);
          setError('Đăng ký thành công nhưng thông tin người dùng không hợp lệ. Vui lòng thử đăng nhập.');
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
      
      console.log("Login response:", response);
      
      if (response && response.status === "Success") {
        let userData = null;
        let accessToken = null;
        
        if (response.data) {
          userData = response.data.nguoi_dung || response.data.user || response.data;
          accessToken = response.data.access_token || response.data.token;
        }
        
        console.log("Extracted userData:", userData);
        console.log("Extracted accessToken:", accessToken);
        
        // Validate extracted data
        if (userData && userData.ten_nguoi_dung && (userData._id || userData.id)) {
          localStorage.setItem('userInfo', JSON.stringify(userData));
          
          if (accessToken) {
            localStorage.setItem('token', accessToken);
            dispatch(setToken(accessToken));
            dispatch(setClientToken(accessToken));
          }
          
          dispatch(setUserInfo(userData));
          dispatch(loginSuccess(userData));
          dispatch(loginClientSuccess(userData));
          
          console.log("Login successful, calling onSuccess");
          
          // Small delay to ensure all Redux state updates are processed
          setTimeout(() => {
            onSuccess();
          }, 200);
          
        } else {
          console.error("Invalid user data in login response:", userData);
          setError('Đăng nhập thành công nhưng thông tin người dùng không hợp lệ');
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
              <FormControl fullWidth required disabled={loadingDonVi}>
                <InputLabel>Đơn vị</InputLabel>
                <Select
                  value={registerFormData.ma_don_vi}
                  label="Đơn vị"
                  name="ma_don_vi"
                  onChange={handleRegisterChange}
                >
                  {loadingDonVi ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Đang tải...
                    </MenuItem>
                  ) : donViList.length > 0 ? (
                    donViList.map((donVi) => (
                      <MenuItem key={donVi._id || donVi.id} value={donVi._id || donVi.id}>
                        {donVi.ten_don_vi || donVi.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Không có đơn vị nào</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading || loadingDonVi}
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
