// Utiliser le proxy en développement, l'API directe en production

const PHOTO_VALIDATION_API = 'https://spodoptera.xyz/detection-image/validate'

export interface PhotoValidationResponse {
  valid: boolean
  message?: string
}

/**
 * Service de validation de photo d'identité
 * Utilise l'API de détection d'image pour vérifier la validité des photos
 */
export const photoValidationService = {
  /**
   * Valide une photo d'identité via l'API de détection
   * @param file - Le fichier image à valider
   * @returns Promise<PhotoValidationResponse>
   */
  async validatePhoto(file: File): Promise<PhotoValidationResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(PHOTO_VALIDATION_API, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        
        // Vérifier le champ success dans la réponse
        if (data.success === false) {
          // La photo n'est pas valide
          let errorMessage = 'Photo d\'identité non valide'
          
          if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            // Extraire les messages d'erreur
            errorMessage = data.errors.map((err: any) => err.message).join(', ')
          }
          
          return {
            valid: false,
            message: errorMessage,
          }
        }
        
        // La photo est valide
        return {
          valid: true,
          message: 'Photo d\'identité valide',
        }
      }

      // Gérer les erreurs de validation (422)
      if (response.status === 422) {
        const errorData = await response.json()
        const detail = errorData?.detail
        let errorMessage = 'La photo d\'identité n\'est pas valide'

        if (Array.isArray(detail) && detail.length > 0) {
          errorMessage = detail.map((err: any) => err.msg).join(', ')
        } else if (typeof detail === 'string') {
          errorMessage = detail
        }

        return {
          valid: false,
          message: errorMessage,
        }
      }

      return {
        valid: false,
        message: 'La photo d\'identité n\'est pas valide',
      }
    } catch (error: any) {
      console.error('Erreur validation photo:', error)

      return {
        valid: false,
        message: error.message || 'Erreur lors de la validation de la photo',
      }
    }
  },
}
