import { useState } from 'react'
import { PageLayout } from '@components/common'
import { Link, useSearchParams } from 'react-router-dom'
import { ResultatsAcademiques, QuitusMemoire, CorrectionMemoire, DepotMemoire } from '@components/student-services'
import { SuiviPaiementForm } from '@/components/enrollment-forms'

interface StudentService {
  id: number
  title: string
  description: string
  icon: string
  link: string
  iconBg: string
  badge?: string | null
  badgeColor?: string | null
}

const services: StudentService[] = [
  {
    id: 1,
    title: 'Résultats CUCA CUO',
    description: 'Accédez au résultat de votre candidature et consultez le statut de votre dossier.',
    icon: 'person_search',
    link: '/apply?type=suivi',
    iconBg: 'blue',
    badge: 'Disponible',
    badgeColor: 'blue'
  },
  {
    id: 2,
    title: 'Validation de Paiement',
    description: 'Procédez à la validation de votre quittance de paiement en ligne.',
    icon: 'payments',
    link: '/apply?type=paiement',
    iconBg: 'green',
    badge: 'En ligne',
    badgeColor: 'green'
  },
  {
    id: 3,
    title: 'Recherche de Matricule',
    description: 'Retrouvez votre matricule pour toutes opérations l\'obligeant.',
    icon: 'badge',
    link: '/apply?type=matricule',
    iconBg: 'teal',
    badge: null,
    badgeColor: null
  },
  {
    id: 4,
    title: 'Résultats Académiques',
    description: 'Consultez vos notes et résultats académiques en ligne.',
    icon: 'assessment',
    link: '/student-services?type=resultats-academiques',
    iconBg: 'purple',
    badge: null,
    badgeColor: null
  },
  {
    id: 5,
    title: 'Quitus de Mémoire',
    description: 'Demandez et suivez votre quitus de mémoire pour la soutenance.',
    icon: 'task_alt',
    link: '/student-services?type=quitus-memoire',
    iconBg: 'red',
    badge: null,
    badgeColor: null
  },
  {
    id: 6,
    title: 'Correction de Mémoire',
    description: 'Soumettez votre mémoire corrigé après les observations du jury.',
    icon: 'edit_document',
    link: '/student-services?type=correction-memoire',
    iconBg: 'gray',
    badge: null,
    badgeColor: null
  },
  {
    id: 7,
    title: 'Dépôt de Mémoire',
    description: 'Déposez votre mémoire en ligne pour évaluation et soutenance.',
    icon: 'upload_file',
    link: '/student-services?type=depot-memoire',
    iconBg: 'blue',
    badge: null,
    badgeColor: null
  },
  {
    id: 8,
    title: 'Suivi de Quittance',
    description: 'Consultez le statut de traitement de votre quittance de paiement.',
    icon: 'receipt_long',
    link: '/student-services?type=suivi-paiement',
    iconBg: 'orange',
    badge: 'Traitement rapide',
    badgeColor: 'yellow'
  },
  {
    id: 9,
    title: 'Dépôt de Photo pour Attestation',
    description: 'Déposez votre photo d\'identité qui apparaîtra sur vos attestations officielles.',
    icon: 'photo_camera',
    link: 'https://attestation-photo.cap-epac.online',
    iconBg: 'indigo',
    badge: 'Nouveau',
    badgeColor: 'blue'
  }
]

const StudentServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  
  const serviceType = searchParams.get('type')
  const validTypes = ['resultats-academiques', 'quitus-memoire', 'correction-memoire', 'depot-memoire', 'suivi-paiement']
  const showForm = serviceType && validTypes.includes(serviceType)

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBackToServices = () => {
    setSearchParams({})
  }

  const renderServiceForm = () => {
    switch (serviceType) {
      case 'resultats-academiques':
        return <ResultatsAcademiques />
      case 'quitus-memoire':
        return <QuitusMemoire />
      case 'correction-memoire':
        return <CorrectionMemoire />
      case 'depot-memoire':
        return <DepotMemoire />
      case 'suivi-paiement':
        return <SuiviPaiementForm onCancel={handleBackToServices} />
      default:
        return null
    }
  }

  const getPageTitle = () => {
    switch (serviceType) {
      case 'resultats-academiques':
        return 'Résultats Académiques'
      case 'quitus-memoire':
        return 'Quitus de Mémoire'
      case 'correction-memoire':
        return 'Correction de Mémoire'
      case 'depot-memoire':
        return 'Dépôt de Mémoire'
      case 'suivi-paiement':
        return 'Suivi de Quittance'
      default:
        return 'Espace Étudiant'
    }
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative bg-background-light dark:bg-background-dark py-12 px-4 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="rounded-2xl overflow-hidden relative min-h-[320px] md:min-h-[400px] flex items-center justify-center text-center p-8 bg-cover bg-center"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 23, 23, 0.7), rgba(18, 23, 23, 0.6)), url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200")'
            }}
          >
            <div className="relative z-10 max-w-3xl flex flex-col gap-4">
              <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight">
                {getPageTitle()}
              </h1>
              <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                {showForm 
                  ? 'Remplissez le formulaire ci-dessous pour accéder au service'
                  : 'Accédez à tous les services et ressources mis à votre disposition pour faciliter votre parcours académique.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-10 py-8">
        <div className="max-w-[1280px] mx-auto">
          {showForm ? (
            <>
              <div className="mb-6">
                <button
                  onClick={handleBackToServices}
                  className="inline-flex items-center gap-2 px-4 py-2 text-primary hover:text-primary-hover transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Retour aux services
                </button>
              </div>
              {renderServiceForm()}
            </>
          ) : (
            <>
              <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="material-symbols-outlined text-text-secondary">search</span>
                  </div>
                  <input
                    className="block w-full rounded-full border border-border-light bg-white py-3 pl-12 pr-4 text-text-main shadow-sm placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-surface-dark dark:border-border-dark dark:text-white dark:placeholder:text-gray-500 sm:text-sm transition-all"
                    placeholder="Rechercher un service..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="text-sm text-text-secondary dark:text-gray-400">
                  {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
                </div>
              </div>

              {filteredServices.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                  <p className="text-text-secondary dark:text-gray-400">Aucun service trouvé pour "{searchQuery}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredServices.map((service) => {
                    const isExternal = service.link.startsWith('http')
                    
                    if (isExternal) {
                      return (
                        <a
                          key={service.id}
                          href={service.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-light bg-surface-light p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-border-dark dark:bg-surface-dark dark:hover:border-primary/50"
                        >
                          <div className="mb-6 flex items-start justify-between">
                            <div
                              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                                service.iconBg === 'orange'
                                  ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                                  : service.iconBg === 'blue'
                                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                  : service.iconBg === 'purple'
                                  ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                                  : service.iconBg === 'teal'
                                  ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
                                  : service.iconBg === 'red'
                                  ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                  : service.iconBg === 'green'
                                  ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                  : service.iconBg === 'indigo'
                                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                              }`}
                            >
                              <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                            </div>
                            {service.badge && (
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                  service.badgeColor === 'green'
                                    ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400'
                                    : service.badgeColor === 'blue'
                                    ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400'
                                    : service.badgeColor === 'yellow'
                                    ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-gray-100 text-gray-600 ring-gray-500/10 dark:bg-gray-800 dark:text-gray-400'
                                }`}
                              >
                                {service.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                            {service.title}
                          </h3>
                          <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-gray-400 flex-grow">
                            {service.description}
                          </p>
                          <div className="mt-8">
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors">
                              Accéder <span className="material-symbols-outlined text-lg">open_in_new</span>
                            </span>
                          </div>
                        </a>
                      )
                    }
                    
                    return (
                      <Link
                        key={service.id}
                        to={service.link}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-light bg-surface-light p-8 transition-all hover:-translate-y-1 hover:shadow-xl dark:border-border-dark dark:bg-surface-dark dark:hover:border-primary/50"
                      >
                        <div className="mb-6 flex items-start justify-between">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                              service.iconBg === 'orange'
                                ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                                : service.iconBg === 'blue'
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                : service.iconBg === 'purple'
                                ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                                : service.iconBg === 'teal'
                                ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
                                : service.iconBg === 'red'
                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                : service.iconBg === 'green'
                                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                : service.iconBg === 'indigo'
                                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                          >
                            <span className="material-symbols-outlined text-3xl">{service.icon}</span>
                          </div>
                          {service.badge && (
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                service.badgeColor === 'green'
                                  ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400'
                                  : service.badgeColor === 'blue'
                                  ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400'
                                  : service.badgeColor === 'yellow'
                                  ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-gray-100 text-gray-600 ring-gray-500/10 dark:bg-gray-800 dark:text-gray-400'
                              }`}
                            >
                              {service.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-text-secondary dark:text-gray-400 flex-grow">
                          {service.description}
                        </p>
                        <div className="mt-8">
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors">
                            Accéder <span className="material-symbols-outlined text-lg">arrow_forward</span>
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </PageLayout>
  )
}

export default StudentServicesPage
