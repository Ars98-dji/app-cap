import { useState } from 'react'
import { ErrorMessage } from '@/components/common'

interface SuiviPaiementFormProps {
  onCancel: () => void
}

interface PaiementStatus {
  reference: string
  status: string
  student_id_number: string
  amount: number
  payment_date: string
  purpose: string
  observation?: string
  created_at: string
}

const SuiviPaiementForm = ({ onCancel }: SuiviPaiementFormProps) => {
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [paiement, setPaiement] = useState<PaiementStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; text: string; icon: string }> = {
      pending: { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', text: 'En attente', icon: 'schedule' },
      approved: { class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', text: 'Validé', icon: 'check_circle' },
      rejected: { class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', text: 'Rejeté', icon: 'cancel' },
    }
    return badges[status] || badges.pending
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reference.trim()) {
      setError('Veuillez saisir une référence de paiement')
      return
    }

    setLoading(true)
    setError(null)
    setPaiement(null)

    try {
      // Simuler un appel API - À remplacer par le vrai service
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Exemple de données - À remplacer par l'appel réel
      setPaiement({
        reference: reference,
        status: 'pending',
        student_id_number: '202300001',
        amount: 50000,
        payment_date: '2024-01-15',
        purpose: 'Scolarité L1',
        created_at: new Date().toISOString()
      })
    } catch (err: any) {
      setError(err.message || 'Impossible de vérifier le statut du paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-600">receipt_long</span>
            Suivi de Quittance
          </h3>
          <p className="text-text-secondary dark:text-gray-400 mt-1">
            Consultez le statut de traitement de votre paiement
          </p>
        </div>
        <button onClick={onCancel} className="text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-gray-200 mb-2">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                Référence de paiement
              </span>
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: PAY-20251029-ABC12345"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 focus:border-primary focus:ring focus:ring-primary/20 transition-all disabled:opacity-50"
            />
            <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
              La référence vous a été fournie lors de la soumission de votre quittance
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !reference.trim()}
            className="w-full px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <span>Recherche...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">search</span>
                <span>Vérifier le statut</span>
              </>
            )}
          </button>
        </form>
      </div>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      {paiement && (
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div className={`p-4 ${
            paiement.status === 'approved' ? 'bg-green-50 dark:bg-green-900/20' :
            paiement.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20' :
            'bg-yellow-50 dark:bg-yellow-900/20'
          }`}>
            <div className="flex items-start gap-3">
              <span className={`material-symbols-outlined text-2xl ${
                paiement.status === 'approved' ? 'text-green-600 dark:text-green-400' :
                paiement.status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                'text-yellow-600 dark:text-yellow-400'
              }`}>
                {getStatusBadge(paiement.status).icon}
              </span>
              <div className="flex-1">
                <h5 className="font-bold mb-1">
                  {paiement.status === 'approved' ? 'Paiement validé' :
                   paiement.status === 'rejected' ? 'Paiement rejeté' :
                   'Paiement en cours de traitement'}
                </h5>
                <p className="text-sm">
                  {paiement.status === 'approved' ? 'Votre paiement a été validé avec succès.' :
                   paiement.status === 'rejected' ? 'Votre paiement a été rejeté. Contactez le service financier.' :
                   'Votre quittance est en cours de vérification.'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <h5 className="font-bold text-text-main dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined">description</span>
              Détails du paiement
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Référence</p>
                <p className="font-semibold text-text-main dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">qr_code</span>
                  {paiement.reference}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Statut</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(paiement.status).class}`}>
                  <span className="material-symbols-outlined text-[16px]">{getStatusBadge(paiement.status).icon}</span>
                  {getStatusBadge(paiement.status).text}
                </span>
              </div>

              <div className="p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Matricule</p>
                <p className="font-semibold text-text-main dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">badge</span>
                  {paiement.student_id_number}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Montant</p>
                <p className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  {new Intl.NumberFormat('fr-FR').format(paiement.amount)} FCFA
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border-light dark:border-border-dark">
                <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Date de versement</p>
                <p className="font-semibold text-text-main dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  {new Date(paiement.payment_date).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border-light dark:border-border-dark md:col-span-2">
                <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Motif</p>
                <p className="font-medium text-text-main dark:text-white">{paiement.purpose}</p>
              </div>

              {paiement.observation && (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 md:col-span-2">
                  <p className="text-xs text-text-secondary dark:text-gray-400 mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">comment</span>
                    Observation
                  </p>
                  <p className="text-sm text-text-main dark:text-white">{paiement.observation}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border-light dark:border-border-dark flex gap-3 flex-wrap">
              <button
                onClick={() => { setReference(''); setPaiement(null); setError(null) }}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                Nouvelle recherche
              </button>
              {paiement.status === 'rejected' && (
                <a
                  href="/apply?type=paiement"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  Soumettre un nouveau paiement
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {!paiement && !error && (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
          <h6 className="font-bold text-text-main dark:text-white mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span>
            Informations utiles
          </h6>
          <ul className="space-y-2 text-sm text-text-secondary dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
              <span>La référence de paiement vous a été fournie après la soumission de votre quittance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
              <span>Le traitement d'un paiement peut prendre 24 à 48 heures ouvrables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
              <span>Vous recevrez une notification par email une fois le traitement terminé</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default SuiviPaiementForm
