// src/services/contactService.ts
/**
 * Service pour la gestion des messages de contact
 */

import { apiClient } from './api';
import { type ContactFormData, type ContactResponse } from './types';

class ContactService {
  /**
   * Soumettre un message de contact
   * @throws {ApiError} Si l'envoi échoue
   */
  async submitContact(data: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await apiClient.post<ContactResponse>('/api/contact', data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message de contact:', error);
      
      // Retourner une réponse d'erreur structurée
      return {
        success: false,
        message: error.message || 'Impossible d\'envoyer votre message. Veuillez vérifier que tous les champs sont correctement remplis et réessayer.',
        error: error.message
      };
    }
  }
}

export default new ContactService();
