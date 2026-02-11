import { useState } from 'react'
import { ErrorMessage, SuccessMessage } from '@/components/common'
import { FormField } from '@/components/forms'
import { studentService } from '@/services'

interface MatriculeFormProps {
  onCancel: () => void
  onMatriculeFound?: (matricule: string) => void
}

type FormMode = 'lookup' | 'assign'

const MatriculeForm = ({ onCancel, onMatriculeFound }: MatriculeFormProps) => {
  const [mode, setMode] = useState<FormMode>('lookup')
  const [loading, setLoading] = useState(false)
  const [matricule, setMatricule] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    last_name: '',
    first_names: '',
    birth_date: '',
    birth_place: '',
    phone: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis'
    if (!formData.first_names.trim()) newErrors.first_names = 'Les prénoms sont requis'
    if (!formData.birth_date) newErrors.birth_date = 'La date de naissance est requise'
    if (!formData.birth_place.trim()) newErrors.birth_place = 'Le lieu de naissance est requis'
    if (mode === 'assign' && !formData.phone.trim()) newErrors.phone = 'Le téléphone est requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError(null)
      setMatricule(null)

      const data = await studentService.lookupMatricule({
        last_name: formData.last_name,
        first_names: formData.first_names,
        birth_date: formData.birth_date,
        birth_place: formData.birth_place,
      })

      setMatricule(data.student_id_number)
      setSuccess(`Votre matricule : ${data.student_id_number}`)
      
      if (onMatriculeFound) {
        setTimeout(() => onMatriculeFound(data.student_id_number), 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Impossible de rechercher le matricule')
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError(null)
      setMatricule(null)

      const data = await studentService.assignMatricule({
        last_name: formData.last_name,
        first_names: formData.first_names,
        birth_date: formData.birth_date,
        birth_place: formData.birth_place,
        phone: formData.phone,
      })

      setMatricule(data.student_id_number)
      setSuccess(`Matricule attribué avec succès : ${data.student_id_number}`)
      
      if (onMatriculeFound) {
        setTimeout(() => onMatriculeFound(data.student_id_number), 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Impossible d\'attribuer le matricule')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-text-main dark:text-white">Matricule Étudiant</h3>
        <button onClick={onCancel} className="text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-border-light dark:border-border-dark">
        <button
          onClick={() => { setMode('lookup'); setMatricule(null); setErrors({}); setError(null); setSuccess(null) }}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            mode === 'lookup'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">search</span>
            Consulter mon matricule
          </span>
        </button>
        <button
          onClick={() => { setMode('assign'); setMatricule(null); setErrors({}); setError(null); setSuccess(null) }}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            mode === 'assign'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-main dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Obtenir un matricule
          </span>
        </button>
      </div>

      {mode === 'lookup' ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              Consultez votre matricule en fournissant vos informations d'identité.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">warning</span>
            <p className="text-sm text-orange-800 dark:text-orange-400">
              <strong>Attention :</strong> Vous devez avoir déjà soumis une candidature au CAP. Le matricule sera votre numéro de téléphone.
            </p>
          </div>
        </div>
      )}

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}

      <form onSubmit={mode === 'lookup' ? handleLookup : handleAssign} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Nom"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Ex: KOUADIO"
            required
            error={errors.last_name}
            disabled={loading}
          />

          <FormField
            label="Prénoms"
            name="first_names"
            value={formData.first_names}
            onChange={handleChange}
            placeholder="Ex: Kouamé Jean"
            required
            error={errors.first_names}
            disabled={loading}
          />

          <FormField
            label="Date de naissance"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            required
            error={errors.birth_date}
            disabled={loading}
          />

          <FormField
            label="Lieu de naissance"
            name="birth_place"
            value={formData.birth_place}
            onChange={handleChange}
            placeholder="Ex: Abidjan"
            required
            error={errors.birth_place}
            disabled={loading}
          />

          {mode === 'assign' && (
            <div className="md:col-span-2">
              <FormField
                label="Numéro de téléphone (Matricule)"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ex: 0707070707"
                required
                error={errors.phone}
                disabled={loading}
              />
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
                Ce numéro deviendra votre matricule étudiant
              </p>
            </div>
          )}
        </div>

        {matricule && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h5 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              Matricule
            </h5>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{matricule}</p>
            <p className="text-sm text-green-800 dark:text-green-400">
              Conservez précieusement ce matricule pour toutes vos démarches
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                <span>Traitement...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">{mode === 'lookup' ? 'search' : 'add_circle'}</span>
                <span>{mode === 'lookup' ? 'Consulter' : 'Obtenir le matricule'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MatriculeForm
