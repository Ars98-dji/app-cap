import { useState, useEffect } from 'react'
import { defenseService } from '../../services/defenseService'
import { referenceDataService } from '../../services/referenceDataService'
import type { QuitusData, Professor, Grade } from '../../services/defenseService'
import type { Department } from '../../services/types'

const QuitusMemoire = () => {
  const [formData, setFormData] = useState<QuitusData>({
    nom: '',
    prenom: '',
    titre: '',
    diplome: '',
    nometu: '',
    prenometu: '',
    grade: '',
    filiere: '',
    intitule: '',
  })
  const [professors, setProfessors] = useState<Professor[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedProfessor, setSelectedProfessor] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [profs, grds, depts] = await Promise.all([
        defenseService.getProfessors(),
        defenseService.getGrades(),
        referenceDataService.getDepartments(),
      ])
      setProfessors(profs)
      setGrades(grds)
      setDepartments(depts)
    } catch (err) {
      console.error('Erreur chargement données:', err)
    }
  }

  const handleProfessorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profId = e.target.value
    setSelectedProfessor(profId)
    if (profId) {
      const prof = professors.find(p => p.id.toString() === profId)
      if (prof) {
        setFormData({
          ...formData,
          nom: prof.last_name,
          prenom: prof.first_name,
          grade: prof.grade?.name || '',
        })
        setShowManualInput(false)
      }
    }
  }

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
      const dataToSend = { ...formData }
      if (!dataToSend.titre) {
        dataToSend.titre = 'Dr'
      }
      const blob = await defenseService.generateQuitus(dataToSend)
      defenseService.downloadPdf(blob, 'quitus.pdf')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération du quitus')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-6 md:p-8">
        <h3 className="text-2xl font-bold text-text-main dark:text-white mb-6">Générer un Quitus de Mémoire</h3>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600">error</span>
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h5 className="text-lg font-semibold text-text-main dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">person_badge</span>
                Informations du Superviseur
              </h5>
          
              {!showManualInput ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
                      Rechercher le professeur *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-background-dark text-text-main dark:text-white"
                      value={selectedProfessor}
                      onChange={handleProfessorChange}
                    >
                      <option value="">Sélectionner un professeur</option>
                      {professors.map(prof => (
                        <option key={prof.id} value={prof.id}>
                          {prof.first_name} {prof.last_name}{prof.grade ? ` - ${prof.grade.name}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                    onClick={() => setShowManualInput(true)}
                  >
                    <span className="material-symbols-outlined text-base">add_circle</span>
                    Le professeur n'est pas dans la liste
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="mb-4 text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                    onClick={() => {
                      setShowManualInput(false)
                      setFormData({ ...formData, nom: '', prenom: '', grade: '' })
                    }}
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Retour à la recherche
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Titre *</label>
                      <select name="titre" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.titre} onChange={handleChange} required>
                        <option value="">Sélectionner</option>
                        <option value="Dr">Dr</option>
                        <option value="Pr">Pr</option>
                        <option value="M.">M.</option>
                        <option value="Mme">Mme</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Nom *</label>
                      <input type="text" name="nom" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.nom} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Prénom *</label>
                      <input type="text" name="prenom" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.prenom} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Grade *</label>
                      <select name="grade" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.grade} onChange={handleChange} required>
                        <option value="">Sélectionner un grade</option>
                        {grades.map(grade => (
                          <option key={grade.id} value={grade.name}>{grade.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div>
              <h5 className="text-lg font-semibold text-text-main dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">person</span>
                Informations de l'Étudiant
              </h5>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Nom de l'étudiant *</label>
                  <input type="text" name="nometu" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.nometu} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Prénom de l'étudiant *</label>
                  <input type="text" name="prenometu" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.prenometu} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Diplôme *</label>
                  <select name="diplome" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.diplome} onChange={handleChange} required>
                    <option value="">Sélectionner</option>
                    <option value="Licence Professionnelle">Licence Professionnelle</option>
                    <option value="Master">Master</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Filière *</label>
                  <select name="filiere" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" value={formData.filiere} onChange={handleChange} required>
                    <option value="">Sélectionner une filière</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Intitulé du mémoire *</label>
            <textarea name="intitule" className="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-background-dark text-text-main dark:text-white" rows={4} placeholder="Saisissez le titre complet du mémoire..." value={formData.intitule} onChange={handleChange} required></textarea>
          </div>

          <div className="mt-8">
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <>
                  <span className="animate-spin material-symbols-outlined">progress_activity</span>
                  Génération en cours...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                  Générer le Quitus
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuitusMemoire
