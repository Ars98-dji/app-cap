// src/services/inscriptionService.ts
/**
 * Service pour les endpoints liés aux inscriptions
 */

import { apiClient } from './api';
import { type DeadlineData, type Filiere } from './types';

/**
 * Récupère la prochaine date limite d'inscription
 * @throws {ApiError} Si la récupération échoue
 */
export const getNextDeadline = async (): Promise<DeadlineData> => {
  try {
    const response = await apiClient.get<DeadlineData>('/api/inscription/next-deadline');
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération de la prochaine date limite:', error);
    throw new Error(error.message || 'Impossible de récupérer les dates limites d\'inscription. Veuillez réessayer plus tard.');
  }
};

/**
 * Récupère toutes les filières avec leurs périodes
 * @throws {ApiError} Si la récupération échoue
 */
export const getFilieres = async (): Promise<Filiere[]> => {
  try {
    const response = await apiClient.get<Filiere[]>('/api/inscription/filieres');
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des filières:', error);
    throw new Error(error.message || 'Impossible de récupérer la liste des filières. Veuillez réessayer plus tard.');
  }
};

/**
 * Récupère les cycles avec leurs départements
 * @throws {ApiError} Si la récupération échoue
 */
export const getCycles = async () => {
  try {
    const response = await apiClient.get('/api/inscription/cycles');
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des cycles:', error);
    throw new Error(error.message || 'Impossible de récupérer les cycles de formation. Veuillez réessayer plus tard.');
  }
};
