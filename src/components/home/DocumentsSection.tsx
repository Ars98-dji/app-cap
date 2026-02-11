/**
 * Section Documents Utiles - Récupère les documents depuis l'API
 */

import { useState, useEffect } from 'react';
import { getDocuments, type Document } from '@/services';
import { LoadingSpinner, ErrorMessage } from '@/components/common';

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const data = await getDocuments();
        setDocuments(data);
      } catch (err: any) {
        console.error('Erreur chargement documents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const getIconByType = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
        return 'description';
      case 'xls':
        return 'table_chart';
      case 'ppt':
        return 'slideshow';
      case 'lien':
        return 'link';
      default:
        return 'insert_drive_file';
    }
  };

  const getColorByCategory = (categorie: string) => {
    switch (categorie) {
      case 'administratif':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'pedagogique':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'legal':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'organisation':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getCategoryLabel = (categorie: string) => {
    switch (categorie) {
      case 'administratif':
        return 'Administratif';
      case 'pedagogique':
        return 'Pédagogique';
      case 'legal':
        return 'Légal';
      case 'organisation':
        return 'Organisation';
      default:
        return categorie;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-surface-dark py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <LoadingSpinner message="Chargement des documents..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white dark:bg-surface-dark py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <ErrorMessage error={error} />
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-surface-dark py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Documents Utiles
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Téléchargez les documents officiels et ressources importantes
            </p>
          </div>
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">folder_open</span>
            <p className="text-gray-500 dark:text-gray-400">
              Aucun document disponible pour le moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-surface-dark py-20 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Documents Utiles
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Téléchargez les documents officiels et ressources importantes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.lien}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary dark:hover:border-primary transition-all duration-300"
            >
              {/* Header avec icône et catégorie */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorByCategory(doc.categorie)}`}>
                  <span className="material-symbols-outlined text-2xl">
                    {getIconByType(doc.type)}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorByCategory(doc.categorie)}`}>
                  {getCategoryLabel(doc.categorie)}
                </span>
              </div>

              {/* Titre */}
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {doc.titre}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {doc.description}
              </p>

              {/* Footer avec date et taille */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span>{formatDate(doc.datePublication)}</span>
                </div>
                {doc.taille && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">description</span>
                    <span>{doc.taille}</span>
                  </div>
                )}
              </div>

              {/* Indicateur de téléchargement */}
              <div className="mt-4 flex items-center justify-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                <span>Télécharger</span>
                <span className="material-symbols-outlined text-sm">download</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
