import axios from "axios";
import { AppConfigs } from "../../const/config";
import { StoreService } from "../";

let apiUrlLogged = false;
let requestCount = 0;

// Create a function that creates and returns an API service
const createApiServices = (noCache = false) => {
  // Use AppConfigs.serverUrl instead of VITE_APP_API_URL environment variable
  const API_URL = AppConfigs.serverUrl;

  // Only log API URL once
  if (!apiUrlLogged) {
    console.log("Using API URL:", API_URL);
    apiUrlLogged = true;
  }

  // Create an axios instance for non-auth requests
  const instance = axios.create({
    baseURL: API_URL,
  });

  // Create a function to make regular requests (no authentication)
  const makeRequest = async ({
    url = "",
    method = "GET",
    data = {},
    options = {},
  }) => {
    try {
      requestCount++;
      // Only log important requests or errors
      if (url.includes('register') || url.includes('login') || requestCount % 10 === 1) {
        console.log(`Making ${method} request to ${API_URL}${url}`);
      }
      
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
    } catch (error: any) {
      // Handle 401 Unauthorized specifically for survey requests
      if (error?.response?.status === 401 && url.includes('khao-sat')) {
        console.log(`Unauthorized access to ${url} - user needs to login`);
        return {
          status: "Unauthorized",
          message: "User needs authentication",
          error: error
        };
      }
      
      // For other errors, log and return error response
      console.error(`API Error (${method} ${url}):`, error);
      return {
        status: "Error",
        message: error?.response?.data?.message || error.message || "API request failed",
        error: error
      };
    }
  };

  // Create a function to make authenticated requests
  const makeAuthRequest = async ({
    url = "",
    method = "GET",
    data = {},
    options = {},
  }) => {
    try {
      const token = localStorage.getItem('token'); // Direct access to avoid circular dependency
      
      // Only log token status for auth-related requests
      if (url.includes('register') || url.includes('login')) {
        console.log(`Using token for auth request (${method} ${url}):`, token ? "Token found" : "No token");
      }
      
      const authOptions = {
        ...options,
        headers: {
          ...(options as any).headers,
          Authorization: `Bearer ${token}`,
        },
      };
      return await makeRequest({ url, method, data, options: authOptions });
    } catch (error) {
      // Don't throw the error - just return it as part of the response
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
