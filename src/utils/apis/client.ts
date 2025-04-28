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

export const ClientService = {
  getListProducts,
  getListCombos,
  createPayment,
};
