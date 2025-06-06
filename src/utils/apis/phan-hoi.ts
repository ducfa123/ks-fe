import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  try {
    const response = await api.makeAuthRequest({
      url: "/phan-hoi",
      method: "GET",
      params: {
        page: pageIndex,
        limit: pageSize,
        search: keyword
      }
    });
    
    // Trả về toàn bộ response để component có thể xử lý
    return response;
  } catch (error) {
    console.error("Error in getListEntity:", error);
    throw error;
  }
};

const getDetailEntity = async (id: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: `/phan-hoi/${id}`,
      method: "GET",
    });
    
    // Trả về toàn bộ response để component có thể kiểm tra status
    return response;
  } catch (error) {
    console.error("Error in getDetailEntity:", error);
    throw error;
  }
};

interface ChiTietPhanHoi {
  ma_cau_hoi: string;
  ma_dap_an?: string;
  tra_loi?: string;
}

interface PhanHoiPayload {
  ma_khao_sat: string;
  ma_nguoi_dung: string | null;
  ghi_chu?: string;
  an_danh?: boolean;
  chi_tiet_phan_hoi: ChiTietPhanHoi[];
}

const insertEntity = (entity: PhanHoiPayload) => {
  return api.makeAuthRequest({
    url: "/phan-hoi/detail",
    method: "POST",
    data: entity,
  });
};

const removeEntity = (id: string) => {
  return api.makeAuthRequest({
    url: `/phan-hoi/${id}`,
    method: "DELETE",
  });
};

const updateEntity = (id: string, entity: any = {}) => {
  return api.makeAuthRequest({
    url: `/phan-hoi/${id}`,
    method: "PUT",
    data: entity,
  });
};

const getListEntityByVaiTros = async (
  pageIndex = 1,
  pageSize = 10,
  keyword = "",
  vaiTros: Array<string>
) => {
  const ans = await api.makeAuthRequest({
    url: `/phan-hoi/tim-theo-vai-tro?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "POST",
    data: {
      vai_tro_names: vaiTros,
    },
  });

  return ans?.data;
};

export const PhanHoiService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
  getListEntityByVaiTros,
};