const missions = [
  {
    icon: 'school',
    title: 'Formation d\'Excellence',
    description: 'Offrir des programmes académiques de haut niveau, alliant théorie et pratique pour une insertion professionnelle réussie.'
  },
  {
    icon: 'science',
    title: 'Recherche & Innovation',
    description: 'Promouvoir la recherche appliquée et le développement technologique pour répondre aux défis contemporains.'
  },
  {
    icon: 'handshake',
    title: 'Partenariats Stratégiques',
    description: 'Tisser des liens forts avec le tissu industriel et les institutions internationales pour enrichir le parcours étudiant.'
  }
]

const MissionsSection = () => {
  return (
    <div className="w-full bg-white dark:bg-surface-dark py-20 border-y border-gray-100 dark:border-gray-800">
      <div className="layout-container flex justify-center w-full">
        <div className="max-w-[1280px] w-full px-4 md:px-10">
          <div className="flex flex-col mb-12">
            <h2 className="text-text-main dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em] mb-2">
              Nos Missions
            </h2>
            <p className="text-text-secondary dark:text-gray-400">Les piliers de notre engagement éducatif.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missions.map((mission, index) => (
              <div
                key={index}
                className="group p-8 rounded-xl bg-background-light dark:bg-[#2a3635] border border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                  <span className="material-symbols-outlined text-3xl">{mission.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">{mission.title}</h3>
                <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                  {mission.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionsSection
