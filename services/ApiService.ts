import { getApiUrl, getBearerToken } from '@/utils/apiCredentials';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiService {
  private static async getHeaders(): Promise<Record<string, string>> {
    const token = await getBearerToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private static async getBaseUrl(): Promise<string> {
    const apiUrl = await getApiUrl();
    if (!apiUrl) {
      throw new ApiError('URL API non configurée', 0);
    }
    return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  }

  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const status = response.status;

    try {
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `Erreur HTTP ${status}`,
          status,
          data
        );
      }

      return { data, status };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Si la réponse n'est pas du JSON valide, essayons de récupérer le texte
      try {
        const text = await response.text();
        throw new ApiError(
          `Réponse invalide: ${text}`,
          status
        );
      } catch {
        // Si même le texte échoue, message générique
        throw new ApiError(
          `Réponse invalide du serveur`,
          status
        );
      }
    }
  }

  /**
   * Effectue une requête GET
   */
  static async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const baseUrl = await this.getBaseUrl();
      const headers = await this.getHeaders();
      const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur de connexion', 0);
    }
  }

  /**
   * Effectue une requête POST
   */
  static async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const baseUrl = await this.getBaseUrl();
      const headers = await this.getHeaders();
      const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur de connexion', 0);
    }
  }

  /**
   * Effectue une requête PUT
   */
  static async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const baseUrl = await this.getBaseUrl();
      const headers = await this.getHeaders();
      const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur de connexion', 0);
    }
  }

  /**
   * Effectue une requête DELETE
   */
  static async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const baseUrl = await this.getBaseUrl();
      const headers = await this.getHeaders();
      const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Erreur de connexion', 0);
    }
  }
}
