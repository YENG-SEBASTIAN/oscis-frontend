import api from './axios';

type Config = Record<string, any>;

class ApiService {
  private static getHeaders(isMultipart?: boolean) {
    return {
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
    };
  }

  static async get<T = any>(url: string, config: Config = {}) {
    const response = await api.get<T>(url, config);
    return response.data;
  }

  static async post<T = any>(url: string, data: any, isMultipart = false, config: Config = {}) {
    const response = await api.post<T>(url, data, {
      headers: this.getHeaders(isMultipart),
      ...config,
    });
    return response.data;
  }

  static async put<T = any>(url: string, data: any, isMultipart = false, config: Config = {}) {
    const response = await api.put<T>(url, data, {
      headers: this.getHeaders(isMultipart),
      ...config,
    });
    return response.data;
  }

  static async patch<T = any>(url: string, data: any, isMultipart = false, config: Config = {}) {
    const response = await api.patch<T>(url, data, {
      headers: this.getHeaders(isMultipart),
      ...config,
    });
    return response.data;
  }

  static async delete<T = any>(url: string, config: Config = {}) {
    const response = await api.delete<T>(url, config);
    return response.data;
  }
}

export default ApiService;
