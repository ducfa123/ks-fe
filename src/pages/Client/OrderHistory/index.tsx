import { useEffect, useState } from "react";
import { Typography, Button, Tag, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ClientService } from "../../../utils/apis/client";
import { TTable } from "../../../components/tTable";
import { Box } from "@mui/system";

const { Title, Text } = Typography;

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

interface SanPhamDetail {
  _id: string;
  ten: string;
  hinh_anh: string[];
  gia_combo?: number;
  danh_sach_san_pham_detail?: SanPhamDetail[];
}

interface ChiTietDetail {
  _id: string;
  san_pham_detail: SanPhamDetail;
  so_luong: number;
  don_gia: number;
  la_combo: boolean;
  combo_detail?: SanPhamDetail;
}

interface Order {
  _id: string;
  nguoi_dung_detail: Array<{
    _id: string;
    ho_ten: string;
  }>;
  chi_tiet_detail: ChiTietDetail[];
  tong_tien_sau_giam: number;
  ma_giam_gia_detail: Array<{
    _id: string;
    ten: string;
    ma_code: string;
    giam_phan_tram: number;
  }>;
  trang_thai: string;
  created_date: number;
}

const ProductList: React.FC<{ items: ChiTietDetail[] }> = ({ items }) => {
  const renderProductItem = (item: ChiTietDetail) => {
    const isCombo = item.la_combo;
    const product = item.san_pham_detail;
    const imgSrc = product?.hinh_anh?.[0] || "";

    return (
      <div className="flex items-start gap-2">
        <div>
          <Box className="block">
            {" "}
            {isCombo && (
              <Tag color="blue" className="ml-1">
                Combo
              </Tag>
            )}
            {product.ten}
          </Box>
          <Text type="secondary" className="text-xs">
            {item.so_luong} x{" "}
            {formatCurrency(isCombo ? product.gia_combo || 0 : item.don_gia)}
          </Text>
          {isCombo && product.danh_sach_san_pham_detail && (
            <div className="mt-1 ml-2 space-y-1" style={{ marginLeft: "20px" }}>
              {product.danh_sach_san_pham_detail.map((subProduct, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <Text type="secondary" className="text-xs">
                    • {subProduct.ten}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="border-b border-gray-100 last:border-0 pb-2 last:pb-0"
        >
          {renderProductItem(item)}
        </div>
      ))}
    </div>
  );
};

export const ClientOrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchOrders = async (page: number, pageSize: number) => {
    try {
      const response = await ClientService.getOrderHistory(page, pageSize);
      console.log({ response });
      setOrders(response.items);
      setPagination({
        current: response.page,
        pageSize: response.size,
        total: response.total,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(1, 10);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: string) => {
    const statusTexts: Record<string, string> = {
      paid: "Đã thanh toán",
      pending: "Chờ thanh toán",
      cancelled: "Đã hủy",
    };
    return statusTexts[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "success",
      pending: "warning",
      cancelled: "error",
    };
    return colors[status] || "default";
  };

  const columns = [
    {
      id: "_id",
      label: "Mã đơn hàng",
      minWidth: 100,
      align: "left" as const,
    },
    // {
    //   id: "nguoi_dung",
    //   label: "Người dùng",
    //   minWidth: 120,
    //   align: "left" as const,
    // },
    {
      id: "chi_tiet",
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
      minWidth: 100,
      align: "left" as const,
    },
    {
      id: "trang_thai",
      label: "Trạng thái",
      minWidth: 100,
      align: "left" as const,
    },
    {
      id: "created_date",
      label: "Ngày tạo",
      minWidth: 50,
      align: "left" as const,
    },
    {
      id: "action",
      label: "Hành động",
      minWidth: 100,
      align: "center" as const,
    },
  ] as Array<{
    id: string;
    label: string;
    minWidth: number;
    align: "left" | "right" | "center";
  }>;

  const rows = orders?.map((order) => {
    const discount = order.ma_giam_gia_detail[0];
    return {
      _id: order._id.slice(-6).toUpperCase(),
      nguoi_dung: order.nguoi_dung_detail[0]?.ho_ten || "Không xác định",
      chi_tiet: <ProductList items={order.chi_tiet_detail} />,
      tong_tien: formatCurrency(order.tong_tien_sau_giam),
      giam_gia: discount ? (
        <Tooltip title={`Mã: ${discount.ma_code}`}>
          <Tag color="green">Giảm ({discount.giam_phan_tram}%)</Tag>
        </Tooltip>
      ) : (
        "-"
      ),
      trang_thai: (
        <Tag color={getStatusColor(order.trang_thai)}>
          {getStatusText(order.trang_thai)}
        </Tag>
      ),
      created_date: formatDate(order.created_date),
      action: (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/client/orders/${order._id}`)}
        >
          Chi tiết
        </Button>
      ),
    } as Record<string, React.ReactNode>;
  });

  return (
    <div className="p-6">
      <Title level={4} className="mb-6">
        Lịch sử đơn hàng
      </Title>
      <div className="bg-white rounded-lg shadow-sm">
        <TTable
          columns={columns}
          rows={rows}
          rowIdKey="_id"
          pageSize={pagination.pageSize}
          pageIndex={pagination.current}
          total={pagination.total}
          onChangePage={(page) => fetchOrders(page, pagination.pageSize)}
          onRowPerPageChange={(pageSize) => fetchOrders(1, pageSize)}
        />
      </div>
    </div>
  );
};
