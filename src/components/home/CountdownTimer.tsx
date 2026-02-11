/**
 * Composant de compte à rebours pour les inscriptions
 */

import { useState, useEffect } from 'react';
import { getNextDeadline } from '@/services';
import type { DeadlineData } from '@/services';

interface TimeLeft {
  jours: number;
  heures: number;
  minutes: number;
  secondes: number;
}

export default function CountdownTimer() {
  const [deadlineData, setDeadlineData] = useState<DeadlineData | null>(null);
  const [timers, setTimers] = useState<Record<number, TimeLeft>>({});
  const [loading, setLoading] = useState(true);

  // Récupérer les dates limites depuis l'API
  useEffect(() => {
    const fetchDeadline = async () => {
      try {
        setLoading(true);
        const data = await getNextDeadline();
        setDeadlineData(data);
      } catch (err) {
        console.error('Erreur chargement deadline:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeadline();
  }, []);

  // Calculer le temps restant pour chaque période
  useEffect(() => {
    if (!deadlineData || deadlineData.status === 'closed' || deadlineData.periods.length === 0) {
      return;
    }

    const calculateTimeLeft = (deadline: string): TimeLeft => {
      const deadlineTime = new Date(deadline).getTime();
      const now = new Date().getTime();
      const difference = deadlineTime - now;

      if (difference > 0) {
        return {
          jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
          heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          secondes: Math.floor((difference / 1000) % 60),
        };
      }
      return { jours: 0, heures: 0, minutes: 0, secondes: 0 };
    };

    const updateAllTimers = () => {
      const newTimers: Record<number, TimeLeft> = {};
      deadlineData.periods.forEach((period, index) => {
        newTimers[index] = calculateTimeLeft(period.deadline);
      });
      setTimers(newTimers);
    };

    updateAllTimers();
    const timer = setInterval(updateAllTimers, 1000);

    return () => clearInterval(timer);
  }, [deadlineData]);

  if (loading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    );
  }

  if (!deadlineData || deadlineData.status === 'closed' || deadlineData.periods.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {deadlineData.periods.slice(0, 3).map((period, index) => {
          const timer = timers[index] || { jours: 0, heures: 0, minutes: 0, secondes: 0 };
          const nbFilieres = period.filieres.length;
          const isActive = index === 0;

          return (
            <div
              key={index}
              className={`relative rounded-2xl p-6 transition-all hover:shadow-xl ${
                isActive
                  ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary shadow-lg'
                  : 'bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-md'
              }`}
            >
              {/* Badge Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-2xl ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {isActive ? 'schedule' : 'event'}
                  </span>
                  <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                    {isActive ? 'En cours' : 'À venir'}
                  </span>
                </div>
                {isActive && (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-primary rounded-full animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    ACTIF
                  </span>
                )}
              </div>

              {/* Nombre de filières */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-black ${isActive ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                    {nbFilieres}
                  </span>
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    filière{nbFilieres > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isActive ? 'Inscriptions ouvertes' : 'Bientôt disponibles'}
                </p>
              </div>

              {/* Compte à rebours */}
              {timer.jours > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    {isActive ? 'Temps restant' : 'Ouverture dans'}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`text-center p-3 rounded-xl ${isActive ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <div className={`text-2xl font-bold ${isActive ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                        {timer.jours}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">jours</div>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${isActive ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <div className={`text-2xl font-bold ${isActive ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                        {timer.heures}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">heures</div>
                    </div>
                    <div className={`text-center p-3 rounded-xl ${isActive ? 'bg-primary/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <div className={`text-2xl font-bold ${isActive ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>
                        {timer.minutes}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">min</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Liste des filières */}
              {period.filieres.length > 0 && (
                <div className={`pt-4 border-t ${isActive ? 'border-primary/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Filières disponibles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {period.filieres.slice(0, 4).map((filiere) => (
                      <span
                        key={filiere.id}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {filiere.abbreviation}
                      </span>
                    ))}
                    {period.filieres.length > 4 && (
                      <span className="px-3 py-1 text-xs font-semibold bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
                        +{period.filieres.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bouton Voir toutes les filières */}
      <div className="text-center mt-8">
        <a
          href="#formations"
          className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span className="material-symbols-outlined">visibility</span>
          Voir toutes les filières
        </a>
      </div>
    </div>
  );
}
