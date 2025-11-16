// Базовый API клиент для работы с бэкендом

const API_BASE_URL = "http://127.0.0.1:8081/api/v1";

interface ApiError {
  error: string;
  details?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return localStorage.getItem("token");
  }

  private setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  private removeToken(): void {
    localStorage.removeItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Обработка пустого ответа (например, для DELETE запросов)
      if (response.status === 204) {
        return {} as T;
      }

      // Пытаемся получить текст ответа
      const text = await response.text();
      
      // Если ответ пустой, возвращаем пустой объект
      if (!text) {
        if (response.ok) {
          return {} as T;
        }
        // Если ответ не OK и пустой, выбрасываем ошибку
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Парсим JSON
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        // Если не JSON и ответ не OK, выбрасываем ошибку
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Если ответ OK, но не JSON, возвращаем пустой объект
        return {} as T;
      }

      // Обработка 401 Unauthorized - очищаем токен и перенаправляем на страницу входа
      if (response.status === 401) {
        this.clearAuthToken();
        localStorage.removeItem("currentUser");
        // Вызываем событие для уведомления приложения об ошибке авторизации
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        const error: ApiError = data as ApiError;
        throw new Error(error.error || "Unauthorized");
      }

      // Проверяем статус ответа
      if (!response.ok) {
        const error: ApiError = data as ApiError;
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error");
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Методы для работы с токенами
  setAuthToken(token: string): void {
    this.setToken(token);
  }

  clearAuthToken(): void {
    this.removeToken();
  }

  hasToken(): boolean {
    return this.getToken() !== null;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

