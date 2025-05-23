import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
} from "@mui/material";
import { LichSuDonHangService } from "../../utils/apis/lich-su-don-hang";
import { formatCurrency } from "../../utils/formatCurrency";
import dayjs from "dayjs";
import { TTable } from "../../components/tTable";
import TSearchText from "../../components/tSearchText";

interface OrderItem {
  _id: string;
  ma_nguoi_dung: string;
  nguoi_dung_detail: Array<{
    _id: string;
    ho_ten: string;
  }>;
  tong_tien: number;
  tong_tien_sau_giam: number;
  ma_giam_gia: string | null;
  trang_thai: string;
  phuong_thuc_thanh_toan: string;
  ma_thanh_toan: string;
  created_date: number;
  last_update: number;
  chi_tiet_detail: Array<{
    so_luong: number;
    la_combo: boolean;
    don_gia: number;
    san_pham_detail: {
      _id: string;
      ten: string;
      ma_san_pham: string;
      hinh_anh: string[];
    };
  }>;
}

const AdminOrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await LichSuDonHangService.danhSachDonHang(
        pageIndex,
        pageSize,
        keyword,
        status === "all" ? "" : status
      );
      setOrders(response.items);
      setTotal(response.total);
      setPageSize(response.size);
      setPageIndex(response.page);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pageIndex, pageSize, keyword, status]);

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const columns = [
    {
      id: "stt",
      label: "STT",
      minWidth: 100,
      align: "left" as const,
    },
    {
      id: "_id",
      label: "Mã đơn hàng",
      minWidth: 100,
      align: "left" as const,
    },
    {
      id: "nguoi_dung",
      label: "Khách hàng",
      minWidth: 150,
      align: "left" as const,
    },
    {
      id: "san_pham",
      label: "Sản phẩm",
      minWidth: 200,
      align: "left" as const,
    },
    {
      id: "tong_tien",
      label: "Tổng tiền",
      minWidth: 120,
      align: "right" as const,
    },
    {
      id: "giam_gia",
      label: "Giảm giá",
      minWidth: 150,
      align: "left" as const,
    },
    {
      id: "trang_thai",
      label: "Trạng thái",
      minWidth: 120,
      align: "left" as const,
    },
    {
      id: "ngay_tao",
      label: "Ngày tạo",
      minWidth: 150,
      align: "left" as const,
    },
    {
      id: "phuong_thuc",
      label: "Phương thức thanh toán",
      minWidth: 150,
      align: "center" as const,
    },
  ];

  const rows = orders.map((order) => ({
    _id: order._id.slice(-6).toUpperCase(),
    nguoi_dung: order.nguoi_dung_detail[0]?.ho_ten || "N/A",
    san_pham: (
      <Box>
        {order.chi_tiet_detail.map((item, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            {item.san_pham_detail.ten} x {item.so_luong}
          </Box>
        ))}
      </Box>
    ),
    tong_tien: formatCurrency(order.tong_tien),
    giam_gia: order.ma_giam_gia ? (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Chip
          label={order.ma_giam_gia}
          size="small"
          sx={{
            bgcolor: "#e3f2fd",
            color: "#1976d2",
            "& .MuiChip-label": { 
              fontWeight: 500,
              fontSize: "0.75rem"
            },
            maxWidth: "fit-content"
          }}
        />
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 0.5,
          color: "#2e7d32",
          fontWeight: 500,
          fontSize: "0.875rem"
        }}>
          <Typography variant="caption" sx={{ color: "inherit", fontWeight: "inherit" }}>
            Giảm
          </Typography>
          <Typography variant="caption" sx={{ color: "inherit", fontWeight: "inherit" }}>
            {formatCurrency(order.tong_tien - order.tong_tien_sau_giam)}
          </Typography>
        </Box>
      </Box>
    ) : (
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        Không có
      </Typography>
    ),
    trang_thai: (
      <Chip
        label={getStatusText(order.trang_thai)}
        color={getStatusColor(order.trang_thai)}
        size="small"
      />
    ),
    ngay_tao: (
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {dayjs(order.created_date).format("HH:mm")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {dayjs(order.created_date).format("DD/MM/YYYY")}
        </Typography>
      </Box>
    ),
    phuong_thuc: (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Chip
          label={
            order.phuong_thuc_thanh_toan === "payos"
              ? "PayOS"
              : order.phuong_thuc_thanh_toan
          }
          size="small"
          sx={{
            bgcolor: "#f5f5f5",
            "& .MuiChip-label": { fontWeight: 500 },
          }}
        />
      </Box>
    ),
  }));

  return (
    <Box sx={{ p: 0, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Lịch sử đơn hàng
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TSearchText placeholder="Tìm kiếm đơn hàng..." onSearch={setKeyword} />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            label="Trạng thái"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ thanh toán</MenuItem>
            <MenuItem value="paid">Đã thanh toán</MenuItem>
            <MenuItem value="cancelled">Đã hủy</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ bgcolor: "white", borderRadius: 1, boxShadow: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TTable
            columns={columns}
            rows={rows}
            rowIdKey="_id"
            pageSize={pageSize}
            pageIndex={pageIndex}
            total={total}
            onChangePage={(value) => {
              setPageIndex(value);
            }}
            onRowPerPageChange={(value) => {
              setPageSize(value);
              setPageIndex(1);
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default AdminOrderHistoryPage;
