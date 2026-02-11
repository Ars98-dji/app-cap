import { useState, useEffect } from 'react'
import { PageLayout } from '@components/common'
import { getAdministrationUsers, formatAdministrateurForDisplay } from '@/services'
import { LoadingSpinner, ErrorMessage } from '@/components/common'
import { DocumentsSection } from '@/components/home'
import { ITSupportSection } from '@/components/support'
import { getImagePath } from '@/utils/assets'

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState<ReturnType<typeof formatAdministrateurForDisplay>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true)
        const admins = await getAdministrationUsers()
        const formatted = admins.map(formatAdministrateurForDisplay)
        // Trier par ordre
        formatted.sort((a, b) => a.ordre - b.ordre)
        setTeamMembers(formatted)
      } catch (err: any) {
        console.error('Erreur chargement équipe:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadTeam()
  }, [])

  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-10 py-5">
        <div
          className="flex flex-col gap-6 rounded-xl overflow-hidden min-h-[400px] justify-center items-center bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("${getImagePath('education/cap-bat.png')}")`
          }}
        >
          <div className="flex flex-col gap-2 text-center relative z-10 px-4">
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
              À propos du CAP-EPAC
            </h1>
            <h2 className="text-white/90 text-lg font-normal leading-normal md:text-xl max-w-2xl mx-auto">
              Excellence et Innovation Académique au service de votre avenir professionnel
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col max-w-[1000px] w-full mx-auto flex-1 px-4 py-8 gap-12">
        {/* Mission */}
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 items-start">
          <div className="flex flex-col gap-4 flex-[2]">
            <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">
              Notre Mission
            </h2>
            <p className="text-text-secondary dark:text-slate-300 text-lg leading-relaxed">
              Le Centre Autonome de Perfectionnement (CAP-EPAC) se consacre à fournir une éducation continue de haute qualité. Nous favorisons le développement professionnel et l'excellence académique au sein de notre communauté, en créant des ponts solides entre le monde académique et les exigences du marché du travail.
            </p>
            <p className="text-text-secondary dark:text-slate-300 text-base leading-relaxed">
              Fort de notre héritage et de notre partenariat avec l'EPAC, nous nous engageons à former les leaders de demain à travers des programmes innovants et une pédagogie centrée sur l'apprenant.
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-4 w-full">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-primary font-medium mb-1">Années d'expérience</p>
              <p className="text-4xl font-black tracking-tight text-text-main dark:text-white">15+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-primary font-medium mb-1">Étudiants formés</p>
              <p className="text-4xl font-black tracking-tight text-text-main dark:text-white">2000+</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-primary text-4xl">menu_book</span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-text-main dark:text-white">Histoire</h3>
              <p className="text-text-secondary dark:text-slate-400 text-sm">
                Fondé avec l'objectif de combler le fossé entre la théorie académique et la pratique professionnelle.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-primary text-4xl">lightbulb</span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-text-main dark:text-white">Vision</h3>
              <p className="text-text-secondary dark:text-slate-400 text-sm">
                Devenir un leader régional incontournable dans la formation continue et le perfectionnement.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-symbols-outlined text-primary text-4xl">handshake</span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-text-main dark:text-white">Valeurs</h3>
              <p className="text-text-secondary dark:text-slate-400 text-sm">
                Intégrité, Excellence, Innovation et Collaboration sont au cœur de toutes nos actions.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="flex flex-col gap-8 py-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-text-main dark:text-white">Équipe Administrative</h2>
            <p className="text-text-secondary dark:text-slate-400">
              Les personnes dévouées qui font fonctionner le CAP-EPAC au quotidien.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner message="Chargement de l'équipe..." />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : teamMembers.length === 0 ? (
            <p className="text-center text-gray-500">Aucun membre de l'équipe disponible.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={member.image}
                      alt={member.nom}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white text-center">{member.nom}</h3>
                  <p className="text-primary text-sm font-medium mb-2 text-center">{member.poste}</p>
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">email</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Soutien Informatique */}
      <ITSupportSection />

      {/* Documents Utiles */}
      <DocumentsSection />
    </PageLayout>
  )
}

export default AboutPage
