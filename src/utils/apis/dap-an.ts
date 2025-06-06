import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  try {
    const response = await api.makeAuthRequest({
      url: "/dap-an",
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
      url: `/dap-an/${id}`,
      method: "GET",
    });
    
    // Trả về toàn bộ response để component có thể kiểm tra status
    return response;
  } catch (error) {
    console.error("Error in getDetailEntity:", error);
    throw error;
  }
};

const insertEntity = (entity: any) => {
  return api.makeAuthRequest({
    url: "/dap-an",
    method: "POST",
    data: entity,
  });
};

const removeEntity = (id: string) => {
  return api.makeAuthRequest({
    url: `/dap-an/${id}`,
    method: "DELETE",
  });
};

const updateEntity = (id: string, entity: any = {}) => {
  return api.makeAuthRequest({
    url: `/dap-an/${id}`,
    method: "PUT",
    data: entity,
  });
};

// API để lấy danh sách đáp án theo ID câu hỏi
const getListByCauHoi = async (cauHoiId: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: `/dap-an/by-cau-hoi/${cauHoiId}`,
      method: "GET",
    });
    
    return response;
  } catch (error) {
    console.error(`Error in getListByCauHoi for cauHoiId ${cauHoiId}:`, error);
    throw error;
  }
};

// API để cập nhật thứ tự các đáp án
const updateThuTu = (data: any) => {
  return api.makeAuthRequest({
    url: "/dap-an/update-thu-tu",
    method: "PUT",
    data: data,
  });
};

const getListEntityByVaiTros = async (
  pageIndex = 1,
  pageSize = 10,
  keyword = "",
  vaiTros: Array<string>
) => {
  const ans = await api.makeAuthRequest({
    url: `/dap-an/tim-theo-vai-tro?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "POST",
    data: {
      vai_tro_names: vaiTros,
    },
  });

  return ans?.data;
};

export const DapAnService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
  getListEntityByVaiTros,
  getListByCauHoi,
  updateThuTu
};