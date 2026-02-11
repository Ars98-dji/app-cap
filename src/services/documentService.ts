// src/services/documentService.ts
/**
 * Service pour les endpoints liés aux documents officiels
 */

import { apiClient } from './api';
import { type Document } from './types';

/**
 * Récupère tous les documents officiels
 * @param categorie - Filtre optionnel par catégorie
 * @throws {ApiError} Si la récupération échoue
 */
export const getDocuments = async (categorie?: string): Promise<Document[]> => {
  try {
    const endpoint = categorie 
      ? `/api/rh/documents?categorie=${categorie}` 
      : '/api/rh/documents';
    
    const response = await apiClient.get<Document[]>(endpoint);
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des documents:', error);
    throw new Error(error.message || 'Impossible de récupérer les documents. Veuillez réessayer plus tard.');
  }
};

/**
 * Récupère un document par son ID
 * @throws {ApiError} Si le document n'existe pas ou si la récupération échoue
 */
export const getDocumentById = async (id: number): Promise<Document> => {
  try {
    const response = await apiClient.get<Document>(`/api/stockage/documents/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erreur lors de la récupération du document ${id}:`, error);
    throw new Error(error.message || `Le document demandé (ID: ${id}) est introuvable ou inaccessible.`);
  }
};

/**
 * Crée un nouveau document (authentification requise)
 * @throws {ApiError} Si la création échoue
 */
export const createDocument = async (formData: FormData): Promise<Document> => {
  try {
    const response = await apiClient.postFormData<Document>('/api/stockage/documents', formData);
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la création du document:', error);
    throw new Error(error.message || 'Impossible de créer le document. Vérifiez que tous les champs requis sont remplis et que le fichier est valide.');
  }
};

/**
 * Met à jour un document (authentification requise)
 * @throws {ApiError} Si la mise à jour échoue
 */
export const updateDocument = async (id: number, data: Partial<Document>): Promise<Document> => {
  try {
    const response = await apiClient.put<Document>(`/api/stockage/documents/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour du document ${id}:`, error);
    throw new Error(error.message || `Impossible de mettre à jour le document (ID: ${id}). Veuillez vérifier vos permissions.`);
  }
};

/**
 * Supprime un document (authentification requise)
 * @throws {ApiError} Si la suppression échoue
 */
export const deleteDocument = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/stockage/documents/${id}`);
  } catch (error: any) {
    console.error(`Erreur lors de la suppression du document ${id}:`, error);
    throw new Error(error.message || `Impossible de supprimer le document (ID: ${id}). Veuillez vérifier vos permissions.`);
  }
};
