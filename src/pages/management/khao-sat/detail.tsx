import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APIServices } from "../../../utils";
import { useNotifier } from "../../../provider/NotificationProvider";
import { Settings } from "@mui/icons-material";
import { KhaoSatUI, PhanKhaoSat, CauHoi, DapAn, LoaiCauHoi, LoaiDapAn } from "./types";
import {
  SurveyInfoTab,
  SurveyContentTab,
  StatisticsModal,
  LimitConfigModal,
  DeleteConfirmModal,
  SectionModal,
  QuestionModal
} from "./components";
import { ThongKeService } from "../../../utils/apis/thong-ke";

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

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'phan' | 'cauHoi' | 'gioiHanVungMien' | 'gioiHanDonVi';
    id: string;
    name: string;
    extraData?: any;
  } | null>(null);

  // Limit configuration modal state
  const [modalGioiHanOpen, setModalGioiHanOpen] = useState(false);
  const [activeGioiHanTab, setActiveGioiHanTab] = useState(0);
  
  // Statistics modal state
  const [statisticsModalOpen, setStatisticsModalOpen] = useState(false);
  const [statisticsActiveTab, setStatisticsActiveTab] = useState(0);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [thongKeTongQuan, setThongKeTongQuan] = useState<any>(null);
  const [thongKeTheoDonVi, setThongKeTheoDonVi] = useState<any[]>([]);
  const [thongKeTheoVungMien, setThongKeTheoVungMien] = useState<any[]>([]);
  const [thongKeTheoCauHoi, setThongKeTheoCauHoi] = useState<any[]>([]);
  const [thongKeThoiGian, setThongKeThoiGian] = useState<any[]>([]);
  const [thongKeTheoGioiTinh, setThongKeTheoGioiTinh] = useState<any>(null);

  // Region limitations
  const [danhSachGioiHanVungMien, setDanhSachGioiHanVungMien] = useState<any[]>([]);
  const [danhSachVungMien, setDanhSachVungMien] = useState<any[]>([]);
  const [formGioiHanVungMien, setFormGioiHanVungMien] = useState({
    ma_vung_mien: '',
    so_luong_phan_hoi_toi_da: 0
  });
  const [vungMienHierarchy, setVungMienHierarchy] = useState<any[]>([]);
  const [selectedVungMien, setSelectedVungMien] = useState<any>(null);
  const [showVungMienSelector, setShowVungMienSelector] = useState(false);

  // Unit limitations
  const [danhSachGioiHanDonVi, setDanhSachGioiHanDonVi] = useState<any[]>([]);
  const [danhSachDonVi, setDanhSachDonVi] = useState<any[]>([]);
  const [formGioiHanDonVi, setFormGioiHanDonVi] = useState({
    ma_don_vi: '',
    so_luong_phan_hoi_toi_da: 0
  });
  const [donViHierarchy, setDonViHierarchy] = useState<any[]>([]);
  const [selectedDonVi, setSelectedDonVi] = useState<any>(null);
  const [showDonViSelector, setShowDonViSelector] = useState(false);

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
  
  const handleViewResponses = () => {
    if (id) {
      navigate(`/admin/khao-sat/${id}/phan-hoi`);
    }
  };

  const loadDanhSachPhan = async () => {
    try {
      if (!id) return;
      const response = await APIServices.PhanKhaoSatService.getListByKhaoSat(id);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        const sortedPhan = response.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        setDanhSachPhan(sortedPhan);
        
        for (const phan of sortedPhan) {
          await loadDanhSachCauHoi(phan._id);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách phần:", err);
    }
  };
  
  const loadDanhSachCauHoi = async (maPhan: string) => {
    try {
      const response = await APIServices.CauHoiService.getListByPhanKhaoSat(maPhan);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        const sortedCauHoi = response.data.sort((a, b) => (a.thu_tu || 0) - (b.thu_tu || 0));
        
        setDanhSachCauHoi(prev => ({
          ...prev,
          [maPhan]: sortedCauHoi
        }));
        
        for (const cauHoi of sortedCauHoi) {
          try {
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
        
        if (currentCauHoi.dap_an && Array.isArray(currentCauHoi.dap_an)) {
          for (const dapAn of currentCauHoi.dap_an) {
            if (dapAn._id) {
              await APIServices.DapAnService.removeEntity(dapAn._id);
            }
          }
        }
        
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
        
        await loadDanhSachCauHoi(typeof currentCauHoi.ma_phan_khao_sat === 'string' ? currentCauHoi.ma_phan_khao_sat : (currentCauHoi.ma_phan_khao_sat as any)?._id);
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

  // Add limit configuration functions
  const buildVungMienHierarchy = (vungMienList: any[]) => {
    const hierarchy: any[] = [];
    const vungMienMap = new Map();
    
    vungMienList.forEach(vm => {
      vungMienMap.set(vm._id, { ...vm, children: [] });
    });
    
    vungMienList.forEach(vm => {
      const vungMien = vungMienMap.get(vm._id);
      if (vm.ma_vung_mien_cha && vm.ma_vung_mien_cha._id) {
        const parent = vungMienMap.get(vm.ma_vung_mien_cha._id);
        if (parent) {
          parent.children.push(vungMien);
        }
      } else {
        hierarchy.push(vungMien);
      }
    });
    
    return hierarchy;
  };

  const buildDonViHierarchy = (donViList: any[]) => {
    const hierarchy: any[] = [];
    const donViMap = new Map();
    
    donViList.forEach(dv => {
      donViMap.set(dv._id, { ...dv, children: [] });
    });
    
    donViList.forEach(dv => {
      const donVi = donViMap.get(dv._id);
      if (dv.ma_don_vi_cha && dv.ma_don_vi_cha._id) {
        const parent = donViMap.get(dv.ma_don_vi_cha._id);
        if (parent) {
          parent.children.push(donVi);
        }
      } else {
        hierarchy.push(donVi);
      }
    });
    
    return hierarchy;
  };

  const loadDanhSachVungMien = async () => {
    try {
      const response = await APIServices.VungMienService?.getListEntity(1, 100, "");
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        setDanhSachVungMien(response.data);
        const hierarchy = buildVungMienHierarchy(response.data);
        setVungMienHierarchy(hierarchy);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách vùng miền:", err);
    }
  };

  const loadDanhSachDonVi = async () => {
    try {
      const response = await APIServices.DonViService?.getListEntity(1, 100, "");
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        setDanhSachDonVi(response.data);
        const hierarchy = buildDonViHierarchy(response.data);
        setDonViHierarchy(hierarchy);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách đơn vị:", err);
    }
  };

  const loadDanhSachGioiHanVungMien = async () => {
    try {
      if (!id) return;
      const response = await APIServices.GioiHanVungMienService.getListBySurvey(id);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        setDanhSachGioiHanVungMien(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách giới hạn vùng miền:", err);
    }
  };

  const loadDanhSachGioiHanDonVi = async () => {
    try {
      if (!id) return;
      const response = await APIServices.GioiHanDonViService.getListBySurvey(id);
      
      if (response && response.status === "Success" && Array.isArray(response.data)) {
        setDanhSachGioiHanDonVi(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách giới hạn đơn vị:", err);
    }
  };

  const handleAddGioiHanVungMien = async () => {
    try {
      if (!id || !formGioiHanVungMien.ma_vung_mien || formGioiHanVungMien.so_luong_phan_hoi_toi_da <= 0) {
        error("Vui lòng điền đầy đủ thông tin");
        return;
      }
      
      const existingLimit = danhSachGioiHanVungMien.find(gh => gh.ma_vung_mien._id === formGioiHanVungMien.ma_vung_mien);
      if (existingLimit) {
        error("Vùng miền này đã được thiết lập giới hạn");
        return;
      }
      
      const newGioiHan = {
        ma_khao_sat: id,
        ma_vung_mien: formGioiHanVungMien.ma_vung_mien,
        so_luong_phan_hoi_toi_da: formGioiHanVungMien.so_luong_phan_hoi_toi_da
      };
      
      const response = await APIServices.GioiHanVungMienService.insertEntity(newGioiHan);
      
      if (response && response.status === "Success") {
        success("Thêm giới hạn vùng miền thành công");
        setFormGioiHanVungMien({ ma_vung_mien: '', so_luong_phan_hoi_toi_da: 0 });
        setSelectedVungMien(null);
        setShowVungMienSelector(false);
        await loadDanhSachGioiHanVungMien();
      }
    } catch (err) {
      console.error("Lỗi khi thêm giới hạn vùng miền:", err);
      error("Không thể thêm giới hạn vùng miền");
    }
  };

  const handleAddGioiHanDonVi = async () => {
    try {
      if (!id || !formGioiHanDonVi.ma_don_vi || formGioiHanDonVi.so_luong_phan_hoi_toi_da <= 0) {
        error("Vui lòng điền đầy đủ thông tin");
        return;
      }
      
      const existingLimit = danhSachGioiHanDonVi.find(gh => gh.ma_don_vi._id === formGioiHanDonVi.ma_don_vi);
      if (existingLimit) {
        error("Đơn vị này đã được thiết lập giới hạn");
        return;
      }
      
      const newGioiHan = {
        ma_khao_sat: id,
        ma_don_vi: formGioiHanDonVi.ma_don_vi,
        so_luong_phan_hoi_toi_da: formGioiHanDonVi.so_luong_phan_hoi_toi_da
      };
      
      const response = await APIServices.GioiHanDonViService.insertEntity(newGioiHan);
      
      if (response && response.status === "Success") {
        success("Thêm giới hạn đơn vị thành công");
        setFormGioiHanDonVi({ ma_don_vi: '', so_luong_phan_hoi_toi_da: 0 });
        setSelectedDonVi(null);
        setShowDonViSelector(false);
        await loadDanhSachGioiHanDonVi();
      }
    } catch (err) {
      console.error("Lỗi khi thêm giới hạn đơn vị:", err);
      error("Không thể thêm giới hạn đơn vị");
    }
  };

  const handleDeleteGioiHanVungMien = async (gioiHanId: string) => {
    try {
      const response = await APIServices.GioiHanVungMienService.removeEntity(gioiHanId);
      
      if (response && response.status === "Success") {
        success("Xóa giới hạn vùng miền thành công");
        await loadDanhSachGioiHanVungMien();
      }
    } catch (err) {
      console.error("Lỗi khi xóa giới hạn vùng miền:", err);
      error("Không thể xóa giới hạn vùng miền");
    }
  };

  const handleDeleteGioiHanDonVi = async (gioiHanId: string) => {
    try {
      const response = await APIServices.GioiHanDonViService.removeEntity(gioiHanId);
      
      if (response && response.status === "Success") {
        success("Xóa giới hạn đơn vị thành công");
        await loadDanhSachGioiHanDonVi();
      }
    } catch (err) {
      console.error("Lỗi khi xóa giới hạn đơn vị:", err);
      error("Không thể xóa giới hạn đơn vị");
    }
  };

  const openDeleteModal = (type: 'phan' | 'cauHoi' | 'gioiHanVungMien' | 'gioiHanDonVi', id: string, name: string, extraData?: any) => {
    setDeleteTarget({ type, id, name, extraData });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      switch (deleteTarget.type) {
        case 'phan':
          await handleDeletePhan(deleteTarget.id);
          break;
        case 'cauHoi':
          await handleDeleteCauHoi(deleteTarget.id, deleteTarget.extraData);
          break;
        case 'gioiHanVungMien':
          await handleDeleteGioiHanVungMien(deleteTarget.id);
          break;
        case 'gioiHanDonVi':
          await handleDeleteGioiHanDonVi(deleteTarget.id);
          break;
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleOpenGioiHanModal = async () => {
    setModalGioiHanOpen(true);
    await loadDanhSachVungMien();
    await loadDanhSachDonVi();
    await loadDanhSachGioiHanVungMien();
    await loadDanhSachGioiHanDonVi();
  };

  const handleOpenStatisticsModal = async () => {
    setStatisticsModalOpen(true);
    setStatisticsLoading(true);
    
    try {
      if (!id) return;
      
      // Load all statistics data
      const [
        overviewResponse,
        donViResponse,
        vungMienResponse,
        cauHoiResponse,
        thoiGianResponse,
        gioiTinhResponse
      ] = await Promise.all([
        ThongKeService.getThongKeTongQuan(id),
        ThongKeService.getThongKeTheoDonVi(id),
        ThongKeService.getThongKeTheoVungMien(id),
        ThongKeService.getThongKeTheoCauHoi(id),
        ThongKeService.getThongKeThoiGian(id),
        ThongKeService.getThongKeTheoGioiTinh(id)
      ]);

      if (overviewResponse && overviewResponse.status === "Success") {
        setThongKeTongQuan(overviewResponse.data);
      }

      if (donViResponse && donViResponse.status === "Success") {
        setThongKeTheoDonVi(donViResponse.data || []);
      }

      if (vungMienResponse && vungMienResponse.status === "Success") {
        setThongKeTheoVungMien(vungMienResponse.data || []);
      }

      if (cauHoiResponse && cauHoiResponse.status === "Success") {
        setThongKeTheoCauHoi(cauHoiResponse.data || []);
      }

      if (thoiGianResponse && thoiGianResponse.status === "Success") {
        setThongKeThoiGian(thoiGianResponse.data || []);
      }

      if (gioiTinhResponse && gioiTinhResponse.status === "Success") {
        setThongKeTheoGioiTinh(gioiTinhResponse.data || null);
      }
      
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
      error("Không thể tải dữ liệu thống kê");
    } finally {
      setStatisticsLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Chi tiết khảo sát
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenGioiHanModal}
            startIcon={<Settings />}
          >
            Cấu hình
          </Button>
          <Button
            startIcon={<div>📊</div>}
            variant="outlined"
            onClick={handleOpenStatisticsModal}
          >
            Thống kê
          </Button>
          {khaoSat && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewResponses}
            >
              Xem phản hồi
            </Button>
          )}
        </Box>
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
          
          {activeTab === 'thong-tin' ? (
            <SurveyInfoTab khaoSat={khaoSat} />
          ) : (
            <SurveyContentTab
              danhSachPhan={danhSachPhan}
              danhSachCauHoi={danhSachCauHoi}
              onAddSection={() => {
                setCurrentPhan(null);
                setFormPhan({ tieu_de: '', mo_ta: '' });
                setModalPhanOpen(true);
              }}
              onEditSection={(phan) => {
                setCurrentPhan(phan);
                setFormPhan({
                  tieu_de: phan.tieu_de,
                  mo_ta: phan.mo_ta || ''
                });
                setModalPhanOpen(true);
              }}
              onDeleteSection={(phanId, phanTitle) => openDeleteModal('phan', phanId, phanTitle)}
              onAddQuestion={(phan) => {
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
              onEditQuestion={(cauHoi) => {
                setCurrentCauHoi(cauHoi);
                setFormCauHoi({
                  noi_dung: cauHoi.noi_dung,
                  loai_cau_hoi: cauHoi.loai_cau_hoi as LoaiCauHoi,
                  bat_buoc: cauHoi.bat_buoc || false
                });
                setTempDapAn(cauHoi.dap_an || []);
                setIsEditMode(true);
                setModalCauHoiOpen(true);
              }}
              onDeleteQuestion={(cauHoiId, cauHoiTitle, maPhan) => openDeleteModal('cauHoi', cauHoiId, cauHoiTitle, maPhan)}
              onMoveSection={() => {/* Handle section reordering */}}
              onReloadAnswers={loadDanhSachCauHoi}
            />
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Không tìm thấy thông tin khảo sát</Typography>
        </Box>
      )}

      {/* Modals */}
      <SectionModal
        open={modalPhanOpen}
        onClose={() => setModalPhanOpen(false)}
        isEdit={!!currentPhan}
        formData={formPhan}
        onFormChange={setFormPhan}
        onSubmit={currentPhan ? handleEditPhan : handleAddPhan}
      />

      <QuestionModal
        open={modalCauHoiOpen}
        onClose={() => setModalCauHoiOpen(false)}
        isEdit={isEditMode}
        formData={formCauHoi}
        onFormChange={setFormCauHoi}
        tempAnswers={tempDapAn}
        onTempAnswersChange={setTempDapAn}
        answerForm={formDapAn}
        onAnswerFormChange={setFormDapAn}
        onSubmit={isEditMode ? handleEditCauHoi : handleAddCauHoi}
      />

      <LimitConfigModal
        open={modalGioiHanOpen}
        onClose={() => {
          setModalGioiHanOpen(false);
          setActiveGioiHanTab(0);
          setSelectedVungMien(null);
          setSelectedDonVi(null);
          setShowVungMienSelector(false);
          setShowDonViSelector(false);
          setFormGioiHanVungMien({ ma_vung_mien: '', so_luong_phan_hoi_toi_da: 0 });
          setFormGioiHanDonVi({ ma_don_vi: '', so_luong_phan_hoi_toi_da: 0 });
        }}
        activeTab={activeGioiHanTab}
        onTabChange={setActiveGioiHanTab}
        // Region limit props
        danhSachGioiHanVungMien={danhSachGioiHanVungMien}
        vungMienHierarchy={vungMienHierarchy}
        selectedVungMien={selectedVungMien}
        showVungMienSelector={showVungMienSelector}
        formGioiHanVungMien={formGioiHanVungMien}
        onVungMienSelect={(vm) => {
          setSelectedVungMien(vm);
          setFormGioiHanVungMien({...formGioiHanVungMien, ma_vung_mien: vm._id});
        }}
        onToggleVungMienSelector={() => setShowVungMienSelector(!showVungMienSelector)}
        onFormGioiHanVungMienChange={setFormGioiHanVungMien}
        onAddGioiHanVungMien={handleAddGioiHanVungMien}
        onDeleteGioiHanVungMien={(id, name) => openDeleteModal('gioiHanVungMien', id, name)}
        // Unit limit props
        danhSachGioiHanDonVi={danhSachGioiHanDonVi}
        donViHierarchy={donViHierarchy}
        selectedDonVi={selectedDonVi}
        showDonViSelector={showDonViSelector}
        formGioiHanDonVi={formGioiHanDonVi}
        onDonViSelect={(dv) => {
          setSelectedDonVi(dv);
          setFormGioiHanDonVi({...formGioiHanDonVi, ma_don_vi: dv._id});
        }}
        onToggleDonViSelector={() => setShowDonViSelector(!showDonViSelector)}
        onFormGioiHanDonViChange={setFormGioiHanDonVi}
        onAddGioiHanDonVi={handleAddGioiHanDonVi}
        onDeleteGioiHanDonVi={(id, name) => openDeleteModal('gioiHanDonVi', id, name)}
      />

      <StatisticsModal
        open={statisticsModalOpen}
        onClose={() => setStatisticsModalOpen(false)}
        activeTab={statisticsActiveTab}
        onTabChange={setStatisticsActiveTab}
        loading={statisticsLoading}
        thongKeTongQuan={thongKeTongQuan}
        thongKeTheoDonVi={thongKeTheoDonVi}
        thongKeTheoVungMien={thongKeTheoVungMien}
        thongKeTheoCauHoi={thongKeTheoCauHoi}
        thongKeThoiGian={thongKeThoiGian}
        thongKeTheoGioiTinh={thongKeTheoGioiTinh}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        target={deleteTarget}
      />
    </Box>
  );
};