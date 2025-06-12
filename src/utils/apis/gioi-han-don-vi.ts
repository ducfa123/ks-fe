import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  try {
    const response = await api.makeAuthRequest({
      url: "/gioi-han-don-vi",
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
      url: `/gioi-han-don-vi/${id}`,
      method: "GET",
    });
    
    return response;
  } catch (error) {
    console.error("Error in getDetailEntity:", error);
    throw error;
  }
};

interface GioiHanDonViPayload {
  ma_khao_sat: string;
  ma_don_vi: string;
  so_luong_phan_hoi_toi_da: number;
}

const insertEntity = (entity: GioiHanDonViPayload) => {
  return api.makeAuthRequest({
    url: "/gioi-han-don-vi",
    method: "POST",
    data: entity,
  });
};

const removeEntity = (id: string) => {
  return api.makeAuthRequest({
    url: `/gioi-han-don-vi/${id}`,
    method: "DELETE",
  });
};

const updateEntity = (id: string, entity: Partial<GioiHanDonViPayload>) => {
  return api.makeAuthRequest({
    url: `/gioi-han-don-vi/${id}`,
    method: "PUT",
    data: entity,
  });
};

const getListBySurvey = async (surveyId: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: `/gioi-han-don-vi/khao-sat/${surveyId}`,
      method: "GET",
    });
    
    // Transform response to match expected structure
    if (response && response.status === "Success" && response.data?.danh_sach_gioi_han_don_vi) {
      return {
        ...response,
        data: response.data.danh_sach_gioi_han_don_vi
      };
    }
    
    return response;
  } catch (error) {
    console.error("Error in getListBySurvey:", error);
    throw error;
  }
};

export const GioiHanDonViService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
  getListBySurvey
};
