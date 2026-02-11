// src/services/enrollmentService.ts
/**
 * Service pour la gestion des dossiers d'inscription/candidature
 */

import { apiClient } from './api';

export type CandidatureType = 
  | 'licence'
  | 'master'
  | 'ingenieur_prepa'
  | 'ingenieur_specialite'
  | 'complement'
  | 'suivi'
  | 'matricule'
  | 'paiement'
  | 'suivi-paiement';

export interface SubmissionResponse {
  success?: boolean;
  tracking_code?: string;
  trackingCode?: string;
  message?: string;
  data?: {
    tracking_code?: string;
    dossier?: any;
    [key: string]: any;
  };
  dossier?: any;
  error?: string;
}

export const enrollmentService = {
  /**
   * Soumettre une candidature Licence
   * @throws {Error} Si la soumission échoue avec un message explicite
   */
  async submitLicence(formData: FormData): Promise<SubmissionResponse> {
    console.log('=== FormData Content (Licence) ===');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    try {
      const response = await apiClient.fetchRaw('/api/inscription/dossiers/licence', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Préserver la structure complète de l'erreur pour un meilleur affichage
        const error: any = new Error(
          data.message || 
          'Impossible de soumettre votre dossier de candidature en Licence.'
        );
        error.errors = data.errors; // Erreurs de validation par champ
        error.error_code = data.error_code;
        error.apiResponse = data;
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Erreur soumission Licence:', error);
      // Propager l'erreur avec sa structure complète
      if (error.errors || error.apiResponse) {
        throw error;
      }
      throw new Error(error.message || 'Une erreur est survenue lors de la soumission de votre candidature en Licence. Veuillez réessayer.');
    }
  },

  /**
   * Soumettre une candidature Master
   * @throws {Error} Si la soumission échoue avec un message explicite
   */
  async submitMaster(formData: FormData): Promise<SubmissionResponse> {
    console.log('=== FormData Content (Master) ===');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    try {
      const response = await apiClient.fetchRaw('/api/inscription/dossiers/master', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        const error: any = new Error(
          data.message || 
          'Impossible de soumettre votre dossier de candidature en Master.'
        );
        error.errors = data.errors;
        error.error_code = data.error_code;
        error.apiResponse = data;
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Erreur soumission Master:', error);
      if (error.errors || error.apiResponse) {
        throw error;
      }
      throw new Error(error.message || 'Une erreur est survenue lors de la soumission de votre candidature en Master. Veuillez réessayer.');
    }
  },

  /**
   * Soumettre une candidature Ingénieur (voie Prépa)
   * @throws {Error} Si la soumission échoue avec un message explicite
   */
  async submitIngenieurPrepa(formData: FormData): Promise<SubmissionResponse> {
    console.log('=== FormData Content (Ingénieur Prépa) ===');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    try {
      const response = await apiClient.fetchRaw('/api/inscription/dossiers/ingenieur/prepa', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        const error: any = new Error(
          data.message || 
          'Impossible de soumettre votre dossier de candidature en Ingénierie (voie Prépa).'
        );
        error.errors = data.errors;
        error.error_code = data.error_code;
        error.apiResponse = data;
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Erreur soumission Ingénieur Prépa:', error);
      if (error.errors || error.apiResponse) {
        throw error;
      }
      throw new Error(error.message || 'Une erreur est survenue lors de la soumission de votre candidature en Ingénierie (voie Prépa). Veuillez réessayer.');
    }
  },

  /**
   * Soumettre une candidature Ingénieur (voie Spécialité)
   * @throws {Error} Si la soumission échoue avec un message explicite
   */
  async submitIngenieurSpecialite(formData: FormData): Promise<SubmissionResponse> {
    console.log('=== FormData Content (Ingénieur Spécialité) ===');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    try {
      const response = await apiClient.fetchRaw('/api/inscription/dossiers/ingenieur/specialite', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        const error: any = new Error(
          data.message || 
          'Impossible de soumettre votre dossier de candidature en Ingénierie (voie Spécialité).'
        );
        error.errors = data.errors;
        error.error_code = data.error_code;
        error.apiResponse = data;
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('Erreur soumission Ingénieur Spécialité:', error);
      if (error.errors || error.apiResponse) {
        throw error;
      }
      throw new Error(error.message || 'Une erreur est survenue lors de la soumission de votre candidature en Ingénierie (voie Spécialité). Veuillez réessayer.');
    }
  },

  /**
   * Récupérer un dossier par son code de suivi
   * @throws {Error} Si le code est invalide ou si la récupération échoue
   */
  async getDossier(trackingCode: string): Promise<SubmissionResponse> {
    try {
      const response = await apiClient.fetchRaw(`/api/inscription/dossiers/${trackingCode}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(
          data.error || 
          data.message || 
          `Le code de suivi "${trackingCode}" est invalide ou le dossier est introuvable. Veuillez vérifier le code et réessayer.`
        );
      }

      return data;
    } catch (error: any) {
      console.error('Erreur récupération dossier:', error);
      throw new Error(error.message || 'Impossible de récupérer votre dossier. Veuillez vérifier votre code de suivi.');
    }
  },

  /**
   * Soumettre des documents complémentaires
   * @throws {Error} Si l'envoi échoue
   */
  async submitComplement(trackingCode: string, documents: FormData): Promise<SubmissionResponse> {
    try {
      const response = await apiClient.fetchRaw(`/api/inscription/dossiers/complement/${trackingCode}`, {
        method: 'POST',
        body: documents,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(
          data.error || 
          data.message || 
          'Impossible d\'envoyer les documents complémentaires. Veuillez vérifier que les fichiers sont au bon format et réessayer.'
        );
      }

      return data;
    } catch (error: any) {
      console.error('Erreur envoi complément:', error);
      throw new Error(error.message || 'Une erreur est survenue lors de l\'envoi des documents complémentaires. Veuillez réessayer.');
    }
  },

  /**
   * Récupérer les périodes de soumission
   * @throws {Error} Si la récupération échoue
   */
  async getSubmissionPeriods(cycle?: string) {
    try {
      const url = cycle 
        ? `/api/inscription/dossiers/periods?cycle=${cycle}` 
        : `/api/inscription/dossiers/periods`;
      
      const response = await apiClient.fetchRaw(url);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(
          data.error || 
          data.message || 
          'Impossible de récupérer les périodes de soumission. Veuillez réessayer plus tard.'
        );
      }

      return data;
    } catch (error: any) {
      console.error('Erreur récupération périodes:', error);
      throw new Error(error.message || 'Impossible de charger les périodes de soumission. Veuillez réessayer.');
    }
  },

  /**
   * Soumettre un dossier selon le type
   * @throws {Error} Si le type est invalide ou si la soumission échoue
   */
  async submit(type: CandidatureType, formData: FormData): Promise<SubmissionResponse> {
    switch (type) {
      case 'licence':
        return enrollmentService.submitLicence(formData);
      case 'master':
        return enrollmentService.submitMaster(formData);
      case 'ingenieur_prepa':
        return enrollmentService.submitIngenieurPrepa(formData);
      case 'ingenieur_specialite':
        return enrollmentService.submitIngenieurSpecialite(formData);
      default:
        throw new Error(`Type de candidature invalide: "${type}". Les types acceptés sont: licence, master, ingenieur_prepa, ingenieur_specialite.`);
    }
  }
};
