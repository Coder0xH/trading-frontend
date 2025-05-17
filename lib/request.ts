/**
 * axios封装
 * @author Huang
 * @date 2025-02-06
 */
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * 请求响应接口
 * @property {number} code - 响应码
 * @property {T} data - 响应数据
 * @property {string} message - 响应消息
 */
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

/**
 * 分页响应接口
 * @property {string} total - 总记录数
 * @property {string} size - 每页记录数
 * @property {string} current - 当前页码
 * @property {string} pages - 总页数
 */
export interface Pagination {
  total: string;
  size: string;
  current: string;
  pages: string;
}

/**
 * 公共分页参数接口
 * @property {number} pageNum - 页码
 * @property {number} pageSize - 每页记录数
 * @property {string} sortField - 排序字段
 * @property {boolean} sortMode - 排序方式 true: 升序 false: 降序
 */
export interface PaginationParams {
  pageNum: number;
  pageSize: number;
  sortField: string;
  sortMode: boolean;
}

/**
 * 列表响应接口
 * @property {T[]} records - 列表数据
 * @property {Pagination} pagination - 分页信息
 */
export interface ApiListResponse<T> {
  records: T[];
  pagination: Pagination;
}

/**
 * 创建axios实例
 * @property {string} baseURL - 基础URL
 * @property {number} timeout - 超时时间
 * @property {object} headers - 请求头
 */

const getBaseUrl = () => {
  // 如果在服务器端运行
  if (typeof window === "undefined") {
    // 在服务器端使用完整的 URL
    return "https://13.250.110.158:8000";
  }
  // 在客户端使用相对路径，让 rewrites 生效
  return "/api";
};

const instance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
// 响应拦截器
instance.interceptors.response.use(
  // 如果响应状态码为 2xx, 则返回数据
  (response) => {
    return response.data;
  },
  // 如果响应状态码不为 2xx, 则返回错误
  (error) => {
    console.log({ error });
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      return Promise.reject(new Error("请求超时"));
    }
    // 处理响应错误
    if (error.response) {
      const errorMessage = (() => {
        switch (error.response.status) {
          case 401:
            return "not logged in";
          case 403:
            return "not authorized";
          case 404:
            return "request not found";
          case 500:
            return "server error";
          case 501:
            return "invalid request";
          default:
            return `unknown error: ${error.message}`;
        }
      })();
      console.error(errorMessage);
      // 返回响应错误
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      const errorMessage = "网络错误，请检查您的网络连接";
      console.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    } else {
      const errorMessage = `请求配置错误: ${error.message}`;
      console.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
  }
);

/**
 * 请求方法
 * @property {string} url - 请求URL
 * @property {object} config - 请求配置
 * @returns {Promise<ApiResponse<T>>}
 */
export const request = {
  // GET请求
  get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return instance.get(url, config);
  },

  // POST请求
  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return instance.post(url, data, config);
  },

  // PUT请求
  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return instance.put(url, data, config);
  },

  // DELETE请求
  delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return instance.delete(url, config);
  },
};
