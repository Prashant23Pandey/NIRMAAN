/**
 * NIRMAAN 2.0 Centralized API Service
 * Connects React frontend to PHP 8 + MySQL Backend
 */

export const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost/nirmaan/backend/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('nirmaan_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('nirmaan_auth_token', token);
    } else {
      localStorage.removeItem('nirmaan_auth_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('nirmaan_auth_token');
    }
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${API_BASE_URL}/${cleanEndpoint}`;

    const headers: Record<string, string> = {
      ...(this.getHeaders() as Record<string, string>),
      ...((options.headers as Record<string, string>) || {}),
    };

    if (typeof FormData !== 'undefined' && options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}: Request failed`);
      }

      return data;
    } catch (error: any) {
      console.warn(`[Nirmaan API Connection Notice] Endpoint: ${url} - ${error.message}`);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Health check helper
  async checkConnection(): Promise<boolean> {
    try {
      const res = await this.get<{ success: boolean }>('professions/list.php');
      return !!res.success;
    } catch {
      return false;
    }
  }

  // System Health API
  async getHealth(): Promise<{ status: string; php: boolean; mysql: boolean; database: string; message: string; tables_count?: number }> {
    try {
      return await this.get<{ status: string; php: boolean; mysql: boolean; database: string; message: string; tables_count?: number }>('health.php');
    } catch (e: any) {
      return {
        status: 'error',
        php: true,
        mysql: false,
        database: 'nirmaan_db',
        message: e?.message || 'Cannot connect to PHP backend. Verify WAMP Apache & MySQL are running.',
      };
    }
  }
}

export const api = new ApiService();
export default api;
