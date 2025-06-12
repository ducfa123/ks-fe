import { Box } from "@mui/system";
import * as styles from "./styles";
import { useEffect, useState } from "react";
import { TTable } from "../../../components/tTable";
import {
  addActionToRows,
  addFieldToItems,
} from "../../../utils/table-helper";
import { KhaoSatUI, columnForms, columns } from "./types";
import { TShowConfirm } from "../../../components";
import { useNotifier } from "../../../provider/NotificationProvider";
import TSearchText from "../../../components/tSearchText";
import { Button } from "@mui/material";
import { IoAddCircle } from "react-icons/io5";
import { TFormModal } from "../../../components/tFormModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { APIServices } from "../../../utils";
import { Link } from "react-router-dom";

export const KhaoSatPage = () => {
  const [khaoSats, setKhaoSats] = useState<any[]>([]);
  const [currentEntity, setCurrentEntity] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const [modalConfirmRemove, setModalConfirmRemoveState] = useState<boolean>(false);
  const { success, error } = useNotifier();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const getCurrentUser = async () => {
    try {
      const response = await APIServices.Auth.getPermission();
      if (response && response.status === "Success" && response.data) {
        setCurrentUser(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
    }
  };
  
  const loadData = async (
    requestSize = pageSize,
    requestIndex = pageIndex,
    requestText = searchText
  ) => {
    try {
      setLoading(true);
      // Ensure search text is properly trimmed and handled
      const searchParam = requestText?.trim() || "";
      
      const response = await APIServices.KhaoSatService.getListEntity(
        requestIndex,
        requestSize,
        searchParam
      );
      
      if (response && response.status === "Success") {
        const responseData = response.data;
        
        // Handle different possible response structures
        if (responseData) {
          // If response has danh_sach_khao_sat property
          if (responseData.danh_sach_khao_sat) {
            setKhaoSats(responseData.danh_sach_khao_sat);
            // Use pagination info if available, otherwise use array length
            setTotal(responseData.pagination?.total || responseData.total || responseData.danh_sach_khao_sat.length);
          } 
          // If response data is directly an array
          else if (Array.isArray(responseData)) {
            setKhaoSats(responseData);
            setTotal(responseData.length);
          } 
          // If response has items property
          else if (responseData.items) {
            setKhaoSats(responseData.items);
            setTotal(responseData.pagination?.total || responseData.total || responseData.items.length);
          } 
          // Default case
          else {
            setKhaoSats([]);
            setTotal(0);
          }
        } else {
          setKhaoSats([]);
          setTotal(0);
        }
        
        setPageSize(requestSize);
        setPageIndex(requestIndex);
        setSearchText(requestText);
      } else {
        error("Dữ liệu không đúng định dạng");
        setKhaoSats([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      error("Không thể tải dữ liệu khảo sát");
      setKhaoSats([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
    loadData();
  }, []);

  const handleSearch = (value: string) => {
    loadData(pageSize, 1, value);
  };

  const handleEdit = (row: any) => {
    const formData = {
      _id: row._id,
      tieu_de: row.tieu_de,
      mo_ta: row.mo_ta,
      thoi_gian_bat_dau: row.thoi_gian_bat_dau,
      thoi_gian_ket_thuc: row.thoi_gian_ket_thuc,
      gioi_han_phan_hoi: row.gioi_han_phan_hoi,
      cho_phep_tra_loi_nhieu_lan: row.cho_phep_tra_loi_nhieu_lan,
      cho_phep_an_danh: row.cho_phep_an_danh,
      trang_thai: row.trang_thai ? "active" : "inactive"
    };
    
    handleOpenModal(formData);
  };

  const handleConfirmDelete = (row: any) => {
    setCurrentEntity(row);
    setModalConfirmRemoveState(true);
  };

  const handleRemove = async (row: any) => {
    try {
      await APIServices.KhaoSatService.removeEntity(row._id);
      success("Xoá khảo sát thành công");
      loadData();
    } catch (err) {
      error("Xoá khảo sát thất bại");
    } finally {
      setModalConfirmRemoveState(false);
    }
  };

  const handleOpenModal = (data?: Record<string, any>) => {
    setEditingData(data || {});
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    try {
      setModalOpen(false);
    } catch (err) {
      console.error("Lỗi khi đóng modal:", err);
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    const { actions: _, ...data } = values;
  
    try {
      if (data._id) {
        const updateData = {
          tieu_de: data.tieu_de,
          mo_ta: data.mo_ta,
          thoi_gian_bat_dau: data.thoi_gian_bat_dau,
          thoi_gian_ket_thuc: data.thoi_gian_ket_thuc,
          gioi_han_phan_hoi: data.gioi_han_phan_hoi || 0,
          cho_phep_tra_loi_nhieu_lan: data.cho_phep_tra_loi_nhieu_lan || false,
          cho_phep_an_danh: data.cho_phep_an_danh || false,
          trang_thai: data.trang_thai === "active"
        };
  
        await APIServices.KhaoSatService.updateEntity(data._id, updateData);
        success("Cập nhật khảo sát thành công");
      } else {
        let userId = currentUser?._id;
        
        if (!userId) {
          const response = await APIServices.Auth.getPermission();
          if (response && response.status === "Success" && response.data) {
            userId = response.data;
            setCurrentUser(response.data);
          }
        }
        
        if (!userId) {
          error("Không thể xác định người tạo. Vui lòng đăng nhập lại.");
          return;
        }
        
        const newData = {
          tieu_de: data.tieu_de,
          mo_ta: data.mo_ta,
          ma_nguoi_tao: userId, 
          thoi_gian_bat_dau: data.thoi_gian_bat_dau,
          thoi_gian_ket_thuc: data.thoi_gian_ket_thuc,
          gioi_han_phan_hoi: data.gioi_han_phan_hoi || 0,
          cho_phep_tra_loi_nhieu_lan: data.cho_phep_tra_loi_nhieu_lan || false,
          cho_phep_an_danh: data.cho_phep_an_danh || false,
          trang_thai: data.trang_thai === "active"
        };
  
        await APIServices.KhaoSatService.insertEntity(newData);
        success("Thêm khảo sát thành công");
      }
    } catch (ex) {
      console.error("Lỗi khi thêm/cập nhật khảo sát:", ex);
      if (data._id) error("Cập nhật khảo sát thất bại");
      else error("Thêm khảo sát thất bại");
    } finally {
      setModalOpen(false);
      loadData();
    }
  };
  let rowsRender = [...khaoSats];
  
  // Thêm trường tiêu đề có link
  rowsRender = addFieldToItems(rowsRender, "tieu_de_link", (row: any) => {
    if (!row || !row.tieu_de || !row._id) {
      return "Không xác định";
    }
    return (
      <Link 
        to={`/admin/khao-sat/${row._id}`} 
        style={{ color: '#0A8DEE', textDecoration: 'none' }}
      >
        {row.tieu_de}
      </Link>
    );
  });
  
  rowsRender = addFieldToItems(rowsRender, "nguoi_tao", (row: any) => {
    if (!row || !row.ma_nguoi_tao) {
      return "Không xác định";
    }
    return row.ma_nguoi_tao.ten_nguoi_dung || "Không xác định";
  });
  
  rowsRender = addFieldToItems(rowsRender, "trang_thai_text", (row: any) => {
    if (row === undefined || row === null) {
      return "Không xác định";
    }
    return row.trang_thai === true ? "Hoạt động" : "Không hoạt động";
  });
  
  rowsRender = addFieldToItems(rowsRender, "thoi_gian_bat_dau_text", (row: any) => {
    if (!row || !row.thoi_gian_bat_dau) {
      return "";
    }
    try {
      return new Date(row.thoi_gian_bat_dau).toLocaleString();
    } catch (e) {
      return row.thoi_gian_bat_dau || "";
    }
  });
  
  rowsRender = addFieldToItems(rowsRender, "thoi_gian_ket_thuc_text", (row: any) => {
    if (!row || !row.thoi_gian_ket_thuc) {
      return "";
    }
    try {
      return new Date(row.thoi_gian_ket_thuc).toLocaleString();
    } catch (e) {
      return row.thoi_gian_ket_thuc || "";
    }
  });

  rowsRender = addActionToRows(
    rowsRender,
    [
      {
        label: "Sửa",
        icon: <FaEdit />,
        color: "#0A8DEE",
        onClick: handleEdit,
      },
      {
        label: "Xoá",
        icon: <FaTrash />,
        color: "#ff6666",
        onClick: handleConfirmDelete,
      },
    ],
    "flex-end"
  );

  return (
    <Box sx={styles.container}>
      <Box sx={styles.topBarStyle}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Button
            variant="contained"
            startIcon={<IoAddCircle />}
            sx={styles.addButtonStyle}
            onClick={() => handleOpenModal()}
          >
            Thêm khảo sát
          </Button>
        </Box>

        <TSearchText onSearch={handleSearch} />
      </Box>

      <Box sx={styles.tableContainerStyle}>
        <TTable
          rows={rowsRender}
          columns={columns}
          showIndex={true}
          pageSize={pageSize}
          pageIndex={pageIndex}
          total={total}
          // loading={loading}
          onChangePage={(value) => {
            loadData(pageSize, value, searchText); // Pass searchText to preserve search
          }}
          onRowPerPageChange={(value) => {
            loadData(value, 1, searchText); // Pass searchText to preserve search
          }}
        />
      </Box>

      <TFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        columns={columnForms}
        initialValues={editingData}
        onSubmit={handleSubmit}
      />

      <TShowConfirm
        visible={modalConfirmRemove}
        title={"Thông báo"}
        message={`Bạn có chắc chắn xoá khảo sát [${currentEntity?.tieu_de}] không?`}
        onConfirm={() => {
          setModalConfirmRemoveState(false);
          if (currentEntity) handleRemove(currentEntity);
        }}
        onClose={() => {
          setModalConfirmRemoveState(false);
        }}
        onCancel={() => {
          setModalConfirmRemoveState(false);
        }}
      />
    </Box>
  );
};