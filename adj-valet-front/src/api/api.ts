import { ADJ } from "../types/ADJ";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export interface BackendConfig {
  backend_port: number;
  backend_url: string;
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string | null = null;
  private readonly DISCOVERY_PORTS = [8001, 8000, 8002, 8003, 8004];
  private readonly REQUEST_TIMEOUT = 5000;

  private async discoverBackend(): Promise<string> {
    for (const port of this.DISCOVERY_PORTS) {
      try {
        const url = `http://localhost:${port}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(`${url}/health`, { 
          signal: controller.signal,
          method: 'GET'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`Backend discovered at: ${url}`);
          return url;
        }
      } catch {
        continue;
      }
    }

    console.warn('Backend auto-discovery failed, using default port 8000');
    return 'http://localhost:8000';
  }

  private async getBaseUrl(): Promise<string> {
    if (!this.baseUrl) {
      this.baseUrl = await this.discoverBackend();
    }
    return this.baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new ApiError(
          `HTTP ${response.status}: ${errorText}`,
          response.status,
          response
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as unknown as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  async setADJPath(adjPath: string): Promise<string> {
    if (!adjPath?.trim()) {
      throw new ApiError('ADJ path cannot be empty', 400);
    }

    return this.makeRequest<string>('/path', {
      method: 'POST',
      body: JSON.stringify({ path: adjPath.trim() }),
    });
  }

  async getConfig(): Promise<ADJ> {
    return this.makeRequest<ADJ>('/assemble');
  }

  async updateConfig(config: ADJ): Promise<ADJ> {
    return this.makeRequest<ADJ>('/update', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest<string>('/health');
      return true;
    } catch {
      return false;
    }
  }

  resetConnection(): void {
    this.baseUrl = null;
  }
}

export const apiClient = new ApiClient();

export const { setADJPath, getConfig, updateConfig, healthCheck } = apiClient;

export const sendADJPath = apiClient.setADJPath.bind(apiClient);
export const assembleJSON = apiClient.getConfig.bind(apiClient);
export const sendADJ = apiClient.updateConfig.bind(apiClient);
export const resetApiCache = apiClient.resetConnection.bind(apiClient);