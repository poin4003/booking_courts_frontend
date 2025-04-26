import axios from "axios";

const api = axios.create({
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("Response error:", error);
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.dispatchEvent(new CustomEvent("authError"));
    }
    return Promise.reject(error.response?.data || error);
  }
);

class AxiosClient {
  async post(url, data = {}, config = {}) {
    return api.post(url, data, config);
  }

  async get(url, params = {}) {
    return api.get(url, { params });
  }

  async delete(url, params = {}) {
    return api.delete(url, { params });
  }

  async patch(url, data = {}, config = {}) {
    return api.patch(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return api.put(url, data, config);
  }
}

export default new AxiosClient();
