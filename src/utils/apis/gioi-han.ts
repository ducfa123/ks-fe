import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  try {
    const response = await api.makeAuthRequest({
      url: "/gioi-han-vung-mien",
      method: "GET",
      options: {
        params: {
          page: pageIndex,
          limit: pageSize,
          search: keyword
        }
      }
    });
    
    return response;
  } catch (error) {
    console.error("Error in getListEntity:", error);
    throw error;
  }
};

const getDetailEntity = async (id: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: `/gioi-han-vung-mien/${id}`,
      method: "GET",
    });
    
    return response;
  } catch (error) {
    console.error("Error in getDetailEntity:", error);
    throw error;
  }
};

interface GioiHanVungMienPayload {
  ma_khao_sat: string;
  ma_vung_mien: string;
  so_luong_phan_hoi_toi_da: number;
}

const insertEntity = (entity: GioiHanVungMienPayload) => {
  return api.makeAuthRequest({
    url: "/gioi-han-vung-mien",
    method: "POST",
    data: entity,
  });
};

const removeEntity = (id: string) => {
  return api.makeAuthRequest({
    url: `/gioi-han-vung-mien/${id}`,
    method: "DELETE",
  });
};

const updateEntity = (id: string, entity: Partial<GioiHanVungMienPayload>) => {
  return api.makeAuthRequest({
    url: `/gioi-han-vung-mien/${id}`,
    method: "PUT",
    data: entity,
  });
};

const getListBySurvey = async (surveyId: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: `/gioi-han-vung-mien/khao-sat/${surveyId}`,
      method: "GET",
    });
    
    // Transform response to match expected structure
    if (response && response.status === "Success" && response.data?.danh_sach_gioi_han_vung_mien) {
      return {
        ...response,
        data: response.data.danh_sach_gioi_han_vung_mien
      };
    }
    
    return response;
  } catch (error) {
    console.error("Error in getListBySurvey:", error);
    throw error;
  }
};



export const GioiHanVungMienService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
  getListBySurvey
};
