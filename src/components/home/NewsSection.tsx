const newsItems = [
  {
    date: '10 Nov',
    category: 'Examens',
    categoryColor: 'orange',
    title: 'Calendrier des examens du 1er semestre',
    description: 'Consultez le planning provisoire des évaluations...'
  },
  {
    date: '05 Nov',
    category: 'Admission',
    categoryColor: 'blue',
    title: 'Ouverture des inscriptions Master Pro',
    description: 'Les dossiers de candidature sont recevables jusqu\'au...'
  },
  {
    date: '28 Oct',
    category: 'Soutenances',
    categoryColor: 'green',
    title: 'Programmation des soutenances de fin d\'études',
    description: 'La liste des jurys pour la session d\'octobre est disponible.'
  }
]

const NewsSection = () => {
  return (
    <div className="w-full py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-text-main dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">
              Informations Importantes
            </h2>
            <p className="text-text-secondary dark:text-gray-400 mt-2">
              Restez informés des dernières actualités officielles.
            </p>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-1 text-primary font-bold hover:underline"
          >
            Voir toute l'actualité <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured News */}
          <div className="relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm group cursor-pointer h-full flex flex-col">
            <div className="h-64 w-full overflow-hidden relative">
              <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                À la une
              </div>
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600")'
                }}
              ></div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 mb-3">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                <span>15 Octobre 2023</span>
              </div>
              <h3 className="text-xl font-bold text-text-main dark:text-white mb-3 group-hover:text-primary transition-colors">
                Rentrée Académique Solennelle 2023-2024
              </h3>
              <p className="text-text-secondary dark:text-gray-400 line-clamp-3 mb-4">
                La direction du CAP-EPAC informe l'ensemble de la communauté universitaire que la rentrée solennelle aura lieu le lundi 23 octobre dans l'amphithéâtre principal.
              </p>
              <span className="mt-auto text-primary font-bold text-sm">Lire la suite</span>
            </div>
          </div>

          {/* Recent News List */}
          <div className="flex flex-col gap-4">
            {newsItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="shrink-0 w-20 h-20 bg-primary/5 rounded-lg flex flex-col items-center justify-center text-primary border border-primary/10">
                  <span className="text-2xl font-bold leading-none">{item.date.split(' ')[0]}</span>
                  <span className="text-xs font-medium uppercase">{item.date.split(' ')[1]}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded w-fit mb-2 ${
                      item.categoryColor === 'orange'
                        ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
                        : item.categoryColor === 'blue'
                        ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {item.category}
                  </span>
                  <h4 className="font-bold text-text-main dark:text-white hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-text-secondary dark:text-gray-400 mt-1 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsSection
