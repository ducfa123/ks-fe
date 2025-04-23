import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  const ans = await api.makeAuthRequest({
    url: `/danh-muc-san-pham?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "GET",
  });

  return ans?.data;
};

const getDetailEntity = async (id: string) => {
  const ans = await api.makeAuthRequest({
    url: `/danh-muc-san-pham/${id}`,
    method: "GET",
  });

  return ans?.data;
};

const insertEntity = async (entity: any) => {
  return api.makeAuthRequest({
    url: "/danh-muc-san-pham",
    method: "POST",
    data: entity,
  });
};

const updateEntity = async (id: string, entity: any) => {
  return api.makeAuthRequest({
    url: `/danh-muc-san-pham/${id}`,
    method: "PUT",
    data: entity,
  });
};

const removeEntity = async (id: string) => {
  return api.makeAuthRequest({
    url: `/danh-muc-san-pham/${id}`,
    method: "DELETE",
  });
};

export const DanhMucSanPhamService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
};
