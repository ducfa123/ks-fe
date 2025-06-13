import { Box, Typography, Paper, Grid, Button, Chip, Divider, 
  TextField, FormControlLabel, Checkbox, Radio, RadioGroup,
  Rating, Stepper, Step, StepLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { APIServices } from "../../../utils";
import { Auth } from "../../../utils/apis/auth";
import { useNotifier } from "../../../provider/NotificationProvider";
import { ArrowBack, NavigateNext, NavigateBefore } from "@mui/icons-material";
import { KhaoSatUI, PhanKhaoSat, CauHoi, LoaiCauHoi } from "../../management/khao-sat/types";
import { RegisterForm } from "../../../components/KhaoSat/RegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../../redux/userSlice";

interface CauTraLoi {
  ma_cau_hoi: string;
  ma_dap_an?: string;
  ma_dap_an_chon?: string[];
  gia_tri_nhap?: string;
  diem_danh_gia?: number;
}

// Map LoaiCauHoi enum values to lowercase internal types
const mapLoaiCauHoi = (loaiCauHoi: string): string => {
  switch(loaiCauHoi) {
    case LoaiCauHoi.SINGLE_CHOICE:
      return 'single_choice';
    case LoaiCauHoi.MULTIPLE_CHOICE:
      return 'multiple_choice';
    case LoaiCauHoi.TEXT:
      return 'text';
    case LoaiCauHoi.RATING:
      return 'rating';
    case LoaiCauHoi.LIKERT_SCALE:
      return 'likert_scale';
    default:
      return 'unknown';
  }
};

export const KhaoSatThamGiaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { success, error } = useNotifier();
  const [khaoSat, setKhaoSat] = useState<KhaoSatUI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  const [danhSachPhan, setDanhSachPhan] = useState<PhanKhaoSat[]>([]);
  const [danhSachCauHoi, setDanhSachCauHoi] = useState<{[key: string]: CauHoi[]}>({});
  
  const [activeStep, setActiveStep] = useState(0);
  const [cauTraLoi, setCauTraLoi] = useState<CauTraLoi[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showErrorValidation, setShowErrorValidation] = useState(false);
  const [missingQuestions, setMissingQuestions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [nguoiDung, setNguoiDung] = useState<any>(null);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [surveySubmitted, setSurveySubmitted] = useState(false); // Add separate state for survey submission

  // Check for existing authentication from Redux store
  const { isAuthenticated, userInfo } = useSelector((state: any) => state.user || {});
  const adminAuth = useSelector((state: any) => state.auth || {});
  const clientAuth = useSelector((state: any) => state.authClient || {});

  // Split loading states to avoid redirect issues
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [surveyLoading, setSurveyLoading] = useState(true);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  // Prevent auto-redirects on survey pages
  useEffect(() => {
    // This will override any redirects attempted by other hooks
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const isSurveyPage = location.pathname.includes('/khao-sat/');
      if (isSurveyPage) {
        // This prevents the page from being redirected while loading
        e.preventDefault();
        return;
      }
    };
    
    // Attach the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  // Load only the survey details first, completely separate from auth check
  useEffect(() => {
    if (id) {
      try {
        loadKhaoSatDetail(id);
      } catch (err) {
        console.error("Failed to load survey details:", err);
        // Don't redirect here, just show an error message in the UI
      }
    }
  }, [id]);

  // Check authentication status separately without blocking survey loading
  useEffect(() => {
    try {
      checkAuthStatus();
    } catch (err) {
      console.error("Failed to check auth status:", err);
      // Always default to needing registration if auth check fails
      setNeedsRegistration(true);
      setAuthCheckComplete(true);
    }
  }, []);

  // Track when all data is loaded
  useEffect(() => {
    if (authCheckComplete && !surveyLoading) {
      setAllDataLoaded(true);
    }
  }, [authCheckComplete, surveyLoading]);

  // Check authentication status without redirecting
  const checkAuthStatus = async () => {
    try {
      // PRIORITY: Check localStorage token first - this is the SOURCE OF TRUTH
      const token = localStorage.getItem('token');
      const storedUserInfo = localStorage.getItem('userInfo');
      
      if (!token) {
        // NO TOKEN = NEEDS REGISTRATION (regardless of Redux state)
        console.log("No token found in localStorage, setting needsRegistration to true");
        setNeedsRegistration(true);
        setAuthCheckComplete(true);
        return;
      }
      
      // If we have token, validate user info
      if (storedUserInfo) {
        try {
          const userData = JSON.parse(storedUserInfo);
          if (userData && (userData._id || userData.id) && userData.ten_nguoi_dung) {
            // Valid token and user data
            setNguoiDung(userData);
            dispatch(setUserInfo(userData));
            setNeedsRegistration(false);
            setAuthCheckComplete(true);
            return;
          } else {
            // Invalid user data - clear everything
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            setNeedsRegistration(true);
          }
        } catch (e) {
          console.error("Error parsing stored user info:", e);
          localStorage.removeItem('userInfo');
          localStorage.removeItem('token');
          setNeedsRegistration(true);
        }
      } else {
        // Token exists but no user info - clear token
        localStorage.removeItem('token');
        setNeedsRegistration(true);
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
      setNeedsRegistration(true);
    } finally {
      setAuthCheckComplete(true);
    }
  };

  useEffect(() => {
    if (khaoSat) {
      loadDanhSachPhan();
    }
  }, [khaoSat]);

  const loadKhaoSatDetail = async (khaoSatId: string) => {
    try {
      setSurveyLoading(true);
      
      // Use non-auth API endpoint for public survey details
      const response = await APIServices.KhaoSatService.getDetailEntityNoAuth ? 
        await APIServices.KhaoSatService.getDetailEntityNoAuth(khaoSatId) :
        await APIServices.KhaoSatService.getDetailEntity(khaoSatId);
        
      if (response && response.status === "Success" && response.data) {
        // Kiểm tra khảo sát có đang hoạt động không
        if (!response.data.trang_thai) {
          error("Khảo sát này hiện không hoạt động");
          navigate("/");
          return;
        }
        
        // Kiểm tra thời gian
        const now = new Date();
        const startDate = new Date(response.data.thoi_gian_bat_dau);
        const endDate = new Date(response.data.thoi_gian_ket_thuc);
        
        if (now < startDate) {
          error("Khảo sát này chưa bắt đầu");
          navigate("/");
          return;
        }
        
        if (now > endDate) {
          error("Khảo sát này đã kết thúc");
          navigate("/");
          return;
        }
        
        // Kiểm tra giới hạn phản hồi
        if (response.data.gioi_han_phan_hoi > 0 && 
            response.data.so_phan_hoi_hien_tai >= response.data.gioi_han_phan_hoi) {
          error("Khảo sát này đã đạt giới hạn phản hồi");
          navigate("/");
          return;
        }
        
        setKhaoSat(response.data);
        // Only load sections if we have authentication
        // For unauthenticated users, we'll load sections after they login
      } else {
        console.error("Error loading survey:", response);
        setKhaoSat(null);
      }
    } catch (err) {
      console.error("Error loading survey:", err);
      setKhaoSat(null);
    } finally {
      setSurveyLoading(false);
    }
  };

  const loadDanhSachPhan = async () => {
    try {
      if (!id) return;
      
      // Use non-auth API if available, otherwise use auth API
      const response = await APIServices.PhanKhaoSatService.getListByKhaoSatNoAuth ? 
        await APIServices.PhanKhaoSatService.getListByKhaoSatNoAuth(id) :
        await APIServices.PhanKhaoSatService.getListByKhaoSat(id);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        const sortedPhan = response.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        setDanhSachPhan(sortedPhan);
        
        for (const phan of sortedPhan) {
          await loadDanhSachCauHoi(phan._id);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách phần:", err);
      error("Không thể tải nội dung khảo sát");
    }
  };

  const loadDanhSachCauHoi = async (maPhan: string) => {
    try {
      // Use non-auth API if available
      const response = await APIServices.CauHoiService.getListByPhanKhaoSatNoAuth ? 
        await APIServices.CauHoiService.getListByPhanKhaoSatNoAuth(maPhan) :
        await APIServices.CauHoiService.getListByPhanKhaoSat(maPhan);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        const sortedCauHoi = response.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        // Lưu danh sách câu hỏi vào state
        setDanhSachCauHoi(prev => ({
          ...prev,
          [maPhan]: sortedCauHoi
        }));
        
        // Khởi tạo câu trả lời trống cho mỗi câu hỏi
        const newAnswers = sortedCauHoi.map(cauHoi => ({
          ma_cau_hoi: cauHoi._id
        }));
        
        setCauTraLoi(prev => [...prev, ...newAnswers]);
        
        // Tải đáp án cho từng câu hỏi
        await Promise.all(sortedCauHoi.map(async (cauHoi) => {
          try {
            const dapAnResponse = await APIServices.DapAnService.getListByCauHoiNoAuth ?
              await APIServices.DapAnService.getListByCauHoiNoAuth(cauHoi._id) :
              await APIServices.DapAnService.getListByCauHoi(cauHoi._id);
              
            if (dapAnResponse && dapAnResponse.status === "Success" && Array.isArray(dapAnResponse.data)) {
              // Cập nhật đáp án vào state
              setDanhSachCauHoi(prev => {
                const updatedCauHoi = {...prev};
                const cauHoiList = [...(updatedCauHoi[maPhan] || [])];
                const cauHoiIndex = cauHoiList.findIndex(ch => ch._id === cauHoi._id);
                if (cauHoiIndex !== -1) {
                  cauHoiList[cauHoiIndex] = {
                    ...cauHoiList[cauHoiIndex],
                    dap_an: dapAnResponse.data
                  };
                  updatedCauHoi[maPhan] = cauHoiList;
                }
                return updatedCauHoi;
              });
            }
          } catch (err) {
            console.error(`Lỗi khi tải đáp án cho câu hỏi ${cauHoi._id}:`, err);
          }
        }));
      }
    } catch (err) {
      console.error(`Lỗi khi tải câu hỏi cho phần ${maPhan}:`, err);
    }
  };

  const handleNext = () => {
    // If user is not authenticated, show registration dialog
    if (needsRegistration) {
      setShowRegistrationDialog(true);
      return;
    }

    const isPhanValid = validateCurrentPhan();
    if (!isPhanValid) {
      setShowErrorValidation(true);
      return;
    }
    
    setShowErrorValidation(false);
    
    if (activeStep === danhSachPhan.length - 1) {
      // Đây là phần cuối cùng, hiển thị dialog xác nhận
      setShowConfirmDialog(true);
    } else {
      setActiveStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
    setShowErrorValidation(false);
  };

  const validateCurrentPhan = () => {
    if (!danhSachPhan[activeStep] || !danhSachPhan[activeStep]._id) return true;
    const currentPhanId = danhSachPhan[activeStep]._id;
    const cauHoiTrongPhan = danhSachCauHoi[currentPhanId] || [];
    
    const missingRequired = cauHoiTrongPhan
      .filter(cauHoi => cauHoi.bat_buoc)
      .filter(cauHoi => {
        const traLoi = cauTraLoi.find(tl => tl.ma_cau_hoi === cauHoi._id);
        
        if (!traLoi) return true;
        const loaiCauHoi = mapLoaiCauHoi(String(cauHoi.loai_cau_hoi));
        if (loaiCauHoi === 'single_choice') {
          return !traLoi.ma_dap_an;
        } else if (loaiCauHoi === 'multiple_choice') {
          return !traLoi.ma_dap_an_chon || traLoi.ma_dap_an_chon.length === 0;
        } else if (loaiCauHoi === 'text') {
          return !traLoi.gia_tri_nhap;
        } else if (loaiCauHoi === 'rating') {
          return traLoi.diem_danh_gia === undefined;
        }
        
        return false;
      })
      .map(cauHoi => cauHoi._id);
    
    setMissingQuestions(missingRequired);
    return missingRequired.length === 0;
  };

  const handleSingleChoiceChange = (cauHoiId: string, dapAnId: string) => {
    setCauTraLoi(prev => {
      const newAnswers = [...prev];
      const index = newAnswers.findIndex(tl => tl.ma_cau_hoi === cauHoiId);
      
      if (index !== -1) {
        newAnswers[index] = {
          ...newAnswers[index],
          ma_dap_an: dapAnId
        };
      }
      
      return newAnswers;
    });
  };

  const handleMultipleChoiceChange = (cauHoiId: string, dapAnId: string, checked: boolean) => {
    setCauTraLoi(prev => {
      const newAnswers = [...prev];
      const index = newAnswers.findIndex(tl => tl.ma_cau_hoi === cauHoiId);
      
      if (index !== -1) {
        const currentSelection = newAnswers[index].ma_dap_an_chon || [];
        let newSelection: string[];
        if (checked) {
          newSelection = [...currentSelection, dapAnId];
        } else {
          newSelection = currentSelection.filter(id => id !== dapAnId);
        }
        newAnswers[index] = {
          ...newAnswers[index],
          ma_dap_an_chon: newSelection
        };
      }
      
      return newAnswers;
    });
  };

  const handleTextChange = (cauHoiId: string, value: string) => {
    setCauTraLoi(prev => {
      const newAnswers = [...prev];
      const index = newAnswers.findIndex(tl => tl.ma_cau_hoi === cauHoiId);
      
      if (index !== -1) {
        newAnswers[index] = {
          ...newAnswers[index],
          gia_tri_nhap: value
        };
      }
      
      return newAnswers;
    });
  };

  const handleRatingChange = (cauHoiId: string, value: number | null) => {
    setCauTraLoi(prev => {
      const newAnswers = [...prev];
      const index = newAnswers.findIndex(tl => tl.ma_cau_hoi === cauHoiId);
      
      if (index !== -1) {
        newAnswers[index] = {
          ...newAnswers[index],
          diem_danh_gia: value || 0
        };
      }
      
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (!khaoSat || !id) {
        error("Không tìm thấy thông tin khảo sát");
        return;
      }

      // Get user ID from any available source - with fallbacks for various property names
      let userId = nguoiDung?._id || nguoiDung?.id || null;
      
      if (!userId && adminAuth?.userInfo) {
        userId = adminAuth.userInfo._id || adminAuth.userInfo.id || null;
      }
      
      if (!userId && clientAuth?.userInfo) {
        userId = clientAuth.userInfo._id || clientAuth.userInfo.id || null;
      }

      // If still no userId but we're supposed to be authenticated, show error
      if (!userId && !needsRegistration) {
        error("Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại.");
        setShowRegistrationDialog(true);
        return;
      }

      // Tạo chi tiết phản hồi theo cấu trúc mới
      let chiTietPhanHoi: any[] = [];
      
      cauTraLoi.forEach(tl => {
        // Bỏ qua các câu trả lời không có dữ liệu
        if (!tl.ma_dap_an && 
            (!tl.ma_dap_an_chon || tl.ma_dap_an_chon.length === 0) && 
            !tl.gia_tri_nhap && 
            tl.diem_danh_gia === undefined) {
          return;
        }
        
        // Tìm loại câu hỏi
        let loaiCauHoi = '';
        for (const phanId in danhSachCauHoi) {
          const cauHoiList = danhSachCauHoi[phanId] || [];
          const cauHoi = cauHoiList.find(ch => ch._id === tl.ma_cau_hoi);
          if (cauHoi) {
            loaiCauHoi = mapLoaiCauHoi(String(cauHoi.loai_cau_hoi));
            break;
          }
        }
        
        if (loaiCauHoi === 'text' || loaiCauHoi === 'rating') {
          chiTietPhanHoi.push({
            ma_cau_hoi: tl.ma_cau_hoi,
            tra_loi: loaiCauHoi === 'text' 
              ? tl.gia_tri_nhap || '' 
              : String(tl.diem_danh_gia || 0)
          });
        } else if (loaiCauHoi === 'multiple_choice' && tl.ma_dap_an_chon && tl.ma_dap_an_chon.length > 0) {
          tl.ma_dap_an_chon.forEach(dapAnId => {
            chiTietPhanHoi.push({
              ma_cau_hoi: tl.ma_cau_hoi,
              ma_dap_an: dapAnId
            });
          });
        } else if (tl.ma_dap_an) {
          chiTietPhanHoi.push({
            ma_cau_hoi: tl.ma_cau_hoi,
            ma_dap_an: tl.ma_dap_an
          });
        }
      });
      
      const phanHoi = {
        ma_khao_sat: id,
        ma_nguoi_dung: userId || null,
        ghi_chu: "", // Thêm ghi chú nếu cần
        chi_tiet_phan_hoi: chiTietPhanHoi
      };
      
      const response = await APIServices.PhanHoiService.insertEntity(phanHoi);
      
      if (response && response.status === "Success") {
        success("Gửi phản hồi khảo sát thành công");
        setSurveySubmitted(true); // Use separate state
        setSubmitted(true);
      } else {
        error("Không thể gửi phản hồi khảo sát");
      }
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
      error("Có lỗi xảy ra khi gửi phản hồi");
    } finally {
      setSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  const isMissingQuestion = (cauHoiId: string) => {
    return missingQuestions.includes(cauHoiId);
  };

  const renderCauHoi = (cauHoi: CauHoi) => {
    const loaiCauHoi = mapLoaiCauHoi(String(cauHoi.loai_cau_hoi));
    const traLoi = cauTraLoi.find(tl => tl.ma_cau_hoi === cauHoi._id);
    
    let content;
    
    switch (loaiCauHoi) {
      case 'single_choice':
        content = (
          <RadioGroup
            value={traLoi?.ma_dap_an || ''}
            onChange={(e) => handleSingleChoiceChange(cauHoi._id, e.target.value)}
          >
            {cauHoi.dap_an && Array.isArray(cauHoi.dap_an) && cauHoi.dap_an.map((dapAn, idx) => (
              <FormControlLabel
                key={dapAn._id || idx}
                value={dapAn._id}
                control={<Radio />}
                label={dapAn.gia_tri}
              />
            ))}
          </RadioGroup>
        );
        break;
        
      case 'multiple_choice':
        content = (
          <Box>
            {cauHoi.dap_an && Array.isArray(cauHoi.dap_an) && cauHoi.dap_an.map((dapAn, idx) => (
              <FormControlLabel
                key={dapAn._id || idx}
                control={
                  <Checkbox
                    checked={(traLoi?.ma_dap_an_chon || []).includes(dapAn._id)}
                    onChange={(e) => handleMultipleChoiceChange(cauHoi._id, dapAn._id, e.target.checked)}
                  />
                }
                label={dapAn.gia_tri}
              />
            ))}
          </Box>
        );
        break;
        
      case 'text':
        content = (
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Nhập câu trả lời của bạn"
            value={traLoi?.gia_tri_nhap || ''}
            onChange={(e) => handleTextChange(cauHoi._id, e.target.value)}
          />
        );
        break;
        
      case 'rating':
        content = (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              value={traLoi?.diem_danh_gia || 0}
              onChange={(_, newValue) => handleRatingChange(cauHoi._id, newValue)}
              size="large"
            />
            <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
              {traLoi?.diem_danh_gia ? `${traLoi.diem_danh_gia} sao` : 'Chưa đánh giá'}
            </Typography>
          </Box>
        );
        break;
        
      default:
        content = (
          <Typography color="error">
            Loại câu hỏi không được hỗ trợ: {cauHoi.loai_cau_hoi}
          </Typography>
        );
    }
    
    return (
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: isMissingQuestion(cauHoi._id) ? '1px solid #f44336' : '1px solid #e0e0e0'
        }}
        elevation={1}
      >
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
          {cauHoi.noi_dung}
          {cauHoi.bat_buoc && <Box component="span" sx={{ color: 'error.main', ml: 1 }}>*</Box>}
        </Typography>
        
        {isMissingQuestion(cauHoi._id) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Vui lòng trả lời câu hỏi này
          </Alert>
        )}
        
        {content}
      </Paper>
    );
  };

  const renderPhan = (phan: PhanKhaoSat, index: number) => {
    if (index !== activeStep) return null;
    const cauHoiTrongPhan = danhSachCauHoi[phan._id] || [];
    
    return (
      <Box key={phan._id}>
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#318ded', color: 'white', borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Phần {index + 1}: {phan.tieu_de}
          </Typography>
          {phan.mo_ta && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {phan.mo_ta}
            </Typography>
          )}
        </Paper>
        
        {cauHoiTrongPhan.length > 0 ? (
          cauHoiTrongPhan.map((cauHoi) => (
            <Box key={cauHoi._id}>
              {renderCauHoi(cauHoi)}
            </Box>
          ))
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Không có câu hỏi nào trong phần này</Typography>
          </Paper>
        )}
      </Box>
    );
  };

  const renderThankYou = () => {
    return (
      <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, color: '#318ded' }}>
          Cảm ơn bạn đã hoàn thành khảo sát!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Phản hồi của bạn đã được ghi nhận và rất có giá trị với chúng tôi.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </Button>
      </Paper>
    );
  };

  const handleRegistrationSuccess = () => {
    // After successful registration, load the user info from localStorage
    const userInfo = localStorage.getItem('userInfo');
    const token = localStorage.getItem('token');
    
    console.log("Registration success handler called");
    console.log("UserInfo from localStorage:", userInfo);
    console.log("Token from localStorage:", token);
    
    if (userInfo && token) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        
        // Update local state
        setNguoiDung(parsedUserInfo);
        setNeedsRegistration(false);
        
        // Close the dialog
        setShowRegistrationDialog(false);
        
        // Show success message
        success("Đăng ký thành công! Bạn có thể tiếp tục làm khảo sát.");
        
        // CRITICAL: Force immediate state update and reload survey content
        // This will trigger the render to show survey content instead of registration form
        
        // If survey is already loaded, load sections immediately
        if (khaoSat && id) {
          console.log("Survey already loaded, loading sections now");
          loadDanhSachPhan();
        } else if (id) {
          // If survey not loaded yet, load it first then sections
          console.log("Survey not loaded, loading survey details first");
          loadKhaoSatDetail(id);
        }
        
        // Force a re-render by updating a dummy state or using setTimeout
        setTimeout(() => {
          // This ensures the component re-renders with the new authentication state
          setAuthCheckComplete(true);
        }, 100);
        
      } catch (e) {
        console.error("Lỗi khi parse thông tin người dùng:", e);
        error("Có lỗi xảy ra khi xử lý thông tin đăng ký.");
      }
    } else {
      console.error("No userInfo or token found in localStorage after successful registration");
      error("Đăng ký thành công nhưng không thể lấy thông tin người dùng");
    }
  };

  // Modified to show login form when no token
  useEffect(() => {
    // Don't auto-show registration dialog here anymore
    // We'll handle it in the render logic
  }, [needsRegistration, authCheckComplete]);

  // Load survey sections when authentication state changes
  useEffect(() => {
    if (!needsRegistration && khaoSat && danhSachPhan.length === 0) {
      console.log("User authenticated, loading survey sections");
      loadDanhSachPhan();
    }
  }, [needsRegistration, khaoSat]);

  // Add another useEffect to handle auth state changes more reliably
  useEffect(() => {
    if (!needsRegistration && authCheckComplete && khaoSat) {
      console.log("Auth state changed to authenticated, ensuring survey content is loaded");
      if (danhSachPhan.length === 0) {
        loadDanhSachPhan();
      }
    }
  }, [needsRegistration, authCheckComplete, khaoSat]);

  if (surveyLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải thông tin khảo sát...</Typography>
      </Box>
    );
  }

  // ONLY PRIORITY: ALWAYS show registration form if no valid token (ignore all other states)
  if (needsRegistration && authCheckComplete) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/')}
            variant="text"
            sx={{ mr: 2 }}
          >
            Về trang chủ
          </Button>
        </Box>

        <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom align="center">
            Đăng nhập để tham gia khảo sát
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="body1" gutterBottom align="center">
            Để tham gia khảo sát này, bạn cần đăng nhập hoặc đăng ký tài khoản.
          </Typography>
          
          {/* Show survey info if available, otherwise show generic message */}
          {khaoSat ? (
            <Box sx={{ mt: 3, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                {khaoSat.tieu_de}
              </Typography>
              {khaoSat.mo_ta && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {khaoSat.mo_ta.substring(0, 200)}...
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ mt: 3, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Khảo sát ID: {id}
              </Typography>
            </Box>
          )}
        </Paper>
        
        <RegisterForm 
          onSuccess={handleRegistrationSuccess} 
          maKhaoSat={id} 
        />
      </Box>
    );
  }

  // Show thank you page if survey was submitted
  if (surveySubmitted) {
    return renderThankYou();
  }

  // Show survey content if authenticated and survey exists
  if (!needsRegistration && khaoSat) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate(-1)}
            variant="text"
            sx={{ mr: 2 }}
          >
            Quay lại
          </Button>
        </Box>
        
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
            {khaoSat.tieu_de}
          </Typography>
          
          {khaoSat.mo_ta && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {khaoSat.mo_ta}
              </Typography>
            </>
          )}
        </Paper>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {danhSachPhan.map((phan, index) => (
            <Step key={phan._id}>
              <StepLabel>{`Phần ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {showErrorValidation && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Vui lòng trả lời tất cả các câu hỏi bắt buộc trước khi tiếp tục
          </Alert>
        )}
        
        {danhSachPhan.length > 0 ? (
          <>
            {danhSachPhan.map((phan, index) => renderPhan(phan, index))}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<NavigateBefore />}
                disabled={activeStep === 0}
              >
                Quay lại
              </Button>
              
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={activeStep === danhSachPhan.length - 1 ? undefined : <NavigateNext />}
              >
                {activeStep === danhSachPhan.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
              </Button>
            </Box>
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Đang tải nội dung khảo sát...</Typography>
          </Paper>
        )}
        
        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
          <DialogTitle>Xác nhận gửi phản hồi</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn gửi phản hồi khảo sát này không? Sau khi gửi, bạn sẽ không thể chỉnh sửa phản hồi.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)}>Hủy</Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Gửi phản hồi'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Default: Show registration form (fallback for any other case)
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          variant="text"
          sx={{ mr: 2 }}
        >
          Về trang chủ
        </Button>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom align="center">
          Đăng nhập để tham gia khảo sát
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body1" gutterBottom align="center">
          Để tham gia khảo sát này, bạn cần đăng nhập hoặc đăng ký tài khoản.
        </Typography>
      </Paper>
      
      <RegisterForm 
        onSuccess={handleRegistrationSuccess} 
        maKhaoSat={id} 
      />
    </Box>
  );
};