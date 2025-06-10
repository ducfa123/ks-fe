import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  try {
    const response = await api.makeAuthRequest({
      url: "/vung-mien",
      method: "GET",
      options: {
        params: {
          page: pageIndex,
          limit: pageSize,
          search: keyword
        }
      }
    });
    
    // Transform response to match expected structure
    if (response && response.status === "Success" && response.data?.danh_sach_vung_mien) {
      return {
        ...response,
        data: response.data.danh_sach_vung_mien
      };
    }
    
    return response;
  } catch (error) {
    console.error("Error in getListEntity:", error);
    throw error;
  }
};

export const VungMienService = {
  getListEntity,
};