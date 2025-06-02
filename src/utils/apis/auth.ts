import createApiServices from "./make-api-request";

const api = createApiServices();

const login = (username = "", password = "") => {
  const body = {
    ten_dang_nhap: username,
    mat_khau: password,
  };
  return api.makeRequest({
    url: "/auth/login",
    method: "POST",
    data: body,
  });
};

const getPermission = () => {
  return api.makeAuthRequest({
    url: "/auth/profile",
    method: "GET",
    data: {},
  });
};

// const checkToken = () => {
//   return api.makeAuthRequest({
//     url: "authentication/check-token",
//     method: "GET",
//     data: {},
//   });
// };

const checkToken = () => {
  return new Promise((resolve) => {
    const fakeResponse = {
      data: {
        token: "fakeAccessToken",
        user: {
          _id: "fakeUserId",
          ho_ten: "Người dùng thử",
          tai_khoan: "testuser",
          vai_tro: "admin",
          phong_ban: "IT",
          so_du: 1000,
        },
      },
    };

    setTimeout(() => {
      resolve(fakeResponse);
    }, 10);
  });
};

const changeMyPassword = (old_password = "", new_password = "") => {
  return api.makeAuthRequest({
    url: "/authentication/change-my-password",
    method: "PUT",
    data: {
      password: old_password,
      new_password,
    },
  });
};

const updateUserInfo = async (user: any = {}) => {
  let form_data = new FormData();
  for (let key in user) {
    form_data.append(key, user[key]);
  }

  const data = await api.makeAuthRequest({
    url: `authentication/update-info`,
    method: "PUT",
    data: form_data,
  });

  return data?.data;
};

export const Auth = {
  login,
  getPermission,
  checkToken,
  changeMyPassword,
  updateUserInfo,
};
