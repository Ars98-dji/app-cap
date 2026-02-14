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
  const [loadingFileId, setLoadingFileId] = useState<number | null>(null);

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

  const handleViewFile = async (fileId: number) => {
    try {
      setLoadingFileId(fileId);
      const result = await rhService.downloadFile(fileId);
      if (result.success && result.url) {
        window.open(result.url, '_blank');
        // Nettoyer l'URL après un délai
        setTimeout(() => URL.revokeObjectURL(result.url), 100);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du fichier:', error);
      alert('Impossible d\'ouvrir le fichier');
    } finally {
      setLoadingFileId(null);
    }
  };



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
            <i className="bi bi-info-circle text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
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
                  <i className={`bi bi-${info.icon} text-4xl`}></i>
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
                    <button
                      onClick={() => handleViewFile(info.file!.id)}
                      disabled={loadingFileId === info.file.id}
                      className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingFileId === info.file.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Chargement...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          Voir le document
                        </>
                      )}
                    </button>
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
