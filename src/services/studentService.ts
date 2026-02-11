// src/services/studentService.ts
/**
 * Service pour la gestion des étudiants et matricules
 */

import { apiClient } from './api';

export interface LookupMatriculeRequest {
  last_name: string;
  first_names: string;
  birth_date: string;
  birth_place: string;
}

export interface AssignMatriculeRequest extends LookupMatriculeRequest {
  phone: string;
}

export interface MatriculeResponse {
  student_id_number: string;
  message?: string;
}

export const studentService = {
  /**
   * Rechercher/consulter le matricule d'un étudiant
   * @throws {ApiError} Si l'étudiant n'est pas trouvé ou si la recherche échoue
   */
  async lookupMatricule(data: LookupMatriculeRequest): Promise<MatriculeResponse> {
    try {
      const response = await apiClient.fetchRaw('/api/inscription/students/lookup-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 
          'Aucun matricule trouvé avec ces informations. Veuillez vérifier que vos données sont correctes (nom, prénoms, date et lieu de naissance).'
        );
      }

      return result.data;
    } catch (error: any) {
      console.error('Erreur lors de la recherche du matricule:', error);
      throw new Error(
        error.message || 
        'Impossible de rechercher le matricule. Veuillez vérifier vos informations et réessayer.'
      );
    }
  },

  /**
   * Demander l'assignation d'un nouveau matricule
   * @throws {ApiError} Si l'assignation échoue
   */
  async assignMatricule(data: AssignMatriculeRequest): Promise<MatriculeResponse> {
    try {
      const response = await apiClient.fetchRaw('/api/inscription/students/assign-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 
          'Impossible d\'attribuer un nouveau matricule. Veuillez vérifier que toutes les informations sont correctes et que vous n\'avez pas déjà un matricule.'
        );
      }

      return result.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'assignation du matricule:', error);
      throw new Error(
        error.message || 
        'Impossible d\'attribuer un matricule. Veuillez réessayer ou contacter le service des inscriptions.'
      );
    }
  },
};
