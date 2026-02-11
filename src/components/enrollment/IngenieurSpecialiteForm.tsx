import { useState, useEffect } from 'react'
import { enrollmentService, referenceDataService } from '@/services'
import { ErrorMessage, SuccessMessage, LoadingSpinner } from '@/components/common'
import { parseApiError, parseValidationErrors } from '@/utils/errorParser'
import type { Department, AcademicYear } from '@/services/types'

interface IngenieurSpecialiteFormProps {
  onCancel: () => void
  onRequestMatricule?: () => void
  initialMatricule?: string | null
}

export const IngenieurSpecialiteForm = ({ onCancel, onRequestMatricule, initialMatricule }: IngenieurSpecialiteFormProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [departments, setDepartments] = useState<Department[]>([])
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])

  const [formData, setFormData] = useState({
    student_id_number: initialMatricule || '',
    department_id: '',
    academic_year_id: '',
    certificat_prepa: null as File | null,
    quittance_rectorat: null as File | null,
    quittance_cap: null as File | null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialMatricule) {
      setFormData(prev => ({ ...prev, student_id_number: initialMatricule }))
    }
  }, [initialMatricule])

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const deps = await referenceDataService.getDepartments('ingenierie')
        const specialiteDeps = deps.filter(dept => !dept.abbreviation?.startsWith('P-'))
        setDepartments(specialiteDeps)
      } catch (err) {
        setError('Impossible de charger les départements')
      }
    }
    loadDepartments()
  }, [])

  useEffect(() => {
    const loadAcademicYears = async () => {
      if (formData.department_id) {
        try {
          const years = await referenceDataService.getAcademicYearsForDepartment(parseInt(formData.department_id))
          setAcademicYears(years)
        } catch (err) {
          console.error('Erreur chargement années académiques:', err)
        }
      } else {
        setAcademicYears([])
      }
    }
    loadAcademicYears()
  }, [formData.department_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, [name]: file }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.student_id_number.trim()) newErrors.student_id_number = 'Le matricule étudiant est requis'
    if (!formData.department_id) newErrors.department_id = 'La filière est requise'
    if (!formData.academic_year_id) newErrors.academic_year_id = 'L\'année académique est requise'
    if (!formData.certificat_prepa) newErrors.certificat_prepa = 'Le certificat de prépa est requis'
    if (!formData.quittance_rectorat) newErrors.quittance_rectorat = 'La quittance du rectorat est requise'
    if (!formData.quittance_cap) newErrors.quittance_cap = 'La quittance du CAP est requise'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      setError(null)

      const submitData = new FormData()
      submitData.append('student_id_number', formData.student_id_number)
      submitData.append('department_id', formData.department_id)
      submitData.append('academic_year_id', formData.academic_year_id)
      if (formData.certificat_prepa) submitData.append('certificat_prepa', formData.certificat_prepa)
      if (formData.quittance_rectorat) submitData.append('quittance_rectorat', formData.quittance_rectorat)
      if (formData.quittance_cap) submitData.append('quittance_cap', formData.quittance_cap)

      const response = await enrollmentService.submitIngenieurSpecialite(submitData)
      const trackingCode = response.tracking_code || response.data?.tracking_code || 'CODE-PENDING'
      
      setSuccess(`✅ Candidature soumise avec succès ! Votre code de suivi : ${trackingCode}. Une notification de confirmation vous a été envoyée par email.`)
      setTimeout(() => onCancel(), 3000)
    } catch (err: any) {
      console.error('Erreur soumission:', err)
      
      // Extraire les erreurs de validation par champ
      const validationErrors = parseValidationErrors(err)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
      }
      
      // Afficher le message d'erreur général
      setError(parseApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Candidature Ingénieur - Spécialité</h3>
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
          <strong>Réservé aux étudiants ayant validé la classe préparatoire.</strong>
          Vous devez avoir un matricule étudiant CAP et votre certificat de réussite en prépa.
        </p>
      </div>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Matricule étudiant CAP *</label>
            <div className="flex gap-2">
              <input type="text" name="student_id_number" placeholder="Ex: CAP2024-001"
                value={formData.student_id_number} onChange={handleChange} required
                className={`flex-1 px-3 py-2 border rounded-lg ${errors.student_id_number ? 'border-red-500' : 'border-gray-300'}`} />
              {onRequestMatricule && (
                <button type="button" onClick={onRequestMatricule} title="Je ne connais pas mon matricule"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
              )}
            </div>
            {errors.student_id_number && <p className="text-red-500 text-sm mt-1">{errors.student_id_number}</p>}
            <small className="text-gray-600">Votre matricule reçu lors de votre inscription en prépa</small>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filière de spécialité *</label>
            <select name="department_id" value={formData.department_id} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg ${errors.department_id ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Sélectionner</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.title} {dept.abbreviation ? `(${dept.abbreviation})` : ''}
                </option>
              ))}
            </select>
            {errors.department_id && <p className="text-red-500 text-sm mt-1">{errors.department_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Année académique *</label>
            <select name="academic_year_id" value={formData.academic_year_id} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg ${errors.academic_year_id ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Sélectionner</option>
              {academicYears.map(year => (
                <option key={year.id} value={year.id}>{year.academic_year}</option>
              ))}
            </select>
            {errors.academic_year_id && <p className="text-red-500 text-sm mt-1">{errors.academic_year_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Certificat de Classes Préparatoires *</label>
            <input type="file" name="certificat_prepa" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required
              className={`w-full px-3 py-2 border rounded-lg ${errors.certificat_prepa ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.certificat_prepa && <p className="text-red-500 text-sm mt-1">{errors.certificat_prepa}</p>}
            <small className="text-gray-600">Format: PDF, JPG, PNG (max 5MB)</small>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quittance du Rectorat *</label>
            <input type="file" name="quittance_rectorat" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required
              className={`w-full px-3 py-2 border rounded-lg ${errors.quittance_rectorat ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.quittance_rectorat && <p className="text-red-500 text-sm mt-1">{errors.quittance_rectorat}</p>}
            <small className="text-gray-600">Preuve de paiement des frais de dossier</small>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quittance du CAP *</label>
            <input type="file" name="quittance_cap" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required
              className={`w-full px-3 py-2 border rounded-lg ${errors.quittance_cap ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.quittance_cap && <p className="text-red-500 text-sm mt-1">{errors.quittance_cap}</p>}
            <small className="text-gray-600">Preuve de paiement des frais d'inscription</small>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={loading}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50">
            Annuler
          </button>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Soumettre la candidature
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
