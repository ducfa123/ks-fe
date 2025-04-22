import createApiServices from "./make-api-request";

const api = createApiServices();

const getListEntity = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  const ans = await api.makeAuthRequest({
    url: `/nguoi-dung?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "GET",
  });

  return ans?.data;
};

const getDetailEntity = async (id: string) => {
  const ans = await api.makeAuthRequest({
    url: `/nguoi-dung/${id}`,
    method: "GET",
  });

  return ans?.data;
};

const insertEntity = (entity: any) => {
  return api.makeAuthRequest({
    url: "/nguoi-dung",
    method: "POST",
    data: entity,
  });
};

const removeEntity = (id: string) => {
  return api.makeAuthRequest({
    url: `/nguoi-dung/${id}`,
    method: "DELETE",
  });
};

const updateEntity = (id: string, entity: any = {}) => {
  return api.makeAuthRequest({
    url: `/nguoi-dung/${id}`,
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
    url: `/nguoi-dung/tim-theo-vai-tro?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "POST",
    data: {
      vai_tro_names: vaiTros,
    },
  });

  return ans?.data;
};

export const NguoiDungService = {
  getListEntity,
  getDetailEntity,
  insertEntity,
  updateEntity,
  removeEntity,
  getListEntityByVaiTros,
};
