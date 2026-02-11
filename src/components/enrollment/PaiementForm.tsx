import { useState, useEffect } from 'react'
import { ErrorMessage, SuccessMessage, LoadingSpinner, ReceiptUploadField } from '@/components/common'
import { paymentService, type StudentInfo } from '@/services/paymentService'
import type { ExtractionResult } from '@/services/receiptExtractionService'

interface PaiementFormProps {
  onCancel: () => void
  onRequestMatricule?: () => void
  initialMatricule?: string | null
}

export const PaiementForm = ({ onCancel, onRequestMatricule, initialMatricule }: PaiementFormProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [quittanceFile, setQuittanceFile] = useState<File | null>(null)
  const [quittanceData, setQuittanceData] = useState({
    montant: '',
    reference: '',
    date_versement: '',
    numero_compte: '01711043903',
    motif: '',
  })
  const [dataExtracted, setDataExtracted] = useState(false)
  const [fieldsLocked, setFieldsLocked] = useState(false)

  const [studentData, setStudentData] = useState({
    matricule: initialMatricule || '',
    email: '',
    contact: '',
    nom: '',
    prenoms: '',
    filiere_id: '',
  })
  const [availableFilieres, setAvailableFilieres] = useState<Array<{ id: number; nom: string }>>([])
  const [studentFound, setStudentFound] = useState(false)
  const [loadingStudent, setLoadingStudent] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Charger les infos de l'étudiant au montage si initialMatricule est fourni
  useEffect(() => {
    if (initialMatricule) {
      loadStudentInfo(initialMatricule)
    }
  }, [initialMatricule])

  // Fonction pour charger les infos de l'étudiant
  const loadStudentInfo = async (matricule: string) => {
    if (matricule.length < 5) {
      setStudentFound(false)
      setAvailableFilieres([])
      return
    }

    try {
      setLoadingStudent(true)
      const studentInfo: StudentInfo | null = await paymentService.getStudentInfo(matricule)
      
      if (studentInfo) {
        setStudentFound(true)
        setStudentData(prev => ({
          ...prev,
          matricule,
          email: studentInfo.email || prev.email,
          contact: studentInfo.tel || prev.contact,
          nom: studentInfo.nom || '',
          prenoms: studentInfo.prenoms || '',
          filiere_id: '',
        }))
        
        setAvailableFilieres(studentInfo.filieres || [])
        
        if (studentInfo.has_no_filieres) {
          setError('Aucune filière associée à ce matricule. Vous devez d\'abord soumettre une candidature.')
        }
      } else {
        setStudentFound(false)
        setAvailableFilieres([])
      }
    } catch (err) {
      console.error('Erreur chargement étudiant:', err)
      setStudentFound(false)
      setAvailableFilieres([])
    } finally {
      setLoadingStudent(false)
    }
  }

  const handleQuittanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setQuittanceData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Si c'est le matricule, charger les infos automatiquement
    if (name === 'matricule') {
      setStudentData(prev => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
      loadStudentInfo(value)
    } else {
      setStudentData(prev => ({ ...prev, [name]: value }))
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    }
  }

  const handleQuittanceUpload = (file: File | null, extractedData?: ExtractionResult) => {
    setQuittanceFile(file)
    
    // Si des données ont été extraites, les utiliser pour pré-remplir le formulaire
    if (extractedData) {
      setQuittanceData(prev => ({
        ...prev,
        montant: extractedData.montant || prev.montant,
        reference: extractedData.reference || prev.reference,
        date_versement: extractedData.date_versement || prev.date_versement,
        numero_compte: extractedData.numero_compte || prev.numero_compte,
        motif: extractedData.motif || prev.motif,
      }))
      setDataExtracted(true)
      setFieldsLocked(true)
    } else {
      setDataExtracted(false)
      setFieldsLocked(false)
    }
  }

  const handleUnlockFields = () => {
    setFieldsLocked(false)
  }

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!quittanceFile) newErrors.quittance = 'La quittance est requise'
    if (!quittanceData.reference.trim()) newErrors.reference = 'La référence est requise'
    if (!quittanceData.numero_compte.trim()) {
      newErrors.numero_compte = 'Le numéro de compte est requis'
    } else if (quittanceData.numero_compte.trim() !== '01711043903') {
      newErrors.numero_compte = 'Le numéro de compte doit être 01711043903 (compte officiel de l\'établissement)'
    }
    if (!quittanceData.motif.trim()) newErrors.motif = 'Le motif est requis'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!studentData.matricule.trim()) newErrors.matricule = 'Le matricule est requis'
    if (!studentData.email.trim()) newErrors.email = 'L\'email est requis'
    if (!studentData.contact.trim()) newErrors.contact = 'Le contact est requis'
    if (availableFilieres.length > 0 && !studentData.filiere_id) {
      newErrors.filiere_id = 'Veuillez sélectionner une filière'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2() || !quittanceFile) return

    try {
      setLoading(true)
      setError(null)

      // Note: In production, this would call paymentService.submitPayment()
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(`✅ Paiement validé avec succès ! Référence : ${quittanceData.reference}. Une notification de confirmation vous a été envoyée par email.`)
      setTimeout(() => onCancel(), 3000)
    } catch (err: any) {
      setError(err.message || 'Impossible de soumettre le paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Paiement de la scolarité</h3>
        <button onClick={onCancel} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">close</span>
            Annuler
          </span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-primary' : 'text-gray-500'}`}>
            1. Détails versement
          </span>
          <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-primary' : 'text-gray-500'}`}>
            2. Informations étudiant
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}></div>
        </div>
      </div>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      {loading && <LoadingSpinner />}

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-4">
            <h5 className="text-lg font-semibold mb-4">Détails sur le versement</h5>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">info</span>
                Téléchargez votre quittance. Les informations seront extraites automatiquement.
              </p>
            </div>

            {dataExtracted && fieldsLocked && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <strong>Vérifiez toujours l'exactitude des informations avant soumission.</strong>
                </p>
                <button
                  type="button"
                  onClick={handleUnlockFields}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Apporter des corrections à l'extraction
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <ReceiptUploadField
                  name="quittance"
                  label="Quittance de paiement"
                  required
                  value={quittanceFile}
                  onChange={handleQuittanceUpload}
                  error={errors.quittance}
                  disabled={loading}
                  showExtraction={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Montant (FCFA)</label>
                <input type="number" name="montant" placeholder="50000"
                  value={quittanceData.montant} onChange={handleQuittanceChange}
                  disabled={fieldsLocked}
                  className={`w-full px-3 py-2 border rounded-lg border-gray-300 ${fieldsLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Référence du paiement *</label>
                <input type="text" name="reference" placeholder="REF-2025-001"
                  value={quittanceData.reference} onChange={handleQuittanceChange} required
                  disabled={fieldsLocked}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.reference ? 'border-red-500' : 'border-gray-300'} ${fieldsLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                {errors.reference && <p className="text-red-500 text-sm mt-1">{errors.reference}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Numéro de compte * <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">01711043903</span>
                </label>
                <input type="text" name="numero_compte" placeholder="01711043903"
                  value={quittanceData.numero_compte} onChange={handleQuittanceChange} required
                  disabled={fieldsLocked}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.numero_compte ? 'border-red-500' : 'border-gray-300'} ${fieldsLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                {errors.numero_compte && <p className="text-red-500 text-sm mt-1">{errors.numero_compte}</p>}
                <small className="text-blue-600">Utilisez uniquement le compte officiel de l'établissement</small>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date de versement</label>
                <input type="date" name="date_versement"
                  value={quittanceData.date_versement} onChange={handleQuittanceChange}
                  disabled={fieldsLocked}
                  className={`w-full px-3 py-2 border rounded-lg border-gray-300 ${fieldsLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Payeur et Motif *</label>
                <input type="text" name="motif" placeholder="KOUADIO Jean - Scolarité L1"
                  value={quittanceData.motif} onChange={handleQuittanceChange} required
                  disabled={fieldsLocked}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.motif ? 'border-red-500' : 'border-gray-300'} ${fieldsLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
                {errors.motif && <p className="text-red-500 text-sm mt-1">{errors.motif}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={onCancel} disabled={loading}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50">
                Annuler
              </button>
              <button type="button" onClick={handleNext}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                <span className="flex items-center gap-2">
                  Suivant
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h5 className="text-lg font-semibold mb-4">Information sur l'étudiant</h5>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">info</span>
                Entrez votre matricule. Vos informations seront chargées automatiquement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Matricule *</label>
                <div className="flex gap-2">
                  <input type="text" name="matricule" placeholder="202300001"
                    value={studentData.matricule} onChange={handleStudentChange} required
                    className={`flex-1 px-3 py-2 border rounded-lg ${errors.matricule ? 'border-red-500' : 'border-gray-300'}`} />
                  {onRequestMatricule && (
                    <button type="button" onClick={onRequestMatricule} title="Je ne connais pas mon matricule"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                      <span className="material-symbols-outlined text-[20px]">search</span>
                    </button>
                  )}
                </div>
                {errors.matricule && <p className="text-red-500 text-sm mt-1">{errors.matricule}</p>}
                <small className="text-gray-600">Votre matricule étudiant</small>
              </div>

              {loadingStudent && (
                <div className="md:col-span-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                    <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    Chargement des informations...
                  </div>
                </div>
              )}

              {!studentFound && studentData.matricule.length >= 5 && !loadingStudent && (
                <div className="md:col-span-2">
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm text-red-800 dark:text-red-200">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    Aucun étudiant trouvé avec ce matricule. Veuillez vérifier.
                  </div>
                </div>
              )}

              {studentFound && (
                <>
                  {studentData.nom && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Nom & Prénoms</label>
                      <input type="text" value={`${studentData.nom} ${studentData.prenoms}`} disabled
                        className="w-full px-3 py-2 border rounded-lg border-gray-300 bg-gray-100 cursor-not-allowed" />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input type="email" name="email" placeholder="email@example.com"
                      value={studentData.email} onChange={handleStudentChange} required
                      className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    <small className="text-gray-600">Modifiable</small>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Contact *</label>
                    <input type="tel" name="contact" placeholder="0707070707"
                      value={studentData.contact} onChange={handleStudentChange} required
                      className={`w-full px-3 py-2 border rounded-lg ${errors.contact ? 'border-red-500' : 'border-gray-300'}`} />
                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                    <small className="text-gray-600">Modifiable</small>
                  </div>

                  {availableFilieres.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Filière *</label>
                      <select name="filiere_id" value={studentData.filiere_id}
                        onChange={(e) => {
                          setStudentData(prev => ({ ...prev, filiere_id: e.target.value }))
                          if (errors.filiere_id) {
                            setErrors(prev => ({ ...prev, filiere_id: '' }))
                          }
                        }}
                        required
                        className={`w-full px-3 py-2 border rounded-lg ${errors.filiere_id ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="">Sélectionnez une filière</option>
                        {availableFilieres.map((filiere) => (
                          <option key={filiere.id} value={filiere.id}>
                            {filiere.nom}
                          </option>
                        ))}
                      </select>
                      {errors.filiere_id && <p className="text-red-500 text-sm mt-1">{errors.filiere_id}</p>}
                      <small className="text-gray-600">Choisissez la filière concernée par ce paiement</small>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button type="button" onClick={handleBack} disabled={loading}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Précédent
                </span>
              </button>
              <button type="submit" disabled={loading || !studentFound}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Soumettre le paiement
                </span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
