import { Box, Typography, Paper, Chip, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import { TTable } from "../../../components/tTable";
import { APIServices } from "../../../utils";
import { useNotifier } from "../../../provider/NotificationProvider";
import { addFieldToItems } from "../../../utils/table-helper";
import TSearchText from "../../../components/tSearchText";

interface PhanHoiUI {
  [key: string]: any;
  _id: string | null;
  ma_vai_tro?: string | null;
  ten_dang_nhap?: string | null;
  mat_khau?: string | null;
  ten_nguoi_dung?: string | null;
  email?: string | null;
  sdt?: string | null;
  ma_don_vi?: {
    _id: string;
    ten_don_vi: string;
    nganh: string;
    ma_don_vi_cha: string;
    ma_vung_mien: string;
    ma_phan_cap: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  } | null;
  ma_phan_hoi: string;
  thoi_gian_phan_hoi: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const columns = [
  {
    id: "nguoi_phan_hoi",
    title: "Người phản hồi",
    dataIndex: "nguoi_phan_hoi",
    key: "nguoi_phan_hoi",
    label: "Người phản hồi",
    width: "18%",
  },
  {
    id: "email",
    title: "Email",
    dataIndex: "email",
    key: "email",
    label: "Email",
    width: "18%",
  },
  {
    id: "don_vi",
    title: "Đơn vị",
    dataIndex: "don_vi",
    key: "don_vi",
    label: "Đơn vị",
    width: "15%",
  },
  {
    id: "sdt",
    title: "Số điện thoại",
    dataIndex: "sdt",
    key: "sdt",
    label: "Số điện thoại",
    width: "13%",
  },
  {
    id: "thoi_gian_phan_hoi_text",
    title: "Thời gian phản hồi",
    dataIndex: "thoi_gian_phan_hoi_text",
    key: "thoi_gian_phan_hoi_text",
    label: "Thời gian phản hồi",
    width: "16%",
  },
  {
    id: "trang_thai_user",
    title: "Trạng thái",
    dataIndex: "trang_thai_user",
    key: "trang_thai_user",
    label: "Trạng thái",
    width: "10%",
  },
  {
    id: "actions",
    title: "Thao tác",
    dataIndex: "actions",
    key: "actions",
    label: "Thao tác",
    width: "10%",
  },
];

export const KhaoSatResponsesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useNotifier();
  
  const [khaoSat, setKhaoSat] = useState<any>(null);
  const [responses, setResponses] = useState<PhanHoiUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (id) {
      loadKhaoSatInfo();
      loadResponses();
    }
  }, [id]);

  const loadKhaoSatInfo = async () => {
    try {
      if (!id) return;
      
      const response = await APIServices.KhaoSatService.getDetailEntity(id);
      if (response && response.status === "Success" && response.data) {
        setKhaoSat(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải thông tin khảo sát:", err);
    }
  };

  const loadResponses = async (
    requestSize = pageSize,
    requestIndex = pageIndex,
    requestText = searchText
  ) => {
    try {
      setLoading(true);
      if (!id) return;

      const response = await APIServices.PhanHoiService.getResponsesByUser(
        id,
        requestIndex,
        requestSize
      );
      
      if (response && response.status === "Success") {
        const responseData = response.data;
        setResponses(responseData.danh_sach_da_phan_hoi || []);
        
        if (responseData.pagination) {
          setTotal(responseData.pagination.total || 0);
        } else {
          setTotal(responseData.danh_sach_da_phan_hoi?.length || 0);
        }
        
        setPageSize(requestSize);
        setPageIndex(requestIndex);
        setSearchText(requestText);
      } else {
        error("Không thể tải danh sách phản hồi");
        setResponses([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Lỗi khi tải phản hồi:", err);
      error("Không thể tải danh sách phản hồi");
      setResponses([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    loadResponses(pageSize, 1, value);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch (e) {
      return dateString;
    }
  };

  const handleViewDetails = async (responseId: string) => {
    try {
      navigate(`/admin/khao-sat/phan-hoi-chi-tiet/${responseId}`);
    } catch (err) {
      console.error("Lỗi khi xem chi tiết phản hồi:", err);
      error("Không thể xem chi tiết phản hồi");
    }
  };

  let rowsRender = [...responses]; 
  
  rowsRender = addFieldToItems(rowsRender, "nguoi_phan_hoi", (row: PhanHoiUI) => {
    if (!row._id || !row.ten_nguoi_dung) {
      return "Ẩn danh";
    }
    return row.ten_nguoi_dung;
  });

  rowsRender = addFieldToItems(rowsRender, "email", (row: PhanHoiUI) => {
    if (!row._id || !row.email) {
      return "Ẩn danh";
    }
    return row.email;
  });

  rowsRender = addFieldToItems(rowsRender, "don_vi", (row: PhanHoiUI) => {
    if (!row._id || !row.ma_don_vi) {
      return "Không có";
    }
    return row.ma_don_vi.ten_don_vi || "Không có";
  });

  rowsRender = addFieldToItems(rowsRender, "sdt", (row: PhanHoiUI) => {
    if (!row._id || !row.sdt) {
      return "Không có";
    }
    return row.sdt;
  });

  rowsRender = addFieldToItems(rowsRender, "thoi_gian_phan_hoi_text", (row: PhanHoiUI) => {
    return formatDate(row.thoi_gian_phan_hoi);
  });

  rowsRender = addFieldToItems(rowsRender, "trang_thai_user", (row: PhanHoiUI) => {
    return (
      <Chip 
        label={row._id ? "Đã đăng ký" : "Ẩn danh"} 
        color={row._id ? "success" : "warning"} 
        size="small"
      />
    );
  });

  rowsRender = addFieldToItems(rowsRender, "actions", (row: PhanHoiUI) => {
    return (
      <Tooltip title="Xem chi tiết phản hồi">
        <IconButton
          size="small"
          onClick={() => handleViewDetails(row.ma_phan_hoi)}
          color="primary"
        >
          <Visibility fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1">
            Phản hồi khảo sát
          </Typography>
          {khaoSat && (
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              {khaoSat.tieu_de}
            </Typography>
          )}
        </Box>
      </Box>

      {khaoSat && (
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Tổng phản hồi</Typography>
              <Typography variant="h6" color="primary.main">{total}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Giới hạn phản hồi</Typography>
              <Typography variant="h6">
                {khaoSat.gioi_han_phan_hoi > 0 ? khaoSat.gioi_han_phan_hoi : "Không giới hạn"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Trạng thái</Typography>
              <Chip 
                label={khaoSat.trang_thai ? "Hoạt động" : "Không hoạt động"} 
                color={khaoSat.trang_thai ? "success" : "error"} 
                size="small"
              />
            </Box>
          </Box>
        </Paper>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Danh sách phản hồi ({total})
        </Typography>
        <TSearchText onSearch={handleSearch} placeholder="Tìm kiếm theo tên, email..." />
      </Box>

      <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TTable
          rows={rowsRender}
          columns={columns}
          showIndex={true}
          pageSize={pageSize}
          pageIndex={pageIndex}
          total={total}
          // loading={loading}
          onChangePage={(value) => {
            loadResponses(pageSize, value);
          }}
          onRowPerPageChange={(value) => {
            loadResponses(value, 1);
          }}
        />
      </Box>
    </Box>
  );
};
