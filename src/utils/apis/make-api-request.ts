import axios from "axios";
import { AppConfigs } from "../../const/config";
import { StoreService } from "../";

const createApiServices = (noCache = false) => {
  const API_URL = AppConfigs.serverUrl;


  const instance = axios.create({
    baseURL: API_URL,
  });

  const makeRequest = async ({
    url = "",
    method = "GET",
    data = {},
    options = {},
  }) => {
    try {
      console.log(`Making ${method} request to ${API_URL}${url}`); // For debugging
      let req = null;
      if (method === "GET") {
        req = await instance.get(url, options);
      } else if (method === "POST") {
        req = await instance.post(url, data, options);
      } else if (method === "PUT") {
        req = await instance.put(url, data, options);
      } else if (method === "DELETE") {
        req = await instance.delete(url, options);
      } else {
        throw new Error(`Invalid method: ${method}`);
      }
      return req?.data;
    } catch (error) {
      console.error(`API Error (${method} ${url}):`, error);
      return {
        status: "Error",
        message: error.message || "API request failed",
        error: error
      };
    }
  };

  const makeAuthRequest = async ({
    url = "",
    method = "GET",
    data = {},
    options = {},
  }) => {
    try {
      const token = localStorage.getItem('token');      
      if (!token) {
        console.error('No authentication token found for authenticated request');
        throw new Error('Authentication token required');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      };

      const authOptions = {
        ...options,
        headers,
      };
      return await makeRequest({ url, method, data, options: authOptions });
    } catch (error) {
      console.error(`Auth API Error (${method} ${url}):`, error);
      return {
        status: "Error",
        message: error.message || "API request failed",
        error: error
      };
    }
  };

  return {
    makeRequest,
    makeAuthRequest,
  };
};

export default createApiServices;
