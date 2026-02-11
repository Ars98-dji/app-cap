import { PageLayout, ImportantNotice } from '@components/common'
import {
  HeroSection,
  WelcomeSection,
  MissionsSection,
  ImportantInfoSection,
  ProgramsSection,
  CountdownTimer
} from '@components/home'

const HomePage = () => {
  return (
    <PageLayout>
      <HeroSection />
      {/* Compte à rebours des inscriptions */}
      <div className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
              📅 Périodes d'inscription
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Ne manquez pas les dates limites pour soumettre votre candidature
            </p>
          </div>
          <CountdownTimer />
          
          {/* Avis important */}
          <div className="mt-12">
            <ImportantNotice />
          </div>
        </div>
      </div>
      <WelcomeSection />
      <ImportantInfoSection />
      <MissionsSection />
      <ProgramsSection />
    </PageLayout>
  )
}

export default HomePage
