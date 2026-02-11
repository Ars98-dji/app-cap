import { useState } from 'react'
import { enrollmentService } from '@/services'
import { ErrorMessage, SuccessMessage, LoadingSpinner, PhotoUploadField } from '@/components/common'

interface ComplementDossierFormProps {
  onCancel: () => void
}

type CandidatureType = 'licence' | 'master' | 'ingenieur_prepa' | 'ingenieur_specialite'

export const ComplementDossierForm = ({ onCancel }: ComplementDossierFormProps) => {
  const [trackingCode, setTrackingCode] = useState('')
  const [candidatureType, setCandidatureType] = useState<CandidatureType | ''>('')
  const [documents, setDocuments] = useState<Record<string, File>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const getDocumentTypesByCandidature = (type: CandidatureType | '') => {
    if (!type) return []

    const commonDocs = [
      { key: 'photo', label: 'Photo d\'identité' },
      { key: 'demande_da', label: 'Lettre de Demande' },
      { key: 'cv', label: 'CV' },
      { key: 'acte_naissance', label: 'Acte de naissance' },
      { key: 'diplome_bac', label: 'Diplôme Baccalauréat' },
      { key: 'attestation_travail', label: 'Attestation de travail' },
      { key: 'quittance_rectorat', label: 'Quittance Rectorat' },
      { key: 'quittance_cap', label: 'Quittance CAP' },
      { key: 'attestation_depot_dossier', label: 'Attestation dépôt dossier' },
    ]

    switch (type) {
      case 'licence':
        return [...commonDocs, { key: 'diplome_licence', label: 'Diplôme Licence (optionnel)' }]
      case 'master':
        return [...commonDocs, { key: 'diplome_license', label: 'Diplôme Licence' }, { key: 'attestation_anglais', label: 'Attestation d\'anglais (optionnel)' }]
      case 'ingenieur_prepa':
      case 'ingenieur_specialite':
        return [...commonDocs, { key: 'diplome_licence', label: 'Diplôme Licence' }]
      default:
        return commonDocs
    }
  }

  const documentTypes = getDocumentTypesByCandidature(candidatureType)

  const handleFileChange = (key: string, file: File | null) => {
    if (file) {
      setDocuments(prev => ({ ...prev, [key]: file }))
    } else {
      const newDocs = { ...documents }
      delete newDocs[key]
      setDocuments(newDocs)
    }
  }

  const handlePhotoChange = (file: File | null) => {
    handleFileChange('photo', file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!candidatureType) {
      setError('Veuillez sélectionner le type de candidature')
      return
    }

    if (!trackingCode.trim()) {
      setError('Veuillez entrer votre code de suivi')
      return
    }

    if (Object.keys(documents).length === 0) {
      setError('Veuillez ajouter au moins un document')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      Object.entries(documents).forEach(([documentName, file]) => {
        formData.append('names[]', documentName)
        formData.append('files[]', file)
      })

      await enrollmentService.submitComplement(trackingCode, formData)
      setSuccess(`✅ Complément de dossier soumis avec succès ! Code de suivi : ${trackingCode}. Une notification de confirmation vous a été envoyée par email.`)
      setTimeout(() => onCancel(), 3000)
    } catch (err: any) {
      setError(err.message || 'Impossible d\'envoyer les documents. Vérifiez votre code de suivi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Complément de dossier</h3>
        <button onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">close</span>
            Annuler
          </span>
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <p className="text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">info</span>
          Utilisez votre code de suivi pour ajouter les pièces manquantes à votre dossier.
        </p>
      </div>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Type de candidature *</label>
          <select value={candidatureType} onChange={(e) => {
            setCandidatureType(e.target.value as CandidatureType | '')
            setDocuments({})
          }} required className="w-full px-3 py-2 border rounded-lg border-gray-300">
            <option value="">Sélectionner le type</option>
            <option value="licence">Licence</option>
            <option value="master">Master</option>
            <option value="ingenieur_prepa">Ingénieur - Prépa</option>
            <option value="ingenieur_specialite">Ingénieur - Spécialité</option>
          </select>
          <small className="text-gray-600">Sélectionnez le type de votre candidature initiale</small>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Code de suivi *</label>
          <input type="text" placeholder="Ex: TRACK-ABC123" value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)} required
            className="w-full px-3 py-2 border rounded-lg border-gray-300" />
          <small className="text-gray-600">Code reçu par email lors de votre candidature</small>
        </div>

        {candidatureType && (
          <div>
            <h5 className="text-lg font-semibold mb-3">Documents à ajouter</h5>
            <p className="text-sm text-gray-600 mb-4">Sélectionnez uniquement les pièces manquantes à votre dossier</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentTypes.map((doc) => (
                doc.key === 'photo' ? (
                  <PhotoUploadField
                    key={doc.key}
                    name={doc.key}
                    label={doc.label}
                    value={documents[doc.key] || null}
                    onChange={handlePhotoChange}
                    disabled={loading}
                  />
                ) : (
                  <div key={doc.key}>
                    <label className="block text-sm font-medium mb-1">{doc.label}</label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300" />
                    {documents[doc.key] && (
                      <small className="text-green-600 flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        {documents[doc.key].name}
                      </small>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={loading}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50">
            Annuler
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">upload</span>
              Envoyer les documents
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
