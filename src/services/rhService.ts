// src/services/rhService.ts
/**
 * Service pour les ressources humaines et informations importantes
 */

import { apiClient } from './api';

export interface ImportantInformation {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  link?: string;
  file?: {
    id: number;
    name: string;
    url: string;
  };
}

export const rhService = {
  /**
   * Récupère les informations importantes
   * @throws {Error} Si la récupération échoue
   */
  async getImportantInformations(): Promise<ImportantInformation[]> {
    try {
      const response = await apiClient.get<ImportantInformation[]>('/api/rh/important-informations');
      return response.data;
    } catch (error: any) {
      console.error('Erreur récupération informations importantes:', error);
      throw new Error(error.message || 'Impossible de charger les informations importantes. Veuillez réessayer plus tard.');
    }
  },
};
