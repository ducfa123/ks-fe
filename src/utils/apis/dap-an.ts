import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  try {
    const response = await api.makeAuthRequest({
      url: "/dap-an",
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

const getListByCauHoi = async (cauHoiId: string) => {
  try {
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token available');
      throw new Error('Authentication required - no token found');
    }
    

    const response = await api.makeAuthRequest({
      url: `/dap-an/by-cau-hoi/${cauHoiId}`,
      method: "GET",
    });
    

    return response;
  } catch (error) {
    console.error(`=== ERROR in getListByCauHoi for question: ${cauHoiId} ===`);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      hasAuthHeader: !!error.config?.headers?.Authorization
    });
    
    // If it's a 403, it's likely an authentication issue
    if (error.response?.status === 403) {
      console.error('403 Forbidden - Authentication failed');
      console.error('Current token status:', {
        localStorage: !!localStorage.getItem('token'),
        requestHeaders: error.config?.headers
      });
    }
    
    throw error;
  }
};

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