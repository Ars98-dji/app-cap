/**
 * Hook personnalisé pour faciliter l'utilisation des services API
 * avec gestion automatique du loading, erreurs et succès
 */

import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

/**
 * Hook pour gérer les appels API avec état
 * 
 * @example
 * ```typescript
 * const { data, loading, error, execute } = useApi(getFilieres);
 * 
 * // Dans un useEffect ou un handler
 * await execute();
 * ```
 */
export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  successMessage?: string
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null, success: null }));

      try {
        const result = await apiFunction(...args);
        setState({
          data: result,
          loading: false,
          error: null,
          success: successMessage || 'Opération réussie',
        });
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Une erreur inattendue s\'est produite';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          success: null,
        });
        return null;
      }
    },
    [apiFunction, successMessage]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: null,
    });
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, success: null }));
  }, []);

  const setSuccess = useCallback((success: string | null) => {
    setState(prev => ({ ...prev, success, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setError,
    setSuccess,
  };
}

/**
 * Hook simplifié pour les appels API sans gestion de données
 * Utile pour les actions (POST, PUT, DELETE) qui ne retournent pas de données importantes
 * 
 * @example
 * ```typescript
 * const { loading, error, success, execute } = useApiAction(
 *   contactService.submitContact,
 *   'Message envoyé avec succès!'
 * );
 * 
 * await execute(formData);
 * ```
 */
export function useApiAction(
  apiFunction: (...args: any[]) => Promise<any>,
  successMessage?: string
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const result = await apiFunction(...args);
        setSuccess(successMessage || 'Opération réussie');
        setLoading(false);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Une erreur inattendue s\'est produite';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    [apiFunction, successMessage]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(null);
  }, []);

  return {
    loading,
    error,
    success,
    execute,
    reset,
    setError,
    setSuccess,
  };
}
