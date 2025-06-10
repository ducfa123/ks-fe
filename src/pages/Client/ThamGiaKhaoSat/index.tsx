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
import { setClientToken, updateClientInfo } from "../../../redux/auth-client/auth-client.slice";

interface CauTraLoi {
  ma_cau_hoi: string;
  ma_dap_an?: string;
  ma_dap_an_chon?: string[];
  gia_tri_nhap?: string;
  diem_danh_gia?: number;
}

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
  
  // Redux selectors - MUST be at top level
  const { isAuthenticated, userInfo } = useSelector((state: any) => state.user || {});
  const adminAuth = useSelector((state: any) => state.auth || {});
  const clientAuth = useSelector((state: any) => state.authClient || {});
  
  // State variables
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

  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [surveyLoading, setSurveyLoading] = useState(true);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  // Prevent browser back during survey
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const isSurveyPage = location.pathname.includes('/khao-sat/');
      if (isSurveyPage) {
        e.preventDefault();
        return;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      try {
        checkAuthStatus().then(() => {
          if (!needsRegistration) {
            loadKhaoSatDetail(id);
          }
        });
      } catch (err) {
        console.error('Error in main useEffect:', err);
        setSurveyLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    if (authCheckComplete && !surveyLoading) {
      setAllDataLoaded(true);
    }
  }, [authCheckComplete, surveyLoading]);

  const checkAuthStatus = async () => {
    try {
      // Đơn giản: chỉ kiểm tra clientAuth.isLogin
      if (clientAuth && clientAuth.isLogin && clientAuth.info && clientAuth.token) {
        setNguoiDung(clientAuth.info);
        setNeedsRegistration(false);
      } else {
        // Tất cả trường hợp khác đều cần đăng ký/đăng nhập
        setNeedsRegistration(true);
      }
    } catch (err) {
      console.error('checkAuthStatus error:', err);
      setNeedsRegistration(true);
    } finally {
      setAuthCheckComplete(true);
    }
  };

  useEffect(() => {
    if (khaoSat && !needsRegistration) {
      loadDanhSachPhan(id);
    }
  }, [khaoSat, needsRegistration, id]);

  const loadKhaoSatDetail = async (khaoSatId: string) => {
    try {

      setSurveyLoading(true);
      
      const response = await APIServices.KhaoSatService.getDetailEntity(khaoSatId);
      
      if (response && response.status === "Success" && response.data) {
        if (!response.data.trang_thai) {
          error("Khảo sát này hiện không hoạt động");
          navigate("/");
          return;
        }
        
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
        
        if (response.data.gioi_han_phan_hoi > 0 && 
            response.data.so_phan_hoi_hien_tai >= response.data.gioi_han_phan_hoi) {
          error("Khảo sát này đã đạt giới hạn phản hồi");
          navigate("/");
          return;
        }
        
        setKhaoSat(response.data);
      } else {
        setKhaoSat(null);
      }
    } catch (err) {
      console.error('Error loading khao sat:', err);
      setKhaoSat(null);
    } finally {
      setSurveyLoading(false);
    }
  };

  const loadDanhSachPhan = async (khaoSatId?: string) => {
    try {
      const idToUse = khaoSatId || id;

      
      if (!idToUse) return;
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setNeedsRegistration(true);
        return;
      }
      
      
      const response = await APIServices.PhanKhaoSatService.getListByKhaoSat(idToUse);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        const sortedPhan = response.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        setDanhSachPhan(sortedPhan);
        
        for (const phan of sortedPhan) {
          await loadDanhSachCauHoi(phan._id);
        }
      } else {
      }
    } catch (err) {
      console.error('Error loading danh sach phan:', err);
      error("Không thể tải nội dung khảo sát");
    } finally {
    }
  };

  const loadDanhSachCauHoi = async (maPhan: string) => {
    try {
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token available - redirecting to registration');
        setNeedsRegistration(true);
        return;
      }

      
      if (token && !clientAuth?.token) {
        dispatch(setClientToken(token));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const response = await APIServices.CauHoiService.getListByPhanKhaoSat(maPhan);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        const sortedCauHoi = response.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        
        setDanhSachCauHoi(prev => ({
          ...prev,
          [maPhan]: sortedCauHoi
        }));
        
        const newAnswers = sortedCauHoi.map(cauHoi => ({
          ma_cau_hoi: cauHoi._id
        }));
        
        setCauTraLoi(prev => [...prev, ...newAnswers]);
        
        for (const cauHoi of sortedCauHoi) {
          try {
            
            const currentToken = localStorage.getItem('token');
            if (!currentToken) {
              console.warn(`Token missing during answer loading for question ${cauHoi._id}`);
              setNeedsRegistration(true);
              break;
            }
            
            const dapAnResponse = await APIServices.DapAnService.getListByCauHoi(cauHoi._id);
            
            if (dapAnResponse && dapAnResponse.status === "Success" && Array.isArray(dapAnResponse.data)) {
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
            } else {
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
            
          } catch (err) {
            console.error(`Failed to load answers for question ${cauHoi._id}:`, err);
            
            if (err.response?.status === 403) {
              console.error('403 Forbidden - Authentication failed for answers');
              setNeedsRegistration(true);
              error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
              break;
            }
          }
        }
      } else {
      }
    } catch (err) {
      console.error(`Error loading questions for phan ${maPhan}:`, err);
      
      if (err.response?.status === 403) {
        console.error('403 Forbidden - Authentication failed for questions');
        setNeedsRegistration(true);
        error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        error("Không thể tải nội dung khảo sát");
      }
    } finally {
    }
  };

  const handleNext = () => {
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

      let userId = nguoiDung?._id || nguoiDung?.id || null;
      
      if (!userId && adminAuth?.userInfo) {
        userId = adminAuth.userInfo._id || adminAuth.userInfo.id || null;
      }
      
      if (!userId && clientAuth?.info) {
        userId = clientAuth.info._id || clientAuth.info.id || null;
      }

      if (!userId && !needsRegistration) {
        error("Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại.");
        setShowRegistrationDialog(true);
        return;
      }

      let chiTietPhanHoi: any[] = [];
      
      cauTraLoi.forEach(tl => {
        if (!tl.ma_dap_an && 
            (!tl.ma_dap_an_chon || tl.ma_dap_an_chon.length === 0) && 
            !tl.gia_tri_nhap && 
            tl.diem_danh_gia === undefined) {
          return;
        }
        
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
        ghi_chu: "",
        chi_tiet_phan_hoi: chiTietPhanHoi
      };
      
      const response = await APIServices.PhanHoiService.insertEntity(phanHoi);
      
      if (response && response.status === "Success") {
        success("Gửi phản hồi khảo sát thành công");
        setSubmitted(true);
      } else {
        error("Không thể gửi phản hồi khảo sát");
      }
    } catch (err) {
      console.error('Submit error:', err);
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

  const handleRegistrationSuccess = async () => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      const token = localStorage.getItem('token');
            
      if (userInfo && token) {
        const parsedUserInfo = JSON.parse(userInfo);
        
        const serializableUserInfo = {
          _id: parsedUserInfo._id,
          id: parsedUserInfo.id,
          ten_nguoi_dung: parsedUserInfo.ten_nguoi_dung,
          ho_ten: parsedUserInfo.ho_ten || parsedUserInfo.ten_nguoi_dung,
          email: parsedUserInfo.email,
          tai_khoan: parsedUserInfo.tai_khoan,
          gioi_tinh: parsedUserInfo.gioi_tinh,
          ma_don_vi: parsedUserInfo.ma_don_vi,
          sdt: parsedUserInfo.sdt,
        };
        
        dispatch(setClientToken(token));
        dispatch(updateClientInfo(serializableUserInfo));
        dispatch(setUserInfo(serializableUserInfo));
        
        setNguoiDung(serializableUserInfo);
        setNeedsRegistration(false);
        setShowRegistrationDialog(false);
        
        setTimeout(async () => {
          if (id) {
            await loadKhaoSatDetail(id);
            await loadDanhSachPhan(id);
          }
        }, 500);
      }
    } catch (e) {
      console.error('Registration success handler error:', e);
      error("Đã xảy ra lỗi khi xử lý đăng nhập. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    if (needsRegistration && authCheckComplete) {
      setShowRegistrationDialog(true);
    }
  }, [needsRegistration, authCheckComplete]);


  if (surveyLoading && !needsRegistration) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải thông tin khảo sát...</Typography>
      </Box>
    );
  }

  if (!khaoSat && !surveyLoading && !needsRegistration) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom align="center">
            Không tìm thấy khảo sát
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="body1" gutterBottom align="center">
            Khảo sát này có thể đã bị xóa hoặc không tồn tại.
          </Typography>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="contained" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (needsRegistration && !khaoSat) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom align="center">
            Vui lòng đăng nhập để tham gia khảo sát
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
  }

  if (submitted) {
    return renderThankYou();
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>

      {khaoSat && (
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
      )}

      {needsRegistration && (
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f8f8f8' }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Đăng nhập để tham gia khảo sát
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Bạn cần đăng nhập hoặc đăng ký để có thể gửi phản hồi cho khảo sát này.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setShowRegistrationDialog(true)}
            >
              Đăng nhập / Đăng ký
            </Button>
          </Paper>
        </Box>
      )}
      
      {danhSachPhan.length > 0 && (
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {danhSachPhan.map((phan, index) => (
            <Step key={phan._id}>
              <StepLabel>{`Phần ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      
      {showErrorValidation && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Vui lòng trả lời tất cả các câu hỏi bắt buộc trước khi tiếp tục
        </Alert>
      )}
      
      {danhSachPhan.map((phan, index) => renderPhan(phan, index))}
      
      {danhSachPhan.length > 0 && !needsRegistration && (
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
      )}
      
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
      
      <Dialog 
        open={showRegistrationDialog} 
        onClose={() => {
          if (!needsRegistration) {
            setShowRegistrationDialog(false);
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <RegisterForm 
            onSuccess={handleRegistrationSuccess} 
            maKhaoSat={id} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};