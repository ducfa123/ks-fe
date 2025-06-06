import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  try {
    const response = await api.makeAuthRequest({
      url: "/cau-hoi",
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
      url: `/cau-hoi/${id}`,
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
    url: "/cau-hoi",
    method: "POST",
    data: entity,
  });
};

const removeEntity = (id: string) => {
  return api.makeAuthRequest({
    url: `/cau-hoi/${id}`,
    method: "DELETE",
  });
};

const updateEntity = (id: string, entity: any = {}) => {
  return api.makeAuthRequest({
    url: `/cau-hoi/${id}`,
    method: "PUT",
    data: entity,
  });
};

// API để lấy danh sách câu hỏi theo ID phần khảo sát
const getListByPhanKhaoSat = async (phanKhaoSatId: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: `/cau-hoi/by-phan-khao-sat/${phanKhaoSatId}`,
      method: "GET",
    });
    
    return response;
  } catch (error) {
    console.error(`Error in getListByPhanKhaoSat for phanKhaoSatId ${phanKhaoSatId}:`, error);
    throw error;
  }
};

// API để cập nhật thứ tự các câu hỏi
const updateThuTu = (data: any) => {
  return api.makeAuthRequest({
    url: "/cau-hoi/update-thu-tu",
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
    url: `/cau-hoi/tim-theo-vai-tro?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "POST",
    data: {
      vai_tro_names: vaiTros,
    },
  });

  return ans?.data;
};

export const CauHoiService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
  getListEntityByVaiTros,
  getListByPhanKhaoSat,
  updateThuTu
};