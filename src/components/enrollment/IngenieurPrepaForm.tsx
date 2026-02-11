import { useState, useEffect } from 'react'
import { enrollmentService, referenceDataService } from '@/services'
import { ErrorMessage, SuccessMessage, LoadingSpinner, PhotoUploadField } from '@/components/common'
import { parseApiError, parseValidationErrors } from '@/utils/errorParser'
import type { EntryDiploma, Department, AcademicYear } from '@/services/types'

interface IngenieurPrepaFormProps {
  onCancel: () => void
}

export const IngenieurPrepaForm = ({ onCancel }: IngenieurPrepaFormProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [photoValidated, setPhotoValidated] = useState(false)

  // Reference data
  const [entryDiplomas, setEntryDiplomas] = useState<EntryDiploma[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])

  // Form data
  const [formData, setFormData] = useState({
    last_name: '',
    first_names: '',
    email: '',
    birth_date: '',
    birth_place: '',
    birth_country: 'Bénin',
    gender: '',
    contacts: [''],
    study_level: '',
    entry_diploma_id: '',
    department_id: '',
    academic_year_id: '',
    photo: null as File | null,
    demande_da: null as File | null,
    cv: null as File | null,
    acte_naissance: null as File | null,
    diplome_bac: null as File | null,
    diplome_licence: null as File | null,
    attestation_travail: null as File | null,
    quittance_cap: null as File | null,
    attestation_depot_dossier: null as File | null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        console.log('🔍 [IngenieurPrepa] Chargement des départements...')
        const [diplomas, deps] = await Promise.all([
          referenceDataService.getEntryDiplomas(),
          referenceDataService.getDepartments('ingenierie')
        ])
        console.log('📦 [IngenieurPrepa] Départements reçus:', deps)
        console.log('📦 [IngenieurPrepa] Nombre total:', deps.length)
        
        setEntryDiplomas(diplomas)
        
        // Filtrer uniquement les départements Prépa (P-GC, P-GT, P-GE, P-GME)
        const prepaDeps = deps.filter(dept => {
          const isPrepa = dept.abbreviation?.startsWith('P-')
          console.log(`   - ${dept.abbreviation} (${dept.name}): Prépa=${isPrepa}`)
          return isPrepa
        })
        
        console.log('✅ [IngenieurPrepa] Départements Prépa filtrés:', prepaDeps)
        console.log('✅ [IngenieurPrepa] Nombre après filtrage:', prepaDeps.length)
        
        setDepartments(prepaDeps)
      } catch (err) {
        console.error('❌ [IngenieurPrepa] Erreur:', err)
        setError('Impossible de charger les données de référence')
      }
    }
    loadReferenceData()
  }, [])

  // Load academic years when department is selected
  useEffect(() => {
    const loadAcademicYears = async () => {
      if (formData.department_id) {
        try {
          const years = await referenceDataService.getAcademicYearsForDepartment(
            parseInt(formData.department_id)
          )
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

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: 'person' },
    { number: 2, title: 'Informations académiques', icon: 'school' },
    { number: 3, title: 'Documents', icon: 'description' },
    { number: 4, title: 'Confirmation', icon: 'check_circle' }
  ]

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
  }

  const handlePhotoChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, photo: file }))
    setPhotoValidated(!!file)
    if (errors.photo) {
      setErrors(prev => ({ ...prev, photo: '' }))
    }
  }

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...formData.contacts]
    newContacts[index] = value
    setFormData(prev => ({ ...prev, contacts: newContacts }))
  }

  const addContact = () => {
    setFormData(prev => ({ ...prev, contacts: [...prev.contacts, ''] }))
  }

  const removeContact = (index: number) => {
    if (formData.contacts.length > 1) {
      const newContacts = formData.contacts.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, contacts: newContacts }))
    }
  }

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis'
    if (!formData.first_names.trim()) newErrors.first_names = 'Les prénoms sont requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    if (!formData.birth_date) newErrors.birth_date = 'La date de naissance est requise'
    if (!formData.birth_place.trim()) newErrors.birth_place = 'Le lieu de naissance est requis'
    if (!formData.gender) newErrors.gender = 'Le genre est requis'
    if (formData.contacts.every(c => !c.trim())) newErrors.contacts = 'Au moins un contact est requis'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.study_level) newErrors.study_level = 'Le niveau d\'étude est requis'
    if (!formData.entry_diploma_id) newErrors.entry_diploma_id = 'Le diplôme d\'entrée est requis'
    if (!formData.department_id) newErrors.department_id = 'La filière est requise'
    if (!formData.academic_year_id) newErrors.academic_year_id = 'L\'année académique est requise'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (formData.photo && !photoValidated) {
      newErrors.photo = 'La photo d\'identité doit être validée'
    }
    if (!formData.demande_da) newErrors.demande_da = 'La demande DA est requise'
    if (!formData.cv) newErrors.cv = 'Le CV est requis'
    if (!formData.acte_naissance) newErrors.acte_naissance = 'L\'acte de naissance est requis'
    if (!formData.diplome_bac) newErrors.diplome_bac = 'Le diplôme du bac est requis'
    if (!formData.diplome_licence) newErrors.diplome_licence = 'Le diplôme de licence est requis'
    if (!formData.attestation_travail) newErrors.attestation_travail = 'L\'attestation de travail est requise'
    if (!formData.quittance_cap) newErrors.quittance_cap = 'La quittance CAP est requise'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = false
    if (currentStep === 1) isValid = validateStep1()
    else if (currentStep === 2) isValid = validateStep2()
    else if (currentStep === 3) isValid = validateStep3()
    if (isValid) setCurrentStep(prev => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const validateAllSteps = (): boolean => {
    return validateStep1() && validateStep2() && validateStep3()
  }

  const handleSubmit = async () => {
    if (!validateAllSteps()) {
      setError('Veuillez remplir tous les champs requis')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'contacts') {
          const contactList = Array.isArray(value) ? value : [value]
          contactList.filter((c): c is string => typeof c === 'string' && c.trim() !== '').forEach(contact => {
            submitData.append('contacts[]', contact)
          })
        } else if (value instanceof File) {
          submitData.append(key, value)
        } else if (value !== null && value !== undefined && value !== '') {
          submitData.append(key, String(value))
        }
      })

      const response = await enrollmentService.submitIngenieurPrepa(submitData)
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

  const renderStep1 = () => (
    <div className="space-y-4">
      <h5 className="text-lg font-semibold mb-4">Informations personnelles</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom *</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prénoms *</label>
          <input type="text" name="first_names" value={formData.first_names} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.first_names ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.first_names && <p className="text-red-500 text-sm mt-1">{errors.first_names}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Genre *</label>
          <select name="gender" value={formData.gender} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Sélectionner</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date de naissance *</label>
          <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-lg ${errors.birth_date ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lieu de naissance *</label>
          <input type="text" name="birth_place" value={formData.birth_place} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.birth_place ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.birth_place && <p className="text-red-500 text-sm mt-1">{errors.birth_place}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Pays de naissance *</label>
          <input type="text" name="birth_country" value={formData.birth_country} onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg border-gray-300" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Contacts *</label>
          {formData.contacts.map((contact, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" value={contact} onChange={(e) => handleContactChange(index, e.target.value)}
                placeholder="+229 XX XX XX XX" className="flex-1 px-3 py-2 border rounded-lg border-gray-300" />
              {formData.contacts.length > 1 && (
                <button type="button" onClick={() => removeContact(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addContact}
            className="text-sm text-primary hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Ajouter un contact
          </button>
          {errors.contacts && <p className="text-red-500 text-sm mt-1">{errors.contacts}</p>}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <h5 className="text-lg font-semibold mb-4">Informations académiques</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Niveau d'étude *</label>
          <select name="study_level" value={formData.study_level} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.study_level ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Sélectionner</option>
            <option value="1">1ère année Prépa</option>
          </select>
          {errors.study_level && <p className="text-red-500 text-sm mt-1">{errors.study_level}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Diplôme d'entrée *</label>
          <select name="entry_diploma_id" value={formData.entry_diploma_id} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.entry_diploma_id ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Sélectionner</option>
            {entryDiplomas.map(diploma => (
              <option key={diploma.id} value={diploma.id}>{diploma.name}</option>
            ))}
          </select>
          {errors.entry_diploma_id && <p className="text-red-500 text-sm mt-1">{errors.entry_diploma_id}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Filière *</label>
          <select name="department_id" value={formData.department_id} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.department_id ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Sélectionner</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.title || dept.name} {dept.abbreviation ? `(${dept.abbreviation})` : ''}
              </option>
            ))}
          </select>
          {errors.department_id && <p className="text-red-500 text-sm mt-1">{errors.department_id}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Année académique *</label>
          <select name="academic_year_id" value={formData.academic_year_id} onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.academic_year_id ? 'border-red-500' : 'border-gray-300'}`}>
            <option value="">Sélectionner</option>
            {academicYears.map(year => (
              <option key={year.id} value={year.id}>{year.academic_year}</option>
            ))}
          </select>
          {errors.academic_year_id && <p className="text-red-500 text-sm mt-1">{errors.academic_year_id}</p>}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <h5 className="text-lg font-semibold mb-4">Documents requis</h5>
      <p className="text-sm text-gray-600 mb-4">Formats acceptés: PDF, JPG, PNG (max 5MB)</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PhotoUploadField
          name="photo"
          label="Photo d'identité"
          value={formData.photo}
          onChange={handlePhotoChange}
          error={errors.photo}
          disabled={loading}
        />
        <div>
          <label className="block text-sm font-medium mb-1">Lettre de Demande *</label>
          <input type="file" name="demande_da" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.demande_da ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.demande_da && <p className="text-red-500 text-sm mt-1">{errors.demande_da}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CV *</label>
          <input type="file" name="cv" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.cv ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.cv && <p className="text-red-500 text-sm mt-1">{errors.cv}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Acte de naissance *</label>
          <input type="file" name="acte_naissance" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.acte_naissance ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.acte_naissance && <p className="text-red-500 text-sm mt-1">{errors.acte_naissance}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Diplôme Baccalauréat *</label>
          <input type="file" name="diplome_bac" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.diplome_bac ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.diplome_bac && <p className="text-red-500 text-sm mt-1">{errors.diplome_bac}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Diplôme Licence *</label>
          <input type="file" name="diplome_licence" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.diplome_licence ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.diplome_licence && <p className="text-red-500 text-sm mt-1">{errors.diplome_licence}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Attestation de travail *</label>
          <input type="file" name="attestation_travail" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.attestation_travail ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.attestation_travail && <p className="text-red-500 text-sm mt-1">{errors.attestation_travail}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quittance CAP *</label>
          <input type="file" name="quittance_cap" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.quittance_cap ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.quittance_cap && <p className="text-red-500 text-sm mt-1">{errors.quittance_cap}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Attestation dépôt dossier (optionnel)</label>
          <input type="file" name="attestation_depot_dossier" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg border-gray-300" />
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-4">
      <h5 className="text-lg font-semibold mb-4">Confirmation</h5>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
        <p className="text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">info</span>
          Veuillez vérifier vos informations avant de soumettre
        </p>
      </div>
      <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-4">
        <h6 className="font-semibold mb-2">Informations personnelles</h6>
        <p><strong>Nom:</strong> {formData.last_name} {formData.first_names}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Contacts:</strong> {formData.contacts.filter(c => c.trim()).join(', ')}</p>
      </div>
      <div className="flex items-start gap-2">
        <input type="checkbox" id="confirmTerms" required className="mt-1" />
        <label htmlFor="confirmTerms" className="text-sm">
          J'atteste que toutes les informations fournies sont exactes
        </label>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      default: return null
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Candidature Ingénieur - Prépa</h3>
        <button onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">close</span>
            Annuler
          </span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" style={{ zIndex: 0 }}>
            <div className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
          </div>
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center" style={{ flex: 1, zIndex: 1 }}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                ${currentStep >= step.number ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark border-2 border-gray-300'}`}>
                <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
              </div>
              <small className={`text-center ${currentStep >= step.number ? 'text-primary font-semibold' : 'text-gray-500'}`}>
                {step.title}
              </small>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      {loading && <LoadingSpinner />}

      {/* Form content */}
      <div className="mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button type="button" onClick={handlePrevious} disabled={currentStep === 1 || loading}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Précédent
          </span>
        </button>
        {currentStep < 4 ? (
          <button type="button" onClick={handleNext}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <span className="flex items-center gap-2">
              Suivant
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </span>
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Soumettre
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
