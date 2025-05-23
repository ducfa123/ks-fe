import createApiServices from "./make-api-request";

const api = createApiServices();

const danhSachDonHang = async (
  pageIndex = 1,
  pageSize = 10,
  keyword = "",
  trangThai: string
) => {
  const ans = await api.makeAuthRequest({
    url: `/don-hang?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}&trang_thai=${trangThai}`,
    method: "GET",
  });

  return ans?.data;
};

export const LichSuDonHangService = {
  danhSachDonHang,
};
