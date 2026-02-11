/**
 * Gestionnaire d'erreurs global pour l'application
 */

export class AppError extends Error {
  statusCode: number;
  message: string;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Gère les erreurs HTTP et redirige vers les pages appropriées
 */
export const handleApiError = (error: any, navigate?: (path: string) => void) => {
  console.error('API Error:', error);

  // Si l'erreur est une Response fetch
  if (error instanceof Response) {
    if (error.status >= 500) {
      // Erreur serveur (500+)
      if (navigate) {
        navigate('/500');
      } else {
        window.location.href = '/500';
      }
    } else if (error.status === 404) {
      // Page non trouvée
      if (navigate) {
        navigate('/404');
      } else {
        window.location.href = '/404';
      }
    } else if (error.status === 401) {
      // Non autorisé - rediriger vers login
      console.warn('Accès non autorisé. Veuillez vous connecter.');
    } else if (error.status === 403) {
      // Accès interdit
      console.warn('Accès interdit. Vous n\'avez pas les permissions nécessaires.');
    }
  }

  // Si c'est une erreur réseau
  if (error instanceof TypeError && error.message.includes('fetch')) {
    console.error('Erreur réseau - Le serveur est peut-être indisponible');
    if (navigate) {
      navigate('/500');
    } else {
      window.location.href = '/500';
    }
  }

  return error;
};

/**
 * Intercepte les erreurs fetch et les gère automatiquement
 */
export const fetchWithErrorHandling = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  try {
    const response = await fetch(url, options);

    // Vérifier le status de la réponse
    if (!response.ok) {
      if (response.status >= 500) {
        handleApiError(response);
      } else if (response.status === 404) {
        console.warn(`Ressource introuvable: ${url}`);
      }
      throw response;
    }

    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Logger les erreurs pour le debugging (peut être envoyé à un service externe)
 */
export const logError = (error: Error | AppError, errorInfo?: any) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    errorInfo,
  };

  console.error('Error logged:', errorLog);

  // Ici vous pouvez envoyer les logs à un service externe
  // comme Sentry, LogRocket, etc.
  // sendToErrorTrackingService(errorLog);
};

/**
 * Affiche un message d'erreur convivial basé sur le code d'erreur
 */
export const getErrorMessage = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return 'Requête invalide. Veuillez vérifier vos données.';
    case 401:
      return 'Non autorisé. Veuillez vous connecter.';
    case 403:
      return 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
    case 404:
      return 'Ressource non trouvée.';
    case 408:
      return 'Délai d\'attente dépassé. Veuillez réessayer.';
    case 422:
      return 'Données invalides. Veuillez vérifier les champs du formulaire.';
    case 429:
      return 'Trop de requêtes. Veuillez patienter un moment.';
    case 500:
      return 'Erreur interne du serveur. Nos équipes ont été informées.';
    case 502:
      return 'Passerelle défectueuse. Le serveur est temporairement indisponible.';
    case 503:
      return 'Service indisponible. Maintenance en cours.';
    case 504:
      return 'Délai d\'attente de la passerelle dépassé.';
    default:
      return `Une erreur est survenue (Code: ${statusCode}).`;
  }
};

/**
 * Affiche un message d'erreur utilisateur dans un toast ou une alerte
 */
export const showErrorToUser = (error: any) => {
  let message = 'Une erreur inattendue s\'est produite.';
  
  if (error.message) {
    message = error.message;
  } else if (error.statusCode) {
    message = getErrorMessage(error.statusCode);
  }
  
  // Vous pouvez utiliser votre système de notification ici
  // Par exemple: toast.error(message)
  console.error('Erreur à afficher à l\'utilisateur:', message);
  alert(message); // Remplacer par votre système de notification
  
  return message;
};
