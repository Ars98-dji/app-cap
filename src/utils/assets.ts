/**
 * Utilitaire pour gérer les chemins des assets
 * Prend en compte la base URL configurée dans Vite
 */

const BASE_URL = import.meta.env.BASE_URL || '/'

/**
 * Retourne le chemin complet d'un asset
 * @param path - Chemin relatif de l'asset (ex: 'img/logo.png')
 * @returns Chemin complet de l'asset
 */
export const getAssetPath = (path: string): string => {
  // Enlever le slash initial si présent
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Construire le chemin complet
  const fullPath = `${BASE_URL}${cleanPath}`
  
  // S'assurer qu'il n'y a pas de double slash
  return fullPath.replace(/\/\//g, '/')
}

/**
 * Retourne le chemin d'une image
 * @param imagePath - Chemin de l'image relatif à assets/img/
 * @returns Chemin complet de l'image
 */
export const getImagePath = (imagePath: string): string => {
  return getAssetPath(`assets/img/${imagePath}`)
}
