import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  const ans = await api.makeAuthRequest({
    url: `/vai-tro?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "GET",
  });

  return ans?.data;
};

const getDetailEntity = async (id: string) => {
  const ans = await api.makeAuthRequest({
    url: `/vai-tro/${id}`,
    method: "GET",
  });

  return ans?.data;
};

const insertEntity = (entity: any) => {
  return api.makeAuthRequest({
    url: "/vai-tro",
    method: "POST",
    data: entity,
  });
};

const removeEntity = (id: string) => {
  return api.makeAuthRequest({
    url: `/vai-tro/${id}`,
    method: "DELETE",
  });
};

const updateEntity = (id: string, entity: any = {}) => {
  return api.makeAuthRequest({
    url: `/vai-tro/${id}`,
    method: "PUT",
    data: entity,
  });
};

export const getQuyenCuaVaiTro = async (
  id: string,
  pageIndex = 1,
  pageSize = 10,
  keyword = ""
) => {
  const ans = await api.makeAuthRequest({
    url: `/vai-tro/quyen/${id}?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "GET",
  });

  return ans?.data;
};

export const insertQuyen = (entity: any = {}) => {
  return api.makeAuthRequest({
    url: "/quyen",
    method: "POST",
    data: entity,
  });
};

export const removeQuyen = (id: string) => {
  return api.makeAuthRequest({
    url: `/quyen/${id}`,
    method: "DELETE",
  });
};

export const VaiTroService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
  getQuyenCuaVaiTro,
  insertQuyen,
  removeQuyen,
};
