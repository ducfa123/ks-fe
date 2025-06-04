import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  try {
    const response = await api.makeAuthRequest({
      url: "/khao-sat",
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
  const ans = await api.makeAuthRequest({
    url: `/khao-sat/${id}`,
    method: "GET",
  });

  return ans?.data;
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