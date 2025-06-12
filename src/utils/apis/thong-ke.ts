import createApiServices from "./make-api-request";

const api = createApiServices();

const getThongKeTheoDonVi = async (maKhaoSat: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: "/thong-ke/don-vi",
      method: "GET",
      options: {
        params: {
          ma_khao_sat: maKhaoSat
        }
      }
    });
    
    return response;
  } catch (error) {
    console.error("Error in getThongKeTheoDonVi:", error);
    throw error;
  }
};

const getThongKeTongQuan = async (maKhaoSat: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: "/thong-ke/tong-quan",
      method: "GET",
      options: {
        params: {
          ma_khao_sat: maKhaoSat
        }
      }
    });
    
    return response;
  } catch (error) {
    console.error("Error in getThongKeTongQuan:", error);
    throw error;
  }
};

const getThongKeTheoVungMien = async (maKhaoSat: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: "/thong-ke/vung-mien",
      method: "GET",
      options: {
        params: {
          ma_khao_sat: maKhaoSat
        }
      }
    });
    
    return response;
  } catch (error) {
    console.error("Error in getThongKeTheoVungMien:", error);
    throw error;
  }
};

const getThongKeTheoCauHoi = async (maKhaoSat: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: "/thong-ke/cau-hoi",
      method: "GET",
      options: {
        params: {
          ma_khao_sat: maKhaoSat
        }
      }
    });
    
    return response;
  } catch (error) {
    console.error("Error in getThongKeTheoCauHoi:", error);
    throw error;
  }
};

const getThongKeThoiGian = async (maKhaoSat: string, tuNgay?: string, denNgay?: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: "/thong-ke/thoi-gian",
      method: "GET",
      options: {
        params: {
          ma_khao_sat: maKhaoSat
        }
      }
    });
    
    return response;
  } catch (error) {
    console.error("Error in getThongKeThoiGian:", error);
    throw error;
  }
};

const getThongKeTheoGioiTinh = async (maKhaoSat: string) => {
  try {
    const response = await api.makeAuthRequest({
      url: "/thong-ke/gioi-tinh",
      method: "GET",
      options: {
        params: {
          ma_khao_sat: maKhaoSat
        }
      }
    });
    
    return response;
  } catch (error) {
    console.error("Error in getThongKeTheoGioiTinh:", error);
    throw error;
  }
};

export const ThongKeService = {
  getThongKeTheoDonVi,
  getThongKeTongQuan,
  getThongKeTheoVungMien,
  getThongKeTheoCauHoi,
  getThongKeThoiGian,
  getThongKeTheoGioiTinh
};
