import { Box, Typography, Paper, Grid, Button, Chip, Divider, 
  Accordion, AccordionSummary, AccordionDetails, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControlLabel, Checkbox, Select, MenuItem,
  FormControl, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APIServices } from "../../../utils";
import { useNotifier } from "../../../provider/NotificationProvider";
import { Add, ExpandMore, Delete, Edit, KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { KhaoSatUI, PhanKhaoSat, CauHoi, DapAn, LoaiCauHoi, LoaiDapAn } from "./types";

export const KhaoSatDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotifier();
  const [khaoSat, setKhaoSat] = useState<KhaoSatUI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [danhSachPhan, setDanhSachPhan] = useState<PhanKhaoSat[]>([]);
  const [currentPhan, setCurrentPhan] = useState<PhanKhaoSat | null>(null);
  
  const [danhSachCauHoi, setDanhSachCauHoi] = useState<{[key: string]: CauHoi[]}>({});
  const [currentCauHoi, setCurrentCauHoi] = useState<CauHoi | null>(null);
  
  const [modalPhanOpen, setModalPhanOpen] = useState(false);
  const [modalCauHoiOpen, setModalCauHoiOpen] = useState(false);
  const [modalDapAnOpen, setModalDapAnOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formPhan, setFormPhan] = useState({
    tieu_de: '',
    mo_ta: ''
  });
  
  const [formCauHoi, setFormCauHoi] = useState({
    noi_dung: '',
    loai_cau_hoi: LoaiCauHoi.SINGLE_CHOICE,
    bat_buoc: false
  });
  
  const [formDapAn, setFormDapAn] = useState({
    gia_tri: '',
    loai_dap_an: LoaiDapAn.TEXT
  });
  
  const [tempDapAn, setTempDapAn] = useState<DapAn[]>([]);
  
  const [activeTab, setActiveTab] = useState('thong-tin');

  useEffect(() => {
    loadKhaoSatDetail();
  }, [id]);
  
  useEffect(() => {
    if (khaoSat) {
      loadDanhSachPhan();
    }
  }, [khaoSat]);

  const loadKhaoSatDetail = async () => {
    try {
      setLoading(true);
      if (!id) {
        error("Không tìm thấy ID khảo sát");
        navigate("/admin/quan-ly-khao-sat");
        return;
      }

      const response = await APIServices.KhaoSatService.getDetailEntity(id);
      if (response && response.status === "Success" && response.data) {
        setKhaoSat(response.data);
      } else {
        error("Không tìm thấy thông tin khảo sát");
        navigate("/admin/quan-ly-khao-sat");
      }
    } catch (err) {
      console.error("Lỗi khi tải thông tin khảo sát:", err);
      error("Không thể tải thông tin khảo sát");
      navigate("/admin/quan-ly-khao-sat");
    } finally {
      setLoading(false);
    }
  };

  const loadDanhSachPhan = async () => {
    try {
      if (!id) return;
      const response = await APIServices.PhanKhaoSatService.getListByKhaoSat(id);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        const sortedPhan = response.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        setDanhSachPhan(sortedPhan);
        
        // Tải phần và câu hỏi
        for (const phan of sortedPhan) {
          await loadDanhSachCauHoi(phan._id);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách phần:", err);
    }
  };
  
  // Sửa lại hàm này để sử dụng Promise.all cho việc tải đáp án
  const loadDanhSachCauHoi = async (maPhan: string) => {
    try {
      const response = await APIServices.CauHoiService.getListByPhanKhaoSat(maPhan);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        const sortedCauHoi = response.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        
        // Đầu tiên, lưu danh sách câu hỏi vào state để hiển thị ngay
        setDanhSachCauHoi(prev => {
          const updated = {
            ...prev,
            [maPhan]: sortedCauHoi
          };
          return updated;
        });
        
        // Sau đó tải đáp án cho từng câu hỏi
        for (const cauHoi of sortedCauHoi) {
          try {
            const dapAnResponse = await APIServices.DapAnService.getListByCauHoi(cauHoi._id);
            
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
          } catch (dapAnErr) {
            console.error(`Lỗi khi tải đáp án cho câu hỏi ${cauHoi._id}:`, dapAnErr);
          }
        }
      }
    } catch (err) {
      console.error(`Lỗi khi tải câu hỏi cho phần ${maPhan}:`, err);
    }
  };
  
  const handleAddPhan = async () => {
    try {
      if (!id) return;
      
      const newPhan = {
        ma_khao_sat: id,
        tieu_de: formPhan.tieu_de,
        mo_ta: formPhan.mo_ta
      };
      
      const response = await APIServices.PhanKhaoSatService.insertEntity(newPhan);
      
      if (response && response.status === "Success") {
        success("Thêm phần khảo sát thành công");
        setModalPhanOpen(false);
        setFormPhan({ tieu_de: '', mo_ta: '' });
        await loadDanhSachPhan();
      }
    } catch (err) {
      console.error("Lỗi khi thêm phần:", err);
      error("Không thể thêm phần khảo sát");
    }
  };
  
  const handleEditPhan = async () => {
    try {
      if (!currentPhan || !currentPhan._id) return;
      
      const updatedPhan = {
        tieu_de: formPhan.tieu_de,
        mo_ta: formPhan.mo_ta
      };
      
      const response = await APIServices.PhanKhaoSatService.updateEntity(currentPhan._id, updatedPhan);
      
      if (response && response.status === "Success") {
        success("Cập nhật phần khảo sát thành công");
        setModalPhanOpen(false);
        setCurrentPhan(null);
        await loadDanhSachPhan();
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật phần:", err);
      error("Không thể cập nhật phần khảo sát");
    }
  };
  
  const handleDeletePhan = async (phanId: string) => {
    try {
      const response = await APIServices.PhanKhaoSatService.removeEntity(phanId);
      
      if (response && response.status === "Success") {
        success("Xóa phần khảo sát thành công");
        await loadDanhSachPhan();
      }
    } catch (err) {
      console.error("Lỗi khi xóa phần:", err);
      error("Không thể xóa phần khảo sát");
    }
  };
  
  const handleAddCauHoi = async () => {
    try {
      if (!currentPhan || !currentPhan._id) return;
      
      const newCauHoi = {
        noi_dung: formCauHoi.noi_dung,
        loai_cau_hoi: formCauHoi.loai_cau_hoi,
        ma_phan_khao_sat: currentPhan._id,
        bat_buoc: formCauHoi.bat_buoc
      };
      
      const response = await APIServices.CauHoiService.insertEntity(newCauHoi);
      
      if (response && response.status === "Success" && response.data) {
        success("Thêm câu hỏi thành công");
        
        // Thêm đáp án nếu có
        if (tempDapAn.length > 0 && response.data._id) {
          for (const dapAn of tempDapAn) {
            await APIServices.DapAnService.insertEntity({
              gia_tri: dapAn.gia_tri,
              loai_dap_an: dapAn.loai_dap_an,
              ma_cau_hoi: response.data._id
            });
          }
        }
        
        setModalCauHoiOpen(false);
        setFormCauHoi({
          noi_dung: '',
          loai_cau_hoi: LoaiCauHoi.SINGLE_CHOICE,
          bat_buoc: false
        });
        setTempDapAn([]);
        // Tải lại danh sách câu hỏi để cập nhật UI
        await loadDanhSachCauHoi(currentPhan._id);
      }
    } catch (err) {
      console.error("Lỗi khi thêm câu hỏi:", err);
      error("Không thể thêm câu hỏi");
    }
  };

  const handleEditCauHoi = async () => {
    try {
      if (!currentCauHoi || !currentCauHoi._id) return;
      
      const updatedCauHoi = {
        noi_dung: formCauHoi.noi_dung,
        loai_cau_hoi: formCauHoi.loai_cau_hoi,
        bat_buoc: formCauHoi.bat_buoc
      };
      
      const response = await APIServices.CauHoiService.updateEntity(currentCauHoi._id, updatedCauHoi);
      
      if (response && response.status === "Success") {
        success("Cập nhật câu hỏi thành công");
        
        // Xử lý đáp án nếu có sự thay đổi
        if (currentCauHoi.dap_an && Array.isArray(currentCauHoi.dap_an)) {
          // Xóa tất cả đáp án cũ
          for (const dapAn of currentCauHoi.dap_an) {
            if (dapAn._id) {
              await APIServices.DapAnService.removeEntity(dapAn._id);
            }
          }
        }
        
        // Thêm các đáp án mới
        if (tempDapAn.length > 0) {
          for (const dapAn of tempDapAn) {
            await APIServices.DapAnService.insertEntity({
              gia_tri: dapAn.gia_tri,
              loai_dap_an: dapAn.loai_dap_an,
              ma_cau_hoi: currentCauHoi._id
            });
          }
        }
        
        setModalCauHoiOpen(false);
        setCurrentCauHoi(null);
        setFormCauHoi({
          noi_dung: '',
          loai_cau_hoi: LoaiCauHoi.SINGLE_CHOICE,
          bat_buoc: false
        });
        setTempDapAn([]);
        setIsEditMode(false);
        
        // Tải lại dữ liệu
        await loadDanhSachCauHoi(currentCauHoi.ma_phan_khao_sat);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật câu hỏi:", err);
      error("Không thể cập nhật câu hỏi");
    }
  };

  const handleDeleteCauHoi = async (cauHoiId: string, maPhan: string) => {
    try {
      const response = await APIServices.CauHoiService.removeEntity(cauHoiId);
      
      if (response && response.status === "Success") {
        success("Xóa câu hỏi thành công");
        await loadDanhSachCauHoi(maPhan);
      }
    } catch (err) {
      console.error("Lỗi khi xóa câu hỏi:", err);
      error("Không thể xóa câu hỏi");
    }
  };
  
  const handleAddTempDapAn = () => {
    if (!formDapAn.gia_tri) return;
    
    setTempDapAn([...tempDapAn, { ...formDapAn }]);
    setFormDapAn({
      gia_tri: '',
      loai_dap_an: LoaiDapAn.TEXT
    });
  };
  
  const handleDeleteTempDapAn = (index: number) => {
    const newDapAn = [...tempDapAn];
    newDapAn.splice(index, 1);
    setTempDapAn(newDapAn);
  };
  
  const handleMovePhan = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === danhSachPhan.length - 1)) {
      return;
    }
    
    const newList = [...danhSachPhan];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
    
    const updatedPhan = newList.map((phan, idx) => ({
      ...phan,
      thu_tu: idx + 1
    }));
    
    setDanhSachPhan(updatedPhan);
    
    try {
      const thuTuData = updatedPhan.map(phan => ({
        id: phan._id,
        thu_tu: phan.thu_tu
      }));
      
      await APIServices.PhanKhaoSatService.updateThuTu({ danhSachPhan: thuTuData });
    } catch (err) {
      console.error("Lỗi khi cập nhật thứ tự phần:", err);
      error("Không thể cập nhật thứ tự phần");
      await loadDanhSachPhan();
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const renderContent = () => {
    if (activeTab === 'thong-tin') {
      return renderThongTinTab();
    } else {
      return renderNoidungTab();
    }
  };

  const renderThongTinTab = () => {
    if (!khaoSat) return null;
    
    return (
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {khaoSat.tieu_de}
          </Typography>
          <Chip 
            label={khaoSat.trang_thai ? "Hoạt động" : "Không hoạt động"} 
            color={khaoSat.trang_thai ? "success" : "error"} 
            size="small"
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium">Mô tả</Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              {khaoSat.mo_ta || "Không có mô tả"}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Người tạo</Typography>
              <Typography variant="body1" fontWeight="medium">
                {khaoSat.ma_nguoi_tao?.ten_nguoi_dung || "Không xác định"}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Giới hạn phản hồi</Typography>
              <Typography variant="body1" fontWeight="medium">
                {khaoSat.gioi_han_phan_hoi > 0 
                  ? `${khaoSat.so_phan_hoi_hien_tai || 0}/${khaoSat.gioi_han_phan_hoi}`
                  : "Không giới hạn"}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Thời gian bắt đầu</Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(khaoSat.thoi_gian_bat_dau)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Thời gian kết thúc</Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatDate(khaoSat.thoi_gian_ket_thuc)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Cho phép trả lời nhiều lần</Typography>
              <Typography variant="body1" fontWeight="medium">
                {khaoSat.cho_phep_tra_loi_nhieu_lan ? "Có" : "Không"}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Cho phép ẩn danh</Typography>
              <Typography variant="body1" fontWeight="medium">
                {khaoSat.cho_phep_an_danh ? "Có" : "Không"}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Ngày tạo</Typography>
              <Typography variant="body1">
                {formatDate(khaoSat.createdAt)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Cập nhật lần cuối</Typography>
              <Typography variant="body1">
                {formatDate(khaoSat.updatedAt)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderNoidungTab = () => {
    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Nội dung khảo sát</Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => {
              setCurrentPhan(null);
              setFormPhan({ tieu_de: '', mo_ta: '' });
              setModalPhanOpen(true);
            }}
          >
            Thêm phần mới
          </Button>
        </Box>

        {danhSachPhan.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Chưa có phần nào trong khảo sát này</Typography>
            <Button 
              variant="outlined" 
              startIcon={<Add />} 
              sx={{ mt: 2 }}
              onClick={() => {
                setCurrentPhan(null);
                setFormPhan({ tieu_de: '', mo_ta: '' });
                setModalPhanOpen(true);
              }}
            >
              Tạo phần đầu tiên
            </Button>
          </Paper>
        ) : (
          <Box>
            {danhSachPhan.map((phan, index) => (
              <Paper 
                key={phan._id} 
                sx={{ mb: 3, overflow: 'hidden', borderRadius: 2 }}
              >
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'primary.light', 
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 2 }}>
                      <IconButton 
                        size="small" 
                        disabled={index === 0}
                        onClick={() => handleMovePhan(index, 'up')}
                      >
                        <KeyboardArrowUp sx={{ color: index === 0 ? 'rgba(255,255,255,0.5)' : 'white' }} />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        disabled={index === danhSachPhan.length - 1}
                        onClick={() => handleMovePhan(index, 'down')}
                      >
                        <KeyboardArrowDown sx={{ color: index === danhSachPhan.length - 1 ? 'rgba(255,255,255,0.5)' : 'white' }} />
                      </IconButton>
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Phần {index + 1}: {phan.tieu_de}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        setCurrentPhan(phan);
                        setFormPhan({
                          tieu_de: phan.tieu_de,
                          mo_ta: phan.mo_ta || ''
                        });
                        setModalPhanOpen(true);
                      }}
                    >
                      <Edit sx={{ color: 'white' }} />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => handleDeletePhan(phan._id)}
                    >
                      <Delete sx={{ color: 'white' }} />
                    </IconButton>
                  </Box>
                </Box>

                {phan.mo_ta && (
                  <Box sx={{ px: 3, py: 2, bgcolor: 'primary.light', opacity: 0.8, color: 'white' }}>
                    <Typography variant="body2">{phan.mo_ta}</Typography>
                  </Box>
                )}

                <Box sx={{ p: 3 }}>
                  <Box>
                    {danhSachCauHoi[phan._id]?.length > 0 ? (
                      danhSachCauHoi[phan._id].map((cauHoi, qIndex) => (
                        <Accordion 
                          key={cauHoi._id}
                          sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '4px !important' }}
                        >
                          <AccordionSummary 
                            expandIcon={<ExpandMore />}
                            sx={{ bgcolor: '#f5f5f5' }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                              <Typography fontWeight="medium">
                                {qIndex + 1}. {cauHoi.noi_dung}
                                {cauHoi.bat_buoc && <Box component="span" sx={{ color: 'error.main', ml: 1 }}>*</Box>}
                              </Typography>
                              <Chip 
                                label={cauHoi.loai_cau_hoi} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ p: 2 }}>
                            <Box sx={{ mb: 2 }}>
                              {String(cauHoi.loai_cau_hoi).toLowerCase() === 'text' ? (
                                <TextField disabled fullWidth placeholder="Văn bản trả lời" size="small" />
                              ) : String(cauHoi.loai_cau_hoi).toLowerCase() === 'rating' ? (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {[1,2,3,4,5].map(star => (
                                    <Box 
                                      key={star}
                                      sx={{ 
                                        width: 30, 
                                        height: 30, 
                                        border: '1px solid #ccc', 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        cursor: 'not-allowed'
                                      }}
                                    >
                                      {star}
                                    </Box>
                                  ))}
                                </Box>
                              ) : (
                                <Box>
                                  {cauHoi.dap_an && Array.isArray(cauHoi.dap_an) && cauHoi.dap_an.length > 0 ? (
                                    cauHoi.dap_an.map((dapAn, optIndex) => (
                                      <Box key={optIndex} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                        <FormControlLabel
                                          control={
                                            String(cauHoi.loai_cau_hoi).toLowerCase() === 'single_choice' ? (
                                              <input type="radio" disabled name={`question_${cauHoi._id}`} />
                                            ) : (
                                              <Checkbox disabled />
                                            )
                                          }
                                          label={dapAn.gia_tri || ''}
                                        />
                                        <Chip 
                                          label={dapAn.loai_dap_an} 
                                          size="small" 
                                          sx={{ ml: 1, fontSize: '0.7rem' }} 
                                        />
                                      </Box>
                                    ))
                                  ) : (
                                    <Box>
                                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                        Chưa có đáp án nào cho câu hỏi này
                                      </Typography>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={async () => {
                                          // Tải lại đáp án khi người dùng nhấp vào
                                          try {
                                            const dapAnResponse = await APIServices.DapAnService.getListByCauHoi(cauHoi._id);
                                            
                                            if (dapAnResponse && dapAnResponse.status === "Success" && 
                                                Array.isArray(dapAnResponse.data) && dapAnResponse.data.length > 0) {
                                              
                                              // Cập nhật đáp án vào state
                                              setDanhSachCauHoi(prev => {
                                                const updatedCauHoi = {...prev};
                                                const cauHoiList = [...(updatedCauHoi[phan._id] || [])];
                                                
                                                const cauHoiIndex = cauHoiList.findIndex(ch => ch._id === cauHoi._id);
                                                if (cauHoiIndex !== -1) {
                                                  cauHoiList[cauHoiIndex] = {
                                                    ...cauHoiList[cauHoiIndex],
                                                    dap_an: dapAnResponse.data
                                                  };
                                                  
                                                  updatedCauHoi[phan._id] = cauHoiList;
                                                }
                                                
                                                return updatedCauHoi;
                                              });
                                              
                                              success("Đã tải đáp án thành công");
                                            } else {
                                              error("Không tìm thấy đáp án cho câu hỏi này");
                                            }
                                          } catch (err) {
                                            console.error("Lỗi khi tải đáp án:", err);
                                            error("Không thể tải đáp án");
                                          }
                                        }}
                                      >
                                        Tải lại đáp án
                                      </Button>
                                    </Box>
                                  )}
                                </Box>
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                              <Button 
                                variant="outlined" 
                                color="error" 
                                startIcon={<Delete />}
                                onClick={() => handleDeleteCauHoi(cauHoi._id, phan._id)}
                                sx={{ mr: 1 }}
                              >
                                Xóa
                              </Button>
                              <Button 
                                variant="outlined" 
                                color="primary" 
                                startIcon={<Edit />}
                                onClick={async () => {
                                  try {
                                    // Lấy thông tin chi tiết và đáp án mới nhất
                                    const cauHoiResponse = await APIServices.CauHoiService.getDetailEntity(cauHoi._id);
                                    const dapAnResponse = await APIServices.DapAnService.getListByCauHoi(cauHoi._id);
                                    
                                    let cauHoiData = cauHoi;
                                    if (cauHoiResponse && cauHoiResponse.status === "Success") {
                                      cauHoiData = cauHoiResponse.data;
                                    }
                                    
                                    let dapAnData = [];
                                    if (dapAnResponse && dapAnResponse.status === "Success") {
                                      dapAnData = dapAnResponse.data;
                                      
                                      // Cập nhật đáp án trong state để hiển thị sau khi chỉnh sửa
                                      setDanhSachCauHoi(prev => {
                                        const updatedCauHoi = {...prev};
                                        const cauHoiList = [...(updatedCauHoi[phan._id] || [])];
                                        
                                        const cauHoiIndex = cauHoiList.findIndex(ch => ch._id === cauHoi._id);
                                        if (cauHoiIndex !== -1) {
                                          cauHoiList[cauHoiIndex] = {
                                            ...cauHoiList[cauHoiIndex],
                                            dap_an: dapAnResponse.data
                                          };
                                          
                                          updatedCauHoi[phan._id] = cauHoiList;
                                        }
                                        
                                        return updatedCauHoi;
                                      });
                                    }
                                    
                                    // Cập nhật state để hiển thị modal chỉnh sửa
                                    setCurrentCauHoi({...cauHoiData, dap_an: dapAnData});
                                    setFormCauHoi({
                                      noi_dung: cauHoiData.noi_dung,
                                      loai_cau_hoi: cauHoiData.loai_cau_hoi,
                                      bat_buoc: cauHoiData.bat_buoc || false
                                    });
                                    setTempDapAn(dapAnData);
                                    setIsEditMode(true);
                                    setModalCauHoiOpen(true);
                                  } catch (err) {
                                    console.error("Lỗi khi tải thông tin câu hỏi:", err);
                                    error("Không thể tải thông tin câu hỏi");
                                  }
                                }}
                              >
                                Sửa
                              </Button>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                        Chưa có câu hỏi nào trong phần này
                      </Typography>
                    )}
                  </Box>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => {
                      setCurrentPhan(phan);
                      setFormCauHoi({
                        noi_dung: '',
                        loai_cau_hoi: LoaiCauHoi.SINGLE_CHOICE,
                        bat_buoc: false
                      });
                      setTempDapAn([]);
                      setIsEditMode(false);
                      setModalCauHoiOpen(true);
                    }}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Thêm câu hỏi
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const renderTempDapAn = () => {
    if (tempDapAn.length === 0) {
      return (
        <Box sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">Chưa có đáp án nào</Typography>
        </Box>
      );
    }

    return tempDapAn.map((dapAn, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2">
            {index + 1}. {dapAn.gia_tri}
          </Typography>
          <Chip 
            label={dapAn.loai_dap_an} 
            size="small" 
            sx={{ mt: 0.5, fontSize: '0.7rem' }} 
          />
        </Box>
        <IconButton 
          size="small"
          onClick={() => handleDeleteTempDapAn(index)}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>
    ));
  };

  const isQuestionTypeNeedAnswers = (type: string) => {
    return type === LoaiCauHoi.SINGLE_CHOICE || 
           type === LoaiCauHoi.MULTIPLE_CHOICE || 
           type === LoaiCauHoi.LIKERT_SCALE;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1">
          Chi tiết khảo sát
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Đang tải thông tin khảo sát...</Typography>
        </Box>
      ) : khaoSat ? (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Button
              variant={activeTab === 'thong-tin' ? "contained" : "outlined"}
              onClick={() => setActiveTab('thong-tin')}
              sx={{ mr: 2 }}
            >
              Thông tin chung
            </Button>
            <Button
              variant={activeTab === 'noi-dung' ? "contained" : "outlined"}
              onClick={() => setActiveTab('noi-dung')}
            >
              Nội dung khảo sát
            </Button>
          </Box>
          
          {renderContent()}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Không tìm thấy thông tin khảo sát</Typography>
        </Box>
      )}

      <Dialog open={modalPhanOpen} onClose={() => setModalPhanOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{currentPhan ? "Sửa phần khảo sát" : "Thêm phần khảo sát"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tiêu đề phần"
            fullWidth
            value={formPhan.tieu_de}
            onChange={(e) => setFormPhan({...formPhan, tieu_de: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Mô tả (không bắt buộc)"
            fullWidth
            multiline
            rows={3}
            value={formPhan.mo_ta}
            onChange={(e) => setFormPhan({...formPhan, mo_ta: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalPhanOpen(false)}>Hủy</Button>
          <Button 
            onClick={() => currentPhan ? handleEditPhan() : handleAddPhan()}
            variant="contained"
            disabled={!formPhan.tieu_de}
          >
            {currentPhan ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={modalCauHoiOpen} onClose={() => setModalCauHoiOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{isEditMode ? "Sửa câu hỏi" : "Thêm câu hỏi"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nội dung câu hỏi"
            fullWidth
            value={formCauHoi.noi_dung}
            onChange={(e) => setFormCauHoi({...formCauHoi, noi_dung: e.target.value})}
          />
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Loại câu hỏi</InputLabel>
            <Select
              value={formCauHoi.loai_cau_hoi}
              label="Loại câu hỏi"
              onChange={(e) => setFormCauHoi({
                ...formCauHoi,
                loai_cau_hoi: e.target.value as any
              })}
            >
              {Object.values(LoaiCauHoi).map(loai => (
                <MenuItem key={loai} value={loai}>{loai}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={formCauHoi.bat_buoc}
                onChange={(e) => setFormCauHoi({...formCauHoi, bat_buoc: e.target.checked})}
              />
            }
            label="Câu hỏi bắt buộc"
            sx={{ mt: 1 }}
          />
          
          {isQuestionTypeNeedAnswers(formCauHoi.loai_cau_hoi) && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Các đáp án</Typography>
              <Divider sx={{ mb: 2, mt: 0.5 }} />
              
              <Box sx={{ mb: 2 }}>
                {renderTempDapAn()}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <TextField
                  label="Nội dung đáp án"
                  value={formDapAn.gia_tri}
                  onChange={(e) => setFormDapAn({...formDapAn, gia_tri: e.target.value})}
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <FormControl sx={{ width: 150, mr: 1 }}>
                  <InputLabel>Loại đáp án</InputLabel>
                  <Select
                    value={formDapAn.loai_dap_an}
                    label="Loại đáp án"
                    size="medium"
                    onChange={(e) => setFormDapAn({...formDapAn, loai_dap_an: e.target.value as any})}
                  >
                    {Object.values(LoaiDapAn).map(loai => (
                      <MenuItem key={loai} value={loai}>{loai}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  onClick={handleAddTempDapAn}
                  disabled={!formDapAn.gia_tri}
                >
                  Thêm
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setModalCauHoiOpen(false);
            setIsEditMode(false);
            setCurrentCauHoi(null);
          }}>
            Hủy
          </Button>
          <Button 
            onClick={isEditMode ? handleEditCauHoi : handleAddCauHoi}
            variant="contained"
            disabled={!formCauHoi.noi_dung || (isQuestionTypeNeedAnswers(formCauHoi.loai_cau_hoi) && tempDapAn.length === 0)}
          >
            {isEditMode ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};