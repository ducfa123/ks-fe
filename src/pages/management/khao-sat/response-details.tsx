import { Box, Typography, Paper, Chip, Button, Alert, CircularProgress, 
  TextField, FormControlLabel, Checkbox, Radio, RadioGroup, Rating,
  Stepper, Step, StepLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { APIServices } from "../../../utils";
import { useNotifier } from "../../../provider/NotificationProvider";
import { KhaoSatUI, PhanKhaoSat, CauHoi, LoaiCauHoi } from "./types";

interface ResponseDetails {
  _id: string;
  ma_khao_sat: string;
  ma_nguoi_dung: string | null;
  ghi_chu: string;
  thoi_gian_phan_hoi: string;
  chi_tiet_phan_hoi: Array<{
    _id: string;
    ma_phan_hoi: string;
    ma_cau_hoi: string;
    ma_dap_an?: string;
    tra_loi?: string;
    createdAt: string;
    updatedAt: string;
  }>;
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

export const ResponseDetailsPage = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const { error } = useNotifier();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [responseDetails, setResponseDetails] = useState<ResponseDetails | null>(null);
  const [khaoSat, setKhaoSat] = useState<KhaoSatUI | null>(null);
  const [danhSachPhan, setDanhSachPhan] = useState<PhanKhaoSat[]>([]);
  const [danhSachCauHoi, setDanhSachCauHoi] = useState<{[key: string]: CauHoi[]}>({});
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (responseId) {
      loadResponseDetails();
    }
  }, [responseId]);

  const loadResponseDetails = async () => {
    try {
      setLoading(true);
      
      const response = await APIServices.PhanHoiService.getResponseDetails(responseId!);
      
      if (response && response.status === "Success" && response.data) {
        setResponseDetails(response.data);
        await loadSurveyStructure(response.data.ma_khao_sat);
      } else {
        error("Không thể tải chi tiết phản hồi");
        navigate(-1);
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết phản hồi:", err);
      error("Không thể tải chi tiết phản hồi");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const loadSurveyStructure = async (surveyId: string) => {
    try {
      // Load survey info
      const surveyResponse = await APIServices.KhaoSatService.getDetailEntity(surveyId);
      if (surveyResponse && surveyResponse.status === "Success" && surveyResponse.data) {
        setKhaoSat(surveyResponse.data);
      }

      // Load survey sections
      const sectionsResponse = await APIServices.PhanKhaoSatService.getListByKhaoSat(surveyId);
      if (sectionsResponse && sectionsResponse.status === "Success" && Array.isArray(sectionsResponse.data)) {
        const sortedPhan = sectionsResponse.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        setDanhSachPhan(sortedPhan);
        
        // Load questions for each section
        for (const phan of sortedPhan) {
          await loadQuestionsForSection(phan._id);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải cấu trúc khảo sát:", err);
      error("Không thể tải cấu trúc khảo sát");
    }
  };

  const loadQuestionsForSection = async (sectionId: string) => {
    try {
      const response = await APIServices.CauHoiService.getListByPhanKhaoSat(sectionId);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        const sortedCauHoi = response.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        
        setDanhSachCauHoi(prev => ({
          ...prev,
          [sectionId]: sortedCauHoi
        }));
        
        // Load answers for each question
        for (const cauHoi of sortedCauHoi) {
          try {
            const dapAnResponse = await APIServices.DapAnService.getListByCauHoi(cauHoi._id);
            
            if (dapAnResponse && dapAnResponse.status === "Success" && Array.isArray(dapAnResponse.data)) {
              setDanhSachCauHoi(prev => {
                const updatedCauHoi = {...prev};
                const cauHoiList = [...(updatedCauHoi[sectionId] || [])];
                const cauHoiIndex = cauHoiList.findIndex(ch => ch._id === cauHoi._id);
                if (cauHoiIndex !== -1) {
                  cauHoiList[cauHoiIndex] = {
                    ...cauHoiList[cauHoiIndex],
                    dap_an: dapAnResponse.data
                  };
                  updatedCauHoi[sectionId] = cauHoiList;
                }
                return updatedCauHoi;
              });
            }
          } catch (err) {
            console.error(`Failed to load answers for question ${cauHoi._id}:`, err);
          }
        }
      }
    } catch (err) {
      console.error(`Error loading questions for section ${sectionId}:`, err);
    }
  };

  const getResponseForQuestion = (questionId: string) => {
    if (!responseDetails) return null;
    return responseDetails.chi_tiet_phan_hoi.filter(ct => ct.ma_cau_hoi === questionId);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch (e) {
      return dateString;
    }
  };

  const renderQuestion = (cauHoi: CauHoi) => {
    const loaiCauHoi = mapLoaiCauHoi(String(cauHoi.loai_cau_hoi));
    const responses = getResponseForQuestion(cauHoi._id);
    
    let content;
    
    switch (loaiCauHoi) {
      case 'single_choice':
        const selectedAnswer = responses?.[0]?.ma_dap_an;
        content = (
          <RadioGroup value={selectedAnswer || ''}>
            {cauHoi.dap_an && Array.isArray(cauHoi.dap_an) && cauHoi.dap_an.map((dapAn, idx) => (
              <FormControlLabel
                key={dapAn._id || idx}
                value={dapAn._id}
                control={<Radio disabled />}
                label={dapAn.gia_tri}
              />
            ))}
          </RadioGroup>
        );
        break;
        
      case 'multiple_choice':
        const selectedAnswers = responses?.map(r => r.ma_dap_an) || [];
        content = (
          <Box>
            {cauHoi.dap_an && Array.isArray(cauHoi.dap_an) && cauHoi.dap_an.map((dapAn, idx) => (
              <FormControlLabel
                key={dapAn._id || idx}
                control={
                  <Checkbox
                    checked={selectedAnswers.includes(dapAn._id)}
                    disabled
                  />
                }
                label={dapAn.gia_tri}
              />
            ))}
          </Box>
        );
        break;
        
      case 'text':
        const textResponse = responses?.[0]?.tra_loi || '';
        content = (
          <TextField
            fullWidth
            multiline
            rows={4}
            value={textResponse}
            InputProps={{ readOnly: true }}
            variant="outlined"
          />
        );
        break;
        
      case 'rating':
        const ratingValue = responses?.[0]?.tra_loi ? parseInt(responses[0].tra_loi) : 0;
        content = (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
              value={ratingValue}
              readOnly
              size="large"
            />
            <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
              {ratingValue > 0 ? `${ratingValue} sao` : 'Không đánh giá'}
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
        sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}
        elevation={1}
      >
        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
          {cauHoi.noi_dung}
          {cauHoi.bat_buoc && <Box component="span" sx={{ color: 'error.main', ml: 1 }}>*</Box>}
        </Typography>
        
        {content}
      </Paper>
    );
  };

  const renderSection = (phan: PhanKhaoSat, index: number) => {
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
              {renderQuestion(cauHoi)}
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải chi tiết phản hồi...</Typography>
      </Box>
    );
  }

  if (!responseDetails || !khaoSat) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Alert severity="error">
          Không tìm thấy thông tin phản hồi
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 } }}>
    



      {/* Survey Info */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {khaoSat.tieu_de}
        </Typography>
        {khaoSat.mo_ta && (
          <Typography variant="body2" color="text.secondary">
            {khaoSat.mo_ta}
          </Typography>
        )}
      </Paper>

      {/* Stepper */}
      {danhSachPhan.length > 0 && (
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {danhSachPhan.map((phan, index) => (
            <Step key={phan._id}>
              <StepLabel>{`Phần ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {/* Navigation buttons */}
      {danhSachPhan.length > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setActiveStep(prev => prev - 1)}
            disabled={activeStep === 0}
          >
            Phần trước
          </Button>
          <Button
            variant="outlined"
            onClick={() => setActiveStep(prev => prev + 1)}
            disabled={activeStep === danhSachPhan.length - 1}
          >
            Phần tiếp theo
          </Button>
        </Box>
      )}

      {/* Response Content */}
      {danhSachPhan.map((phan, index) => renderSection(phan, index))}
    </Box>
  );
};
