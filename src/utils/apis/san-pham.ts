import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  const ans = await api.makeAuthRequest({
    url: `/san-pham?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "GET",
  });

  return ans?.data;
};

const getDetailEntity = async (id: string) => {
  const ans = await api.makeAuthRequest({
    url: `/san-pham/${id}`,
    method: "GET",
  });

  return ans?.data;
};

const insertEntity = async (entity: any) => {
  const formData = new FormData();

  const { files = [], ...rest } = entity;

  Object.entries(rest).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}[]`, v));
    } else {
      formData.append(key, value as any);
    }
  });

  files.forEach((file: any) => {
    if (file?.file) formData.append("files", file?.file);
  });

  return api.makeAuthRequest({
    url: "/san-pham",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateEntity = async (id: string, entity: any) => {
  const formData = new FormData();

  const { files = [], ...rest } = entity;

  console.log({ files });

  Object.entries(rest).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}[]`, v));
    } else {
      formData.append(key, value as any);
    }
  });

  files.forEach((file: any) => {
    if (file?.file) formData.append("files", file?.file);
  });

  return api.makeAuthRequest({
    url: `/san-pham/${id}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const removeEntity = async (id: string) => {
  return api.makeAuthRequest({
    url: `/san-pham/${id}`,
    method: "DELETE",
  });
};

export const SanPhamService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
};
