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

  /**
   * Télécharge un fichier d'information importante
   * @param fileId - ID du fichier
   * @returns URL blob du fichier et nom du fichier
   */
  async downloadFile(fileId: number): Promise<{ success: true; url: string; filename?: string }> {
    try {
      const response = await apiClient.fetchRaw(`/api/rh/files/${fileId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du fichier');
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Extraire le nom du fichier depuis le header Content-Disposition
      const contentDisposition = response.headers.get('content-disposition');
      let filename: string | undefined;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[*]?=['"]?([^'"\s;]+)['"]?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      return { success: true, url: blobUrl, filename };
    } catch (error: any) {
      console.error('Erreur téléchargement fichier:', error);
      throw new Error(error.message || 'Impossible de télécharger le fichier');
    }
  },
};
