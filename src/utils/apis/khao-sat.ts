import createApiServices from "./make-api-request";
import { KhaoSatUI } from "../../pages/management/khao-sat/types";

const api = createApiServices();

interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  offset: number;
}

interface KhaoSatListResponse {
  status: string;
  statusCode: number;
  message: string;
  data: {
    danh_sach_khao_sat: KhaoSatUI[];
    pagination: PaginationInfo;
  };
}

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  try {
  
    
    
    const response = await api.makeAuthRequest({
      url: "/khao-sat",
      method: "GET",
      options: {
        params: {
          page: pageIndex,
          limit: pageSize,
          search: keyword
        }
      }    });
    
    return response;
  } catch (error) {
    console.error("Error in getListEntity:", error);
    throw error;
  }
};

const getDetailEntity = async (id: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: `/khao-sat/${id}`,
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
    url: "/khao-sat",
    method: "POST",
    data: entity,
  });
};

const removeEntity = (id: string) => {
  return api.makeAuthRequest({
    url: `/khao-sat/${id}`,
    method: "DELETE",
  });
};

const updateEntity = (id: string, entity: any = {}) => {
  return api.makeAuthRequest({
    url: `/khao-sat/${id}`,
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
    url: `/khao-sat/tim-theo-vai-tro?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "POST",
    data: {
      vai_tro_names: vaiTros,
    },
  });

  return ans?.data;
};
export const KhaoSatService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
  getListEntityByVaiTros,
};