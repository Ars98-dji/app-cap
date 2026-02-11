import { useState } from 'react'
import { defenseService } from '../../services/defenseService'
import type { CorrectionData } from '../../services/defenseService'

const CorrectionMemoire = () => {
  const [formData, setFormData] = useState<CorrectionData>({
    nom: '',
    prenom: '',
    statut: '',
    titre: '',
    nometu: '',
    prenometu: '',
    diplome: '',
    date_soutenance: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const blob = await defenseService.generateCorrection(formData)
      defenseService.downloadPdf(blob, 'correction.pdf')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération de l\'attestation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-6 md:p-8">
        <h3 className="text-2xl font-bold text-text-main dark:text-white mb-6">Générer une Attestation de Correction</h3>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600">error</span>
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h5 className="text-lg font-semibold text-text-main dark:text-white mb-4">Informations du Membre du Jury</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Titre *</label>
                <input type="text" name="titre" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" placeholder="Dr, Pr, etc." value={formData.titre} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Nom *</label>
                <input type="text" name="nom" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.nom} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Prénom *</label>
                <input type="text" name="prenom" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.prenom} onChange={handleChange} required />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Statut *</label>
              <input type="text" name="statut" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" placeholder="Ex: Président du jury, Rapporteur, etc." value={formData.statut} onChange={handleChange} required />
            </div>
          </div>

          <hr className="border-border-light dark:border-border-dark" />

          <div>
            <h5 className="text-lg font-semibold text-text-main dark:text-white mb-4">Informations de l'Étudiant</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Nom de l'étudiant *</label>
                <input type="text" name="nometu" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.nometu} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Prénom de l'étudiant *</label>
                <input type="text" name="prenometu" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.prenometu} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Diplôme *</label>
                <select name="diplome" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.diplome} onChange={handleChange} required>
                  <option value="">Sélectionner</option>
                  <option value="Licence Professionnelle">Licence Professionnelle</option>
                  <option value="Master">Master</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Date de soutenance *</label>
                <input type="date" name="date_soutenance" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.date_soutenance} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin material-symbols-outlined">progress_activity</span>
                  Génération en cours...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                  Générer l'Attestation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CorrectionMemoire
