import { useState, useEffect } from 'react'
import { defenseService } from '../../services/defenseService'
import { referenceDataService } from '../../services/referenceDataService'
import type { DefenseSubmissionData, Professor } from '../../services/defenseService'
import type { Department } from '../../services/types'

const DepotMemoire = () => {
  const [formData, setFormData] = useState({
    last_name: '',
    first_names: '',
    email: '',
    contact1: '',
    contact2: '',
    student_id_number: '',
    thesis_title: '',
    professor_id: '',
    defense_type: 'licence' as 'licence' | 'master',
    department_id: '',
  })

  const [files, setFiles] = useState({
    thesis_file: null as File | null,
    additional_files: [] as File[],
  })

  const [departments, setDepartments] = useState<Department[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [selectedProfessor, setSelectedProfessor] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [depts, profs] = await Promise.all([
        referenceDataService.getDepartments(),
        defenseService.getProfessors(),
      ])
      setDepartments(depts)
      setProfessors(profs)
    } catch (err) {
      console.error('Erreur chargement données:', err)
    }
  }

  const handleProfessorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profId = e.target.value
    setSelectedProfessor(profId)
    if (profId) {
      setFormData({ ...formData, professor_id: profId })
    } else {
      setFormData({ ...formData, professor_id: '' })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target
    if (name === 'thesis_file' && fileList && fileList[0]) {
      setFiles({ ...files, thesis_file: fileList[0] })
    } else if (name === 'additional_files' && fileList) {
      setFiles({ ...files, additional_files: Array.from(fileList) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!files.thesis_file) {
      setError('Le fichier du mémoire est requis')
      setLoading(false)
      return
    }

    try {
      const contacts = [formData.contact1]
      if (formData.contact2) contacts.push(formData.contact2)

      const professorId = showManualInput 
        ? formData.professor_id 
        : (formData.professor_id ? parseInt(formData.professor_id) : undefined)

      const submissionData: DefenseSubmissionData = {
        last_name: formData.last_name,
        first_names: formData.first_names,
        email: formData.email,
        contacts,
        student_id_number: formData.student_id_number || undefined,
        thesis_title: formData.thesis_title,
        professor_id: professorId,
        defense_type: formData.defense_type,
        department_id: parseInt(formData.department_id),
        thesis_file: files.thesis_file,
        additional_files: files.additional_files.length > 0 ? files.additional_files : undefined,
      }

      await defenseService.submitDefense(submissionData)
      setSuccess('Votre dossier a été soumis avec succès! Vous recevrez un email de confirmation.')
      
      // Reset form
      setFormData({
        last_name: '',
        first_names: '',
        email: '',
        contact1: '',
        contact2: '',
        student_id_number: '',
        thesis_title: '',
        professor_id: '',
        defense_type: 'licence',
        department_id: '',
      })
      setFiles({ thesis_file: null, additional_files: [] })
      setSelectedProfessor('')
      setShowManualInput(false)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la soumission du dossier')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-6 md:p-8">
        <h3 className="text-2xl font-bold text-text-main dark:text-white mb-6">Soumettre votre Dossier de Soutenance</h3>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600">error</span>
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <span className="material-symbols-outlined text-red-600">close</span>
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-green-600">check_circle</span>
            <span className="text-green-800 dark:text-green-200">{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <span className="material-symbols-outlined text-green-600">close</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h5 className="text-lg font-semibold text-text-main dark:text-white mb-4">Informations Personnelles</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Nom *</label>
                <input type="text" name="last_name" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.last_name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Prénoms *</label>
                <input type="text" name="first_names" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.first_names} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Email *</label>
                <input type="email" name="email" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Matricule (optionnel)</label>
                <input type="text" name="student_id_number" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.student_id_number} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Contact 1 *</label>
                <input type="tel" name="contact1" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.contact1} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Contact 2 (optionnel)</label>
                <input type="tel" name="contact2" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.contact2} onChange={handleChange} />
              </div>
            </div>
          </div>

          <hr className="border-border-light dark:border-border-dark" />

          <div>
            <h5 className="text-lg font-semibold text-text-main dark:text-white mb-4">Informations Académiques</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Type de soutenance *</label>
                <select name="defense_type" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.defense_type} onChange={handleChange} required>
                  <option value="licence">Licence Professionnelle</option>
                  <option value="master">Master</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Filière *</label>
                <select name="department_id" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.department_id} onChange={handleChange} required>
                  <option value="">Sélectionner une filière</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.title} ({typeof dept.cycle === 'string' ? dept.cycle : (dept.cycle?.name || 'N/A')})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Encadreur *</label>
              {!showManualInput ? (
                <>
                  <select
                    className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white"
                    value={selectedProfessor}
                    onChange={handleProfessorChange}
                  >
                    <option value="">Rechercher un encadreur...</option>
                    {professors.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.first_name} {prof.last_name}{prof.grade ? ` - ${prof.grade.name}` : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="mt-2 text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                    onClick={() => setShowManualInput(true)}
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    L'encadreur n'est pas dans la liste
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="professor_id"
                    className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white"
                    placeholder="Nom complet de l'encadreur"
                    value={formData.professor_id}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="mt-2 text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                    onClick={() => {
                      setShowManualInput(false)
                      setFormData({ ...formData, professor_id: '' })
                      setSelectedProfessor('')
                    }}
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Retour à la recherche
                  </button>
                </>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Titre du mémoire *</label>
              <textarea name="thesis_title" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" rows={3} value={formData.thesis_title} onChange={handleChange} required></textarea>
            </div>
          </div>

          <hr className="border-border-light dark:border-border-dark" />

          <div>
            <h5 className="text-lg font-semibold text-text-main dark:text-white mb-4">Documents</h5>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                  Fichier du mémoire (PDF, max 10 Mo) *
                </label>
                <input type="file" name="thesis_file" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" accept=".pdf" onChange={handleFileChange} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                  Fichiers supplémentaires (optionnel)
                </label>
                <input type="file" name="additional_files" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" accept=".pdf,.doc,.docx" multiple onChange={handleFileChange} />
                <p className="mt-1 text-sm text-text-secondary">PDF, DOC, DOCX - Max 5 Mo par fichier</p>
              </div>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin material-symbols-outlined">progress_activity</span>
                  Soumission en cours...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">upload</span>
                  Soumettre le Dossier
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DepotMemoire
