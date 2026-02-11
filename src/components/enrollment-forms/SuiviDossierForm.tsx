import { useState } from 'react'
import { ErrorMessage } from '@/components/common'
import { enrollmentService } from '@/services'

interface SuiviDossierFormProps {
  onCancel: () => void
}

interface DossierInfo {
  tracking_code: string
  last_name: string
  first_names: string
  email: string
  status: string
  message?: string
  department?: string
  academic_year?: string
  documents?: Record<string, string>
}

const SuiviDossierForm = ({ onCancel }: SuiviDossierFormProps) => {
  const [trackingCode, setTrackingCode] = useState('')
  const [dossier, setDossier] = useState<DossierInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; text: string; icon: string }> = {
      pending: { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', text: 'En attente', icon: 'schedule' },
      in_review: { class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', text: 'En cours d\'examen', icon: 'visibility' },
      accepted: { class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', text: 'Accepté', icon: 'check_circle' },
      approved: { class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', text: 'Approuvé', icon: 'check_circle' },
      rejected: { class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', text: 'Rejeté', icon: 'cancel' },
      incomplete: { class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', text: 'Incomplet', icon: 'warning' },
    }
    return badges[status] || badges.pending
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackingCode.trim()) {
      setError('Veuillez entrer votre code de suivi')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setDossier(null)

      const response = await enrollmentService.getDossier(trackingCode)
      
      // Parser les données selon la structure de l'API
      let apiDossier = response.data?.dossier || response.dossier || response.data
      
      if (apiDossier && apiDossier.personal_information) {
        const personalInfo = apiDossier.personal_information
        
        const mappedData: DossierInfo = {
          tracking_code: apiDossier.tracking_code || '',
          last_name: personalInfo.last_name || '',
          first_names: personalInfo.first_names || '',
          email: personalInfo.email || '',
          status: apiDossier.status || 'pending',
          message: apiDossier.cuca_comment || apiDossier.cuo_comment || '',
          department: apiDossier.department?.name || 'N/A',
          academic_year: apiDossier.academic_year?.academic_year || 'N/A',
          documents: apiDossier.documents || {}
        }
        
        setDossier(mappedData)
      } else {
        throw new Error('Données non trouvées ou structure invalide')
      }
    } catch (err: any) {
      setError(err.message || 'Aucun dossier ne correspond à ce code de suivi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-text-main dark:text-white">Suivi de dossier</h3>
        <button
          onClick={onCancel}
          className="text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            Entrez votre code de suivi pour consulter l'état de votre candidature.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
            placeholder="Ex: CAP-HfiW59uuNb"
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 focus:border-primary focus:ring focus:ring-primary/20 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <span>Recherche...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">search</span>
                <span>Rechercher</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      {dossier && (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
            <h5 className="font-bold text-text-main dark:text-white">Informations du dossier</h5>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(dossier.status).class}`}>
              <span className="material-symbols-outlined text-[18px]">{getStatusBadge(dossier.status).icon}</span>
              {getStatusBadge(dossier.status).text}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Informations personnelles */}
            <div>
              <h6 className="text-primary font-bold mb-4 pb-2 border-b border-border-light dark:border-border-dark flex items-center gap-2">
                <span className="material-symbols-outlined">person</span>
                Informations personnelles
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Code de suivi</p>
                  <p className="font-medium text-text-main dark:text-white break-all">{dossier.tracking_code}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Nom complet</p>
                  <p className="font-medium text-text-main dark:text-white">{dossier.last_name} {dossier.first_names}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Email</p>
                  <p className="font-medium text-text-main dark:text-white break-all">{dossier.email}</p>
                </div>
              </div>
            </div>

            {/* Informations académiques */}
            {dossier.department && (
              <div>
                <h6 className="text-primary font-bold mb-4 pb-2 border-b border-border-light dark:border-border-dark flex items-center gap-2">
                  <span className="material-symbols-outlined">school</span>
                  Informations académiques
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Filière</p>
                    <p className="font-medium text-text-main dark:text-white">{dossier.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Année académique</p>
                    <p className="font-medium text-text-main dark:text-white">{dossier.academic_year}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents */}
            {dossier.documents && Object.keys(dossier.documents).length > 0 && (
              <div>
                <h6 className="text-primary font-bold mb-4 pb-2 border-b border-border-light dark:border-border-dark flex items-center gap-2">
                  <span className="material-symbols-outlined">folder_open</span>
                  Pièces jointes ({Object.keys(dossier.documents).length})
                </h6>
                <div className="space-y-2">
                  {Object.entries(dossier.documents).map(([name, path], idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm text-text-main dark:text-white truncate">{name}</p>
                          <p className="text-xs text-text-secondary dark:text-gray-400">Soumis</p>
                        </div>
                      </div>
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL}/storage/${path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        Voir
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            {dossier.message && (
              <div className={`rounded-lg p-4 ${
                dossier.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                dossier.status === 'accepted' || dossier.status === 'approved' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              }`}>
                <h6 className="font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined">info</span>
                  Message
                </h6>
                <p className="text-sm">{dossier.message}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SuiviDossierForm
