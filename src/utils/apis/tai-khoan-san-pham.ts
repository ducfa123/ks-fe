import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  const ans = await api.makeAuthRequest({
    url: `/tai-khoan-san-pham?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "GET",
  });

  return ans?.data;
};

const getDetailEntity = async (id: string) => {
  const ans = await api.makeAuthRequest({
    url: `/tai-khoan-san-pham/${id}`,
    method: "GET",
  });

  return ans?.data;
};

const insertEntity = async (entity: any) => {
  return api.makeAuthRequest({
    url: "/tai-khoan-san-pham",
    method: "POST",
    data: entity,
  });
};

const updateEntity = async (id: string, entity: any) => {
  return api.makeAuthRequest({
    url: `/tai-khoan-san-pham/${id}`,
    method: "PUT",
    data: entity,
  });
};

const removeEntity = async (id: string) => {
  return api.makeAuthRequest({
    url: `/tai-khoan-san-pham/${id}`,
    method: "DELETE",
  });
};

export const TaiKhoanSanPhamService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
};
