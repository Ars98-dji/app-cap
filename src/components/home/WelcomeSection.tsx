const WelcomeSection = () => {
  return (
    <div id="welcome" className="w-full flex justify-center py-16 bg-background-light dark:bg-background-dark">
      <div className="max-w-[960px] w-full px-4 flex flex-col items-center">
        <h2 className="text-text-main dark:text-white text-3xl font-bold leading-tight mb-6 text-center">
          Bienvenue au CAP-EPAC
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-8"></div>
        <p className="text-text-main/80 dark:text-gray-300 text-lg font-normal leading-relaxed text-center max-w-3xl">
          Le Centre Autonome de Perfectionnement est un pôle d'excellence dédié à la formation technique et professionnelle.
          Nous nous engageons à former les leaders de demain à travers une pédagogie rigoureuse, des infrastructures de
          pointe et un corps professoral expérimenté. Notre mission est de vous accompagner vers la réussite.
        </p>
        {/* <div className="mt-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <img
              alt="Directeur"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text-main dark:text-white">Pr. Jean Dupont</span>
            <span className="text-xs text-text-secondary dark:text-gray-400">Directeur Général</span>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default WelcomeSection
