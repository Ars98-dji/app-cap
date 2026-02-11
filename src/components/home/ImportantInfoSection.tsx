/**
 * Section Informations Importantes - Récupère les données depuis l'API
 */

import { useState, useEffect } from 'react';
import { rhService, type ImportantInformation } from '@/services/rhService';
import { LoadingSpinner, ErrorMessage } from '@/components/common';

export default function ImportantInfoSection() {
  const [informations, setInformations] = useState<ImportantInformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInformations = async () => {
      try {
        setLoading(true);
        const data = await rhService.getImportantInformations();
        setInformations(data);
      } catch (err: any) {
        console.error('Erreur chargement informations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadInformations();
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      primary: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      success: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      info: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
      warning: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      danger: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  const getButtonColorClasses = (color: string) => {
    const colors = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      info: 'bg-cyan-600 hover:bg-cyan-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <LoadingSpinner message="Chargement des informations..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <ErrorMessage error={error} />
        </div>
      </div>
    );
  }

  if (informations.length === 0) {
    return (
      <div className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Informations Importantes
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Restez informés des dernières actualités et opportunités au CAP
            </p>
          </div>
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">info</span>
            <p className="text-gray-500 dark:text-gray-400">
              Aucune information importante pour le moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Informations Importantes
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Restez informés des dernières actualités et opportunités au CAP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {informations.map((info) => (
            <div
              key={info.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6 text-center">
                {/* Icône */}
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${getColorClasses(info.color)} group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-4xl">{info.icon}</span>
                </div>

                {/* Titre */}
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                  {info.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {info.description}
                </p>

                {/* Boutons d'action */}
                <div className="space-y-2">
                  {info.link && (
                    <a
                      href={info.link}
                      className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getButtonColorClasses(info.color)}`}
                    >
                      En savoir plus
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                  {info.file && (
                    <a
                      href={info.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${getButtonColorClasses(info.color)}`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                      </svg>
                      Télécharger
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
