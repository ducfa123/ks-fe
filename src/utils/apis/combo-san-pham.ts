import { normalizeBooleans } from "../common";
import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  const ans = await api.makeAuthRequest({
    url: `/combo-san-pham?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "GET",
  });

  return ans?.data;
};

const getDetailEntity = async (id: string) => {
  const ans = await api.makeAuthRequest({
    url: `/combo-san-pham/${id}`,
    method: "GET",
  });

  return ans?.data;
};

const insertEntity = async (entity: any) => {
  const normalized = normalizeBooleans(entity);
  return api.makeAuthRequest({
    url: "/combo-san-pham",
    method: "POST",
    data: normalized,
  });
};

const updateEntity = async (id: string, entity: any) => {
  const normalized = normalizeBooleans(entity);
  return api.makeAuthRequest({
    url: `/combo-san-pham/${id}`,
    method: "PUT",
    data: normalized,
  });
};

const removeEntity = async (id: string) => {
  return api.makeAuthRequest({
    url: `/combo-san-pham/${id}`,
    method: "DELETE",
  });
};

export const ComboSanPhamService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
};
