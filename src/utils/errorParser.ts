/**
 * Utilitaire pour parser les erreurs de l'API et les formater pour l'affichage
 */

interface ApiErrorResponse {
  success?: boolean
  message?: string
  error_code?: string
  errors?: Record<string, string[]>
  error?: string
}

/**
 * Extrait et formate les messages d'erreur de la réponse API
 * @param error - L'erreur capturée
 * @returns Message d'erreur formaté en français
 */
export function parseApiError(error: any): string {
  // Si c'est une erreur simple avec un message
  if (typeof error === 'string') {
    return error
  }

  // Si c'est un objet Error standard
  if (error instanceof Error) {
    return error.message
  }

  // Si c'est une réponse API structurée
  if (error && typeof error === 'object') {
    const apiError = error as ApiErrorResponse

    // Extraire les erreurs de validation détaillées
    if (apiError.errors && typeof apiError.errors === 'object') {
      const errorMessages: string[] = []
      
      Object.entries(apiError.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach(msg => {
            // Traduire les messages d'erreur courants en français
            const translatedMsg = translateErrorMessage(field, msg)
            errorMessages.push(translatedMsg)
          })
        }
      })

      if (errorMessages.length > 0) {
        return errorMessages.join('\n')
      }
    }

    // Sinon, utiliser le message général
    if (apiError.message) {
      return apiError.message
    }

    if (apiError.error) {
      return apiError.error
    }
  }

  // Message par défaut
  return 'Une erreur est survenue. Veuillez réessayer.'
}

/**
 * Traduit les messages d'erreur Laravel en français
 * @param field - Le champ concerné
 * @param message - Le message d'erreur original
 * @returns Message traduit en français
 */
function translateErrorMessage(field: string, message: string): string {
  // Traduire les noms de champs
  const fieldTranslations: Record<string, string> = {
    email: 'L\'email',
    last_name: 'Le nom',
    first_names: 'Les prénoms',
    birth_date: 'La date de naissance',
    birth_place: 'Le lieu de naissance',
    gender: 'Le genre',
    contacts: 'Les contacts',
    study_level: 'Le niveau d\'étude',
    entry_diploma_id: 'Le diplôme d\'entrée',
    department_id: 'La filière',
    academic_year_id: 'L\'année académique',
    phone: 'Le numéro de téléphone',
    student_id_number: 'Le matricule',
  }

  const translatedField = fieldTranslations[field] || field

  // Traduire les messages courants
  if (message.includes('has already been taken')) {
    return `${translatedField} est déjà utilisé(e).`
  }
  if (message.includes('is required') || message.includes('field is required')) {
    return `${translatedField} est requis(e).`
  }
  if (message.includes('must be') && message.includes('characters')) {
    return `${translatedField} doit avoir une longueur valide.`
  }
  if (message.includes('invalid')) {
    return `${translatedField} est invalide.`
  }
  if (message.includes('must be a valid email')) {
    return `${translatedField} doit être une adresse email valide.`
  }
  if (message.includes('must be a date')) {
    return `${translatedField} doit être une date valide.`
  }

  // Si pas de traduction spécifique, retourner le message avec le champ traduit
  return `${translatedField}: ${message}`
}

/**
 * Extrait les erreurs de validation par champ
 * @param error - L'erreur capturée
 * @returns Objet avec les erreurs par champ
 */
export function parseValidationErrors(error: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {}

  if (error && typeof error === 'object') {
    const apiError = error as ApiErrorResponse

    if (apiError.errors && typeof apiError.errors === 'object') {
      Object.entries(apiError.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = translateErrorMessage(field, messages[0])
        }
      })
    }
  }

  return fieldErrors
}
