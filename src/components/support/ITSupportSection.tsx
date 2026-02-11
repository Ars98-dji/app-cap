import { useState, useEffect } from 'react'
import { getSoutienInformatique, formatAdministrateurForDisplay } from '../../services/administrationService'

interface TeamMember {
  id: number
  nom: string
  poste: string
  image: string
  email?: string
  telephone?: string
}

const ITSupportSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)
      const data = await getSoutienInformatique()
      const formattedMembers = data.map(formatAdministrateurForDisplay)
      setMembers(formattedMembers)
    } catch (err: any) {
      console.error('Erreur chargement équipe:', err)
      setError(err.message || 'Impossible de charger l\'équipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 md:px-10 bg-background-light dark:bg-background-dark">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-4">
            Soutien Informatique
          </h2>
          <p className="text-lg text-text-secondary dark:text-gray-400 max-w-3xl mx-auto">
            Support technique et accompagnement numérique
          </p>
        </div>

        {/* Services Cards */}
       {/*  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-8 border border-border-light dark:border-border-dark">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-4xl text-primary">headset_mic</span>
              </div>
              <h3 className="text-2xl font-bold text-text-main dark:text-white">Support Technique</h3>
            </div>
            <p className="text-text-secondary dark:text-gray-400 mb-6 leading-relaxed">
              Notre équipe de support informatique est disponible pour vous accompagner dans vos démarches numériques,
              résoudre vos problèmes techniques et vous former aux outils informatiques essentiels.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-text-secondary dark:text-gray-400">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                Assistance à distance
              </li>
              <li className="flex items-center gap-3 text-text-secondary dark:text-gray-400">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                Dépannage informatique
              </li>
              <li className="flex items-center gap-3 text-text-secondary dark:text-gray-400">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                Formation aux logiciels
              </li>
              <li className="flex items-center gap-3 text-text-secondary dark:text-gray-400">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                Configuration d'équipements
              </li>
            </ul>
            <button className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined">call</span>
              Contacter le support
            </button>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-8 border border-border-light dark:border-border-dark">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-4xl text-primary">construction</span>
              </div>
              <h3 className="text-2xl font-bold text-text-main dark:text-white">Services Numériques</h3>
            </div>
            <p className="text-text-secondary dark:text-gray-400 mb-6 leading-relaxed">
              Bénéficiez de nos services numériques pour optimiser votre productivité et rester connecté.
              De la création de sites web à la gestion de bases de données, nous vous accompagnons.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-text-secondary dark:text-gray-400">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                Développement web
              </li>
              <li className="flex items-center gap-3 text-text-secondary dark:text-gray-400">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                Gestion de bases de données
              </li>
              <li className="flex items-center gap-3 text-text-secondary dark:text-gray-400">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                Sécurité informatique
              </li>
              <li className="flex items-center gap-3 text-text-secondary dark:text-gray-400">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                Cloud computing
              </li>
            </ul>
            <button className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined">mail</span>
              Demander un devis
            </button>
          </div>
        </div> */}

        {/* Team Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-text-main dark:text-white text-center mb-8">
            Notre Équipe
          </h3>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
                <p className="text-text-secondary">Chargement de l'équipe...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <span className="material-symbols-outlined text-red-600">error</span>
                <span className="text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          ) : members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg p-6 border border-border-light dark:border-border-dark hover:shadow-xl transition-shadow"
                >
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <img
                        src={member.image}
                        alt={member.nom}
                        className="w-full h-full rounded-full object-cover border-4 border-primary/20"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/assets/img/person/person-m-2.webp'
                        }}
                      />
                    </div>
                    <h4 className="text-lg font-bold text-text-main dark:text-white mb-1">
                      {member.nom}
                    </h4>
                    <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
                      {member.poste}
                    </p>
                    {member.email && (
                      <div className="flex items-center justify-center gap-2 text-xs text-text-secondary dark:text-gray-400 mb-2">
                        <span className="material-symbols-outlined text-sm">mail</span>
                        <a
                          href={`mailto:${member.email}`}
                          className="hover:text-primary transition-colors truncate max-w-full"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.telephone && (
                      <div className="flex items-center justify-center gap-2 text-xs text-text-secondary dark:text-gray-400">
                        <span className="material-symbols-outlined text-sm">call</span>
                        <span>{member.telephone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">group_off</span>
              <p className="text-text-secondary dark:text-gray-400">Aucun membre disponible pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ITSupportSection
