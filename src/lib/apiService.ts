import api from './axios';
import { getCookie } from './csrf';

type Config = Record<string, any>;

class ApiService {
  private static getHeaders(isMultipart?: boolean) {
    const headers: Record<string, string> = {
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
    };

    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    return headers;
  }

  private static getConfig(config: Config = {}) {
    return {
      withCredentials: true, // force cookies to be sent
      ...config,
    };
  }

  static async get<T = any>(url: string, config: Config = {}) {
    const response = await api.get<T>(url, this.getConfig(config));
    return response.data;
  }

  static async post<T = any>(url: string, data: any, isMultipart = false, config: Config = {}) {
    const response = await api.post<T>(
      url,
      data,
      this.getConfig({
        headers: this.getHeaders(isMultipart),
        ...config,
      })
    );
    return response.data;
  }

  static async put<T = any>(url: string, data: any, isMultipart = false, config: Config = {}) {
    const response = await api.put<T>(
      url,
      data,
      this.getConfig({
        headers: this.getHeaders(isMultipart),
        ...config,
      })
    );
    return response.data;
  }

  static async patch<T = any>(url: string, data: any, isMultipart = false, config: Config = {}) {
    const response = await api.patch<T>(
      url,
      data,
      this.getConfig({
        headers: this.getHeaders(isMultipart),
        ...config,
      })
    );
    return response.data;
  }

  static async delete<T = any>(url: string, config: Config = {}) {
    const response = await api.delete<T>(
      url,
      this.getConfig({
        headers: this.getHeaders(),
        ...config,
      })
    );
    return response.data;
  }
}

export default ApiService;
