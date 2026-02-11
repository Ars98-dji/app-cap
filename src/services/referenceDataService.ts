// src/services/referenceDataService.ts
/**
 * Service pour les données de référence (diplômes, départements, années académiques)
 */

import { apiClient } from './api';
import { type EntryDiploma, type AcademicYear, type Department } from './types';

/**
 * Normalise une chaîne (enlève les accents)
 */
const normalize = (str: string) => 
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const referenceDataService = {
  /**
   * Récupère la liste des diplômes d'entrée
   * @throws {ApiError} Si la récupération échoue
   */
  async getEntryDiplomas(): Promise<EntryDiploma[]> {
    try {
      const response = await apiClient.fetchRaw('/api/inscription/public/entry-diplomas');
      
      if (!response.ok) {
        throw new Error('Impossible de récupérer la liste des diplômes d\'entrée.');
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      console.error('Erreur récupération diplômes:', error);
      throw new Error(error.message || 'Impossible de charger les diplômes d\'entrée. Veuillez réessayer plus tard.');
    }
  },

  /**
   * Récupère la liste des départements/filières
   * @param cycle - Filtre optionnel par cycle (licence, master, ingenierie)
   * @throws {ApiError} Si la récupération échoue
   */
  async getDepartments(cycle?: string): Promise<Department[]> {
    console.log('🚀 [API] getDepartments APPELÉE - cycle:', cycle);
    try {
      console.log(`🌐 [API] Appel GET /api/inscription/filieres (cycle demandé: ${cycle || 'tous'})`);
      const response = await apiClient.fetchRaw('/api/inscription/filieres');
      
      if (!response.ok) {
        throw new Error('Impossible de récupérer la liste des filières.');
      }
      
      console.log('📥 [API] Response reçue:', response.status, response.statusText);
      const data = await response.json();
      console.log('📡 [API] Réponse brute:', data);
      
      const departments = data.data || data;
      console.log('📦 [API] Départements extraits:', departments);
      console.log('📦 [API] Nombre total:', departments.length);
      
      // Filtrer par cycle si spécifié
      if (cycle) {
        console.log(`🔍 [API] Filtrage par cycle: "${cycle}"`);
        
        const normalizedCycle = normalize(cycle);
        
        const filtered = departments.filter((dept: Department) => {
          // Gérer le cas où cycle est une string ou un objet
          const deptCycle = typeof dept.cycle === 'string' ? dept.cycle : (dept.cycle?.name || '');
          const normalizedDeptCycle = normalize(deptCycle);
          const matches = normalizedDeptCycle.includes(normalizedCycle);
          console.log(`   - ${dept.abbreviation}: cycle="${deptCycle}" (normalisé: "${normalizedDeptCycle}") → match=${matches}`);
          return matches;
        });
        
        console.log(`✅ [API] Départements filtrés pour "${cycle}":`, filtered);
        console.log(`✅ [API] Nombre après filtre: ${filtered.length}`);
        
        if (filtered.length === 0) {
          console.warn(`⚠️ Aucune filière trouvée pour le cycle "${cycle}"`);
        }
        
        return filtered;
      }
      
      console.log('✅ [API] Retour de tous les départements (pas de filtre)');
      return departments;
    } catch (error: any) {
      console.error('❌ [API] Erreur récupération filières:', error);
      throw new Error(error.message || 'Impossible de charger les filières. Veuillez réessayer plus tard.');
    }
  },

  /**
   * Récupère la liste des années académiques
   * @throws {ApiError} Si la récupération échoue
   */
  async getAcademicYears(): Promise<AcademicYear[]> {
    try {
      const response = await apiClient.fetchRaw('/api/inscription/public/academic-years');
      
      if (!response.ok) {
        throw new Error('Impossible de récupérer la liste des années académiques.');
      }
      
      const data = await response.json();
      return data.data || data;
    } catch (error: any) {
      console.error('Erreur récupération années académiques:', error);
      throw new Error(error.message || 'Impossible de charger les années académiques. Veuillez réessayer plus tard.');
    }
  },

  /**
   * Récupère les années académiques avec périodes actives pour une filière
   * @param departmentId - ID de la filière/département
   * @throws {ApiError} Si la récupération échoue
   */
  async getAcademicYearsForDepartment(departmentId: number): Promise<AcademicYear[]> {
    try {
      const response = await apiClient.fetchRaw(
        `/api/inscription/public/academic-years/department/${departmentId}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Impossible de récupérer les années académiques pour la filière ${departmentId}.`);
      }
      
      return data.data || [];
    } catch (error: any) {
      console.error('Erreur récupération années pour filière:', error);
      throw new Error(error.message || `Impossible de charger les années académiques pour cette filière. Veuillez réessayer plus tard.`);
    }
  }
};
