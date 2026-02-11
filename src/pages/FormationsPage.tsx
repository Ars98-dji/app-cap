/**
 * Page Formations - Dynamique avec données de l'API
 * Formation Continue: Ingénierie + Master
 * Formation à Distance: Licence
 */

import { PageLayout } from '@components/common'
import { useState, useEffect, useMemo } from 'react'
import { getFilieres, getAdministrationUsers, formatAdministrateurForDisplay, type Filiere } from '@/services'
import { LoadingSpinner, ErrorMessage } from '@/components/common'
import { Link } from 'react-router-dom'
import { getImagePath } from '@/utils/assets'

const FormationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filieres, setFilieres] = useState<Filiere[]>([])
  const [chefs, setChefs] = useState<ReturnType<typeof formatAdministrateurForDisplay>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [filieresData, adminsData] = await Promise.all([
          getFilieres(),
          getAdministrationUsers()
        ])
        
        setFilieres(filieresData)
        
        // Formater et filtrer les chefs de division
        const formatted = adminsData.map(formatAdministrateurForDisplay)
        const chefsDiv = formatted.filter(admin => 
          admin.poste.toLowerCase().includes('chef') && 
          admin.poste.toLowerCase().includes('division')
        )
        setChefs(chefsDiv)
      } catch (err: any) {
        console.error('Erreur chargement formations:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Normaliser le cycle
  const normalizeCycle = (cycle: string): string => {
    const normalized = cycle.toLowerCase().trim()
    if (normalized.includes('licence')) return 'licence'
    if (normalized.includes('master')) return 'master'
    if (normalized.includes('ing')) return 'ingenierie'
    return normalized
  }

  // Filtrer les filières par recherche
  const filteredFilieres = useMemo(() => {
    if (!searchQuery.trim()) return filieres
    
    const query = searchQuery.toLowerCase()
    return filieres.filter(filiere =>
      filiere.title.toLowerCase().includes(query) ||
      filiere.abbreviation.toLowerCase().includes(query) ||
      filiere.cycle.toLowerCase().includes(query)
    )
  }, [filieres, searchQuery])

  // Séparer les filières par division
  const formationContinue = useMemo(() => {
    return filteredFilieres.filter(f => {
      const cycle = normalizeCycle(f.cycle)
      return cycle === 'ingenierie' || cycle === 'master'
    })
  }, [filteredFilieres])

  const formationDistance = useMemo(() => {
    return filteredFilieres.filter(f => {
      const cycle = normalizeCycle(f.cycle)
      return cycle === 'licence'
    })
  }, [filteredFilieres])

  // Trouver les chefs de division
  const chefContinue = chefs.find(c => c.poste.toLowerCase().includes('continue'))
  const chefDistance = chefs.find(c => c.poste.toLowerCase().includes('distance'))

  const getBadgeClass = (badge: string | null) => {
    switch (badge) {
      case 'inscriptions-ouvertes':
        return 'bg-green-500 text-white'
      case 'inscriptions-fermees':
        return 'bg-gray-500 text-white'
      case 'prochainement':
        return 'bg-yellow-500 text-gray-900'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }

  const getBadgeText = (badge: string | null) => {
    switch (badge) {
      case 'inscriptions-ouvertes':
        return 'Ouvert'
      case 'inscriptions-fermees':
        return 'Fermé'
      case 'prochainement':
        return 'Bientôt'
      default:
        return ''
    }
  }

  const isInscriptionOpen = (filiere: Filiere) => {
    return filiere.badge === 'inscriptions-ouvertes'
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-[1000px] mx-auto px-4 py-20">
          <LoadingSpinner message="Chargement des formations..." />
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="max-w-[1000px] mx-auto px-4 py-20">
          <ErrorMessage error={error} />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Hero */}
      <div className="relative w-full">
        <div className="max-w-[1000px] mx-auto px-4 py-8">
          <div
            className="rounded-2xl overflow-hidden relative shadow-lg"
            style={{
              backgroundImage: `linear-gradient(rgba(21, 29, 28, 0.7) 0%, rgba(50, 103, 97, 0.8) 100%), url("${getImagePath('education/cap-bat.png')}")`
            }}
          >
            <div className="flex min-h-[320px] md:min-h-[400px] flex-col gap-6 items-center justify-center p-8 text-center">
              <div className="flex flex-col gap-4 max-w-2xl">
                
                <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight">
                  Nos Formations
                </h1>
                <p className="text-gray-100 text-base md:text-lg font-medium max-w-xl mx-auto">
                  Découvrez notre gamme diversifiée de programmes en Formation Continue et à Distance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <section className="max-w-[1000px] mx-auto px-4 pb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-surface-light dark:bg-surface-dark p-4 rounded-xl">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une filière..."
                className="w-full h-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark pl-10 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredFilieres.length} filière{filteredFilieres.length > 1 ? 's' : ''} trouvée{filteredFilieres.length > 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Formation Continue */}
      <section className="max-w-[1000px] mx-auto px-4 pb-10">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e2625]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined text-3xl">school</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary">Formation Continue</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Programmes de Master et Ingénierie
                </p>
              </div>
            </div>
            {chefContinue && (
              <div className="flex items-center gap-3 bg-background-light dark:bg-background-dark px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="size-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
                  <img src={chefContinue.image} alt={chefContinue.nom} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
                    Chef de Division
                  </span>
                  <span className="text-sm font-semibold text-text-main dark:text-white">{chefContinue.nom}</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 bg-surface-light dark:bg-surface-dark">
            {formationContinue.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Aucune filière trouvée pour la Formation Continue.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formationContinue.map((filiere) => (
                  <div
                    key={filiere.id}
                    className="group relative flex flex-col p-5 bg-white dark:bg-background-dark rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${
                        normalizeCycle(filiere.cycle) === 'master'
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                      }`}>
                        {filiere.cycle}
                      </span>
                      {filiere.badge && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${getBadgeClass(filiere.badge)}`}>
                          {getBadgeText(filiere.badge)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {filiere.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {filiere.abbreviation}
                    </p>
                    {isInscriptionOpen(filiere) ? (
                      <Link
                        to="/apply"
                        className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Candidater
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Inscriptions fermées
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Formation à Distance */}
      <section className="max-w-[1000px] mx-auto px-4 pb-20">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e2625]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined text-3xl">laptop_chromebook</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary">Formation à Distance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Programmes de Licence
                </p>
              </div>
            </div>
            {chefDistance && (
              <div className="flex items-center gap-3 bg-background-light dark:bg-background-dark px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="size-10 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-600">
                  <img src={chefDistance.image} alt={chefDistance.nom} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
                    Chef de Division
                  </span>
                  <span className="text-sm font-semibold text-text-main dark:text-white">{chefDistance.nom}</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 bg-surface-light dark:bg-surface-dark">
            {formationDistance.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Aucune filière trouvée pour la Formation à Distance.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formationDistance.map((filiere) => (
                  <div
                    key={filiere.id}
                    className="group relative flex flex-col p-5 bg-white dark:bg-background-dark rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {filiere.cycle}
                      </span>
                      {filiere.badge && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${getBadgeClass(filiere.badge)}`}>
                          {getBadgeText(filiere.badge)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {filiere.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {filiere.abbreviation}
                    </p>
                    {isInscriptionOpen(filiere) ? (
                      <Link
                        to="/apply"
                        className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Candidater
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Inscriptions fermées
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export default FormationsPage
