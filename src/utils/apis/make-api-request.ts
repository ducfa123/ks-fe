import axios from "axios";
import { AppConfigs } from "../../const/config";
import { StoreService } from "../";

// Create a function that creates and returns an API service
const createApiServices = (noCache = false) => {
  // Use AppConfigs.serverUrl instead of VITE_APP_API_URL environment variable
  const API_URL = AppConfigs.serverUrl;

  console.log("Using API URL:", API_URL); // For debugging

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
      // Don't throw the error - just return it as part of the response
      console.error(`API Error (${method} ${url}):`, error);
      return {
        status: "Error",
        message: error.message || "API request failed",
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
      
      // Log the token for debugging (remove in production)
      console.log(`Using token for auth request (${method} ${url}):`, token ? "Token found" : "No token");
      
      const authOptions = {
        ...options,
        headers: {
          ...options.headers,
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
