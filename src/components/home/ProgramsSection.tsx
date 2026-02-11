/**
 * Section Nos Filières - Récupère les données depuis l'API et les classe par cycle
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFilieres, type Filiere } from '@/services';
import { LoadingSpinner, ErrorMessage } from '@/components/common';

export default function ProgramsSection() {
  const [activeTab, setActiveTab] = useState<'licence' | 'master' | 'ingenierie'>('licence');
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Images par défaut pour les cycles
  const defaultImages: Record<string, string> = {
    licence: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
    master: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400',
    ingenierie: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
  };

  // Charger les filières depuis l'API
  useEffect(() => {
    const loadFilieres = async () => {
      try {
        setLoading(true);
        const data = await getFilieres();
        setFilieres(data);
      } catch (err: any) {
        console.error('Erreur chargement filières:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFilieres();
  }, []);

  // Normaliser le cycle pour le filtre
  const normalizeCycle = (cycle: string): string => {
    const normalized = cycle.toLowerCase().trim();
    if (normalized.includes('licence')) return 'licence';
    if (normalized.includes('master')) return 'master';
    if (normalized.includes('ing')) return 'ingenierie';
    return normalized;
  };

  const filteredFilieres = filieres.filter(filiere => {
    const normalizedCycle = normalizeCycle(filiere.cycle);
    return normalizedCycle === activeTab;
  });

  const getBadgeText = (badge: string | null) => {
    switch (badge) {
      case 'inscriptions-ouvertes':
        return 'Ouvert';
      case 'inscriptions-fermees':
        return 'Fermé';
      case 'prochainement':
        return 'Bientôt';
      default:
        return '';
    }
  };

  const getBadgeClass = (badge: string | null) => {
    switch (badge) {
      case 'inscriptions-ouvertes':
        return 'bg-green-500 text-white';
      case 'inscriptions-fermees':
        return 'bg-gray-500 text-white';
      case 'prochainement':
        return 'bg-yellow-500 text-gray-900';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isInscriptionOpen = (filiere: Filiere) => {
    return filiere.badge === 'inscriptions-ouvertes';
  };

  if (loading) {
    return (
      <div id="formations" className="w-full py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <LoadingSpinner message="Chargement des filières..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="formations" className="w-full py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <ErrorMessage error={error} />
        </div>
      </div>
    );
  }

  return (
    <div id="formations" className="w-full py-20 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-text-main dark:text-white text-3xl font-bold leading-tight mb-4">
            Nos Filières de Formation
          </h2>
          <p className="text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
            Découvrez nos programmes d'excellence dans les trois cycles de formation
          </p>
        </div>

        {/* Onglets */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setActiveTab('licence')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'licence'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Licence
            </button>
            <button
              onClick={() => setActiveTab('master')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'master'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Master
            </button>
            <button
              onClick={() => setActiveTab('ingenierie')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'ingenierie'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Ingénierie
            </button>
          </div>
        </div>

        {/* Contenu */}
        {filteredFilieres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Aucune filière disponible pour ce cycle.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFilieres.map((filiere) => (
              <div
                key={filiere.id}
                className="group rounded-xl overflow-hidden bg-background-light dark:bg-background-dark border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url("${filiere.image || defaultImages[activeTab]}")` }}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  {filiere.badge && (
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(filiere.badge)}`}>
                      {getBadgeText(filiere.badge)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-primary uppercase">
                      {filiere.cycle}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-text-main dark:text-white mb-3 line-clamp-2">
                    {filiere.title}
                  </h3>
                  
                  {filiere.dateLimite && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="material-symbols-outlined text-sm mr-2">calendar_today</span>
                      <span>Clôture : {formatDate(filiere.dateLimite)}</span>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    {isInscriptionOpen(filiere) ? (
                      <Link
                        to="/apply"
                        className="flex items-center justify-center w-full px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm mr-2">edit_square</span>
                        Candidater
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-sm mr-2">lock</span>
                        Inscriptions fermées
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
