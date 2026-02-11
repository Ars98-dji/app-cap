import { useState } from 'react'
import { academicResultsService } from '../../services/academicResultsService'
import type { Student, AcademicYear, Results } from '../../services/academicResultsService'
import { ErrorMessage, WarningMessage } from '@/components/common'

const ResultatsAcademiques = () => {
  const [step, setStep] = useState<'search' | 'select' | 'results'>('search')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  
  const [matricule, setMatricule] = useState('')
  
  const [student, setStudent] = useState<Student | null>(null)
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  
  const [results, setResults] = useState<Results | null>(null)

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!matricule.trim()) {
      setError('Veuillez saisir votre matricule')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await academicResultsService.authenticate({
        student_id_number: matricule,
      })

      if (response.success) {
        setStudent(response.data.student)
        setAcademicYears(response.data.academic_years)
        setStep('select')
      } else {
        setError(response.message || 'Erreur lors de la recherche')
      }
    } catch (err: any) {
      console.error('Erreur authentification:', err)
      setError(err.message || 'Matricule introuvable')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectYear = async (yearId: number) => {
    setLoading(true)
    setError(null)
    setWarning(null)

    try {
      const response = await academicResultsService.getResults({
        student_id: student!.id,
        academic_year_id: yearId,
      })

      if (response.success) {
        setResults(response.data)
        setStep('results')
      } else {
        setError(response.message || 'Erreur lors de la récupération des résultats')
      }
    } catch (err: any) {
      // Détecter si c'est une erreur de scolarité (code 403)
      const errorMessage = err.message || 'Erreur lors de la récupération des résultats'
      
      if (err.response?.status === 403 || errorMessage.includes('scolarité') || errorMessage.includes('Solde restant')) {
        // Extraire le montant du message si présent
        const match = errorMessage.match(/Solde restant\s*:\s*([\d\s]+)\s*FCFA/)
        const amount = match ? match[1].trim() : null
        
        if (amount) {
          setWarning(errorMessage)
        } else {
          setWarning(errorMessage)
        }
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('search')
    setMatricule('')
    setStudent(null)
    setAcademicYears([])
    setResults(null)
    setError(null)
    setWarning(null)
  }

  const getGradeColor = (average: number): string => {
    if (average >= 16) return 'green'
    if (average >= 14) return 'blue'
    if (average >= 12) return 'indigo'
    if (average >= 10) return 'yellow'
    return 'red'
  }

  const getDecisionLabel = (decision: string | null): string => {
    if (!decision) return 'En attente'
    switch (decision) {
      case 'pass': return 'Admis(e)'
      case 'repeat': return 'Redouble'
      case 'fail': return 'Ajourné(e)'
      default: return decision
    }
  }

  const getDecisionColor = (decision: string | null): string => {
    if (!decision) return 'gray'
    switch (decision) {
      case 'pass': return 'green'
      case 'repeat': return 'yellow'
      case 'fail': return 'red'
      default: return 'gray'
    }
  }

  return (
    <div className="space-y-6">
      {/* Étape 1: Recherche par matricule */}
      {step === 'search' && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">assessment</span>
                Consultation des Résultats
              </h3>
              <p className="text-text-secondary dark:text-gray-400 mt-1">
                Accédez à vos notes et relevés académiques
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-main dark:text-gray-200 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                    Matricule étudiant
                  </span>
                </label>
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value.toUpperCase())}
                  placeholder="Ex: CAP2024001"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 focus:border-primary focus:ring focus:ring-primary/20 transition-all disabled:opacity-50"
                />
                <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
                  Saisissez votre matricule pour consulter vos résultats
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !matricule.trim()}
                className="w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    <span>Recherche...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">search</span>
                    <span>Consulter mes résultats</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

          {!error && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
              <h6 className="font-bold text-text-main dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Informations utiles
              </h6>
              <ul className="space-y-2 text-sm text-text-secondary dark:text-gray-400">
               {/*  <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
                  <span>Votre matricule vous a été fourni lors de votre inscription</span>
                </li> */}
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
                  <span>Les résultats sont mis à jour après chaque délibération</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] mt-0.5">check_circle</span>
                  <span>Contactez le service de scolarité si vous avez oublié votre matricule</span>
                </li>
              </ul>
            </div>
          )}
        </>
      )}

      {/* Étape 2: Sélection de l'année académique */}
      {step === 'select' && student && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">person</span>
                {student.first_names} {student.last_name}
              </h3>
              <p className="text-text-secondary dark:text-gray-400 mt-1">
                Matricule: {student.student_id_number}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Nouvelle recherche
            </button>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <h5 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">calendar_month</span>
              Sélectionnez une année académique
            </h5>

            {error && <ErrorMessage error={error} onClose={() => setError(null)} />}
            {warning && <WarningMessage message={warning} onClose={() => setWarning(null)} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {academicYears.map((year) => (
                <button
                  key={year.id}
                  onClick={() => handleSelectYear(year.id)}
                  disabled={loading}
                  className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-xl">school</span>
                    </div>
                    <div className="flex-1">
                      <h6 className="font-bold text-text-main dark:text-white mb-1">{year.label}</h6>
                      {year.level && (
                        <p className="text-sm text-text-secondary dark:text-gray-400">
                          <strong>Niveau:</strong> {year.level}
                        </p>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-purple-600">arrow_forward</span>
                  </div>
                </button>
              ))}
            </div>

            {loading && (
              <div className="text-center mt-6 py-4">
                <span className="material-symbols-outlined text-4xl text-purple-600 animate-spin">progress_activity</span>
                <p className="mt-2 text-text-secondary dark:text-gray-400">Chargement des résultats...</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Étape 3: Affichage des résultats */}
      {step === 'results' && results && student && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">person</span>
                {student.first_names} {student.last_name}
              </h3>
              <p className="text-text-secondary dark:text-gray-400 mt-1">
                Matricule: {student.student_id_number}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStep('select')}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Retour
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                Nouvelle recherche
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
              <h5 className="font-bold text-text-main dark:text-white mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined">school</span>
                Informations académiques
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-[18px]">calendar_today</span>
                  <div>
                    <p className="text-xs text-text-secondary dark:text-gray-400">Année</p>
                    <p className="font-semibold text-text-main dark:text-white">{results.academic_info.academic_year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-[18px]">stairs</span>
                  <div>
                    <p className="text-xs text-text-secondary dark:text-gray-400">Niveau</p>
                    <p className="font-semibold text-text-main dark:text-white">{results.academic_info.level}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé */}
            <h5 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">summarize</span>
              Résumé des résultats
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-surface-dark">
                <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Moyenne Générale</p>
                <p className={`text-3xl font-bold text-${getGradeColor(results.summary.general_average)}-600 dark:text-${getGradeColor(results.summary.general_average)}-400`}>
                  {results.summary.general_average.toFixed(2)}/20
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-surface-dark">
                <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Crédits Obtenus</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {results.summary.obtained_credits}/{results.summary.total_credits}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border-light dark:border-border-dark bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-surface-dark">
                <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Décision Annuelle</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-${getDecisionColor(results.summary.year_decision)}-100 dark:bg-${getDecisionColor(results.summary.year_decision)}-900/20 text-${getDecisionColor(results.summary.year_decision)}-700 dark:text-${getDecisionColor(results.summary.year_decision)}-400`}>
                  {getDecisionLabel(results.summary.year_decision)}
                </span>
              </div>
            </div>

            {/* Tableau des résultats */}
            <h5 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">table_chart</span>
              Détail des Notes
            </h5>
            <div className="overflow-x-auto">
              {(() => {
                // Vérifier si au moins une note a un rattrapage
                const hasRetake = results.results.some(course => course.retake_average !== null);
                
                return (
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-border-light dark:border-border-dark">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-main dark:text-white uppercase">Matière</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-text-main dark:text-white uppercase">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-text-main dark:text-white uppercase">Enseignant</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-text-main dark:text-white uppercase">Sem.</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-text-main dark:text-white uppercase">Crédits</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-text-main dark:text-white uppercase">Coef.</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-text-main dark:text-white uppercase">Moyenne</th>
                        {hasRetake && (
                          <th className="px-4 py-3 text-center text-xs font-semibold text-text-main dark:text-white uppercase">Rattrapage</th>
                        )}
                        <th className="px-4 py-3 text-center text-xs font-semibold text-text-main dark:text-white uppercase">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-border-dark">
                      {results.results.map((course, index: number) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-text-main dark:text-white">{course.course_name}</td>
                          <td className="px-4 py-3 text-center">
                            <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{course.course_code || '-'}</code>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">{course.professor}</td>
                          <td className="px-4 py-3 text-center text-sm text-text-secondary dark:text-gray-400">
                            {course.semester ? `S${course.semester}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-semibold text-text-main dark:text-white">{course.credits}</td>
                          <td className="px-4 py-3 text-center text-sm font-semibold text-text-main dark:text-white">{course.coefficient}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-3 py-1 bg-${getGradeColor(course.final_average)}-100 dark:bg-${getGradeColor(course.final_average)}-900/20 text-${getGradeColor(course.final_average)}-700 dark:text-${getGradeColor(course.final_average)}-400 rounded-full text-sm font-semibold`}>
                              {course.final_average.toFixed(2)}
                            </span>
                          </td>
                          {hasRetake && (
                            <td className="px-4 py-3 text-center">
                              {course.retake_average !== null ? (
                                <span className={`inline-block px-3 py-1 bg-${getGradeColor(course.retake_average)}-100 dark:bg-${getGradeColor(course.retake_average)}-900/20 text-${getGradeColor(course.retake_average)}-700 dark:text-${getGradeColor(course.retake_average)}-400 rounded-full text-sm font-semibold`}>
                                  {course.retake_average.toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-text-secondary dark:text-gray-400">-</span>
                              )}
                            </td>
                          )}
                          <td className="px-4 py-3 text-center">
                            {course.validated ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Validé
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-semibold">
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                Non validé
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>

            <div className="pt-6 border-t border-border-light dark:border-border-dark mt-6 flex gap-3 flex-wrap">
              <button
                onClick={() => setStep('select')}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Retour aux années
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                Nouvelle recherche
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                Imprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultatsAcademiques
