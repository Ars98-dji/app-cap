// src/services/api.ts
/**
 * Configuration de base pour les appels API avec gestion d'erreurs explicites
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

/**
 * Messages d'erreur explicites pour l'utilisateur
 */
const getErrorMessage = (statusCode: number, defaultMessage?: string): string => {
  switch (statusCode) {
    case 400:
      return 'Les données envoyées sont invalides. Veuillez vérifier les informations saisies.';
    case 401:
      return 'Vous devez être connecté pour effectuer cette action.';
    case 403:
      return 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.';
    case 404:
      return 'La ressource demandée est introuvable. Veuillez vérifier l\'URL ou contacter le support.';
    case 408:
      return 'La requête a pris trop de temps. Veuillez vérifier votre connexion internet et réessayer.';
    case 422:
      return 'Les données du formulaire sont invalides. Veuillez corriger les erreurs signalées.';
    case 429:
      return 'Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.';
    case 500:
      return 'Une erreur s\'est produite sur le serveur. Nos équipes techniques ont été informées. Veuillez réessayer plus tard.';
    case 502:
      return 'Le serveur est temporairement indisponible. Veuillez réessayer dans quelques instants.';
    case 503:
      return 'Le service est en maintenance. Veuillez réessayer dans quelques minutes.';
    case 504:
      return 'Le serveur met trop de temps à répondre. Veuillez vérifier votre connexion et réessayer.';
    default:
      return defaultMessage || `Une erreur inattendue s'est produite (Code: ${statusCode}). Veuillez contacter le support si le problème persiste.`;
  }
};

/**
 * Wrapper pour les appels fetch avec gestion d'erreurs explicites
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Gère les erreurs de manière explicite
   */
  private async handleError(response: Response, endpoint: string): Promise<never> {
    let errorMessage: string;
    let errorDetails: any = null;

    try {
      const errorData = await response.json();
      errorDetails = errorData;
      
      // Utiliser le message du serveur s'il existe, sinon utiliser le message par défaut
      errorMessage = errorData.message || errorData.error || getErrorMessage(response.status);
      
      // Ajouter les détails de validation si disponibles
      if (errorData.errors) {
        const validationErrors = Object.entries(errorData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('\n');
        errorMessage += `\n\nDétails:\n${validationErrors}`;
      }
    } catch {
      // Si la réponse n'est pas du JSON, utiliser le message par défaut
      errorMessage = getErrorMessage(response.status);
    }

    console.error(`❌ Erreur API [${endpoint}]:`, {
      status: response.status,
      statusText: response.statusText,
      message: errorMessage,
      details: errorDetails
    });

    const error: ApiError = {
      message: errorMessage,
      statusCode: response.status,
      details: errorDetails
    };

    throw error;
  }

  /**
   * Gère les erreurs réseau
   */
  private handleNetworkError(error: any, endpoint: string): never {
    console.error(`❌ Erreur réseau [${endpoint}]:`, error);
    
    const networkError: ApiError = {
      message: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.',
      statusCode: 0,
      details: error
    };

    throw networkError;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        await this.handleError(response, endpoint);
      }

      return await response.json();
    } catch (error: any) {
      if (error.statusCode !== undefined) {
        throw error; // C'est déjà une ApiError
      }
      this.handleNetworkError(error, endpoint);
    }
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        await this.handleError(response, endpoint);
      }

      return await response.json();
    } catch (error: any) {
      if (error.statusCode !== undefined) {
        throw error;
      }
      this.handleNetworkError(error, endpoint);
    }
  }

  /**
   * POST avec FormData (pour upload de fichiers)
   */
  async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        await this.handleError(response, endpoint);
      }

      return await response.json();
    } catch (error: any) {
      if (error.statusCode !== undefined) {
        throw error;
      }
      this.handleNetworkError(error, endpoint);
    }
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        await this.handleError(response, endpoint);
      }

      return await response.json();
    } catch (error: any) {
      if (error.statusCode !== undefined) {
        throw error;
      }
      this.handleNetworkError(error, endpoint);
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        await this.handleError(response, endpoint);
      }

      return await response.json();
    } catch (error: any) {
      if (error.statusCode !== undefined) {
        throw error;
      }
      this.handleNetworkError(error, endpoint);
    }
  }

  /**
   * Fetch wrapper qui retourne directement la Response pour gestion manuelle
   */
  async fetchRaw(endpoint: string, options?: RequestInit): Promise<Response> {
    try {
      return await fetch(`${this.baseUrl}${endpoint}`, options);
    } catch (error: any) {
      this.handleNetworkError(error, endpoint);
    }
  }

  /**
   * Obtenir l'URL complète pour un endpoint
   */
  getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}

// Instance singleton
export const apiClient = new ApiClient(API_BASE_URL);
export { API_BASE_URL };
export type { ApiError };
