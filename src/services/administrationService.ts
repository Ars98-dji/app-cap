// src/services/administrationService.ts
/**
 * Service pour la gestion des données d'administration
 */

import { apiClient } from './api';
import { type Administrateur } from './types';

/**
 * Récupère la liste des utilisateurs de l'administration
 * @throws {ApiError} Si la récupération échoue
 */
export const getAdministrationUsers = async (): Promise<Administrateur[]> => {
  try {
    const response = await apiClient.get<Administrateur[]>('/api/auth/administration');
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des utilisateurs administratifs:', error);
    throw new Error(error.message || 'Impossible de charger la liste des membres de l\'administration. Veuillez réessayer plus tard.');
  }
};

/**
 * Récupère la liste des membres du soutien informatique
 * @throws {ApiError} Si la récupération échoue
 */
export const getSoutienInformatique = async (): Promise<Administrateur[]> => {
  try {
    const response = await apiClient.get<Administrateur[]>('/api/auth/soutien-informatique');
    return response.data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération des membres du soutien informatique:', error);
    throw new Error(error.message || 'Impossible de charger la liste du soutien informatique. Veuillez réessayer plus tard.');
  }
};

/**
 * Récupère une image par défaut basée sur le prénom et l'ID
 */
const getDefaultImage = (firstName: string, userId: number): string => {
  // Images disponibles pour hommes et femmes
  const maleImages = [
    'person-m-2.webp', 'person-m-3.webp', 'person-m-4.webp', 
    'person-m-5.webp', 'person-m-6.webp', 'person-m-8.webp',
    'person-m-9.webp', 'person-m-10.webp', 'person-m-11.webp', 'person-m-12.webp'
  ];
  
  const femaleImages = [
    'person-f-1.webp', 'person-f-3.webp', 'person-f-7.webp',
    'person-f-8.webp', 'person-f-9.webp', 'person-f-12.webp', 'person-f-13.webp'
  ];
  
  // Prénoms féminins courants au Bénin
  const femaleNames = ['florence', 'marie', 'aïcha', 'julienne', 'fatima', 'rachida', 'sophie', 'esther'];
  
  // Déterminer si c'est un prénom féminin
  const isFemale = femaleNames.some(name => firstName.toLowerCase().includes(name));
  
  const images = isFemale ? femaleImages : maleImages;
  const index = userId % images.length;
  
  return `/assets/img/person/${images[index]}`;
};

/**
 * Convertit un utilisateur API en format d'affichage
 */
export const formatAdministrateurForDisplay = (user: Administrateur): {
  id: number;
  nom: string;
  poste: string;
  image: string;
  email?: string;
  telephone?: string;
  ordre: number;
} => {
  // Déterminer le poste basé sur le rôle principal
  const rolePrincipal = user.roles[0];
  let poste = 'Membre de l\'administration';

  if (rolePrincipal) {
    switch (rolePrincipal.name) {
      case 'chef_cap':
        poste = 'Chef du CAP';
        break;
      case 'chef_division':
        poste = 'Chef de Division';
        break;
      case 'chef_division_continue':
        poste = 'Chef Division Formation Continue';
        break;
      case 'chef_division_distance':
        poste = 'Chef Division Formation à Distance';
        break;
      case 'comptable':
        poste = 'Comptable';
        break;
      case 'secretaire':
        poste = 'Secrétaire';
        break;
      default:
        poste = rolePrincipal.display_name || rolePrincipal.name || 'Membre de l\'administration';
    }
  }

  return {
    id: user.id,
    nom: `${user.first_name} ${user.last_name}`,
    poste,
    image: user.photo || getDefaultImage(user.first_name, user.id),
    email: user.email,
    telephone: user.phone,
    ordre: user.id
  };
};
