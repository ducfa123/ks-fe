import createApiServices from "./make-api-request";

const api = createApiServices();

interface CartItem {
  productId: string;
  quantity: number;
  isCombo: boolean;
}

const getListProducts = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  const ans = await api.makeRequest({
    url: `/products?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "GET",
  });

  return ans?.data;
};

const getListCombos = async (pageIndex = 1, pageSize = 10, keyword = "") => {
  const ans = await api.makeRequest({
    url: `/products/combos?pageSize=${pageSize}&pageIndex=${pageIndex}&keyword=${keyword}`,
    method: "GET",
  });

  return ans?.data;
};

const createPayment = async (cartItems: CartItem[], ma_giam_gia?: string) => {
  return api.makeAuthRequest({
    url: "/products/payment",
    method: "POST",
    data: {
      items: cartItems,
      ma_giam_gia,
    },
  });
};

const getOrderHistory = async (pageIndex = 1, pageSize = 10) => {
  const ans = await api.makeAuthRequest({
    url: `/don-hang/lich-su?pageSize=${pageSize}&pageIndex=${pageIndex}`,
    method: "GET",
  });

  return ans?.data;
};

export const ClientService = {
  getListProducts,
  getListCombos,
  createPayment,
  getOrderHistory,
};
