import { Link } from 'react-router-dom'
import { getImagePath } from '@/utils/assets'

const HeroSection = () => {
  return (
    <div className="relative w-full">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1280px] px-4 md:px-10 py-5">
          <div
            className="relative flex min-h-[560px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-8 md:p-12 overflow-hidden shadow-lg"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(50, 103, 97, 0.8) 100%), url("${getImagePath('education/cap-bat.png')}")`
            }}
          >
            <div className="flex flex-col gap-4 text-center max-w-3xl z-10">
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-sm">
                Excellence et Innovation au Service du Développement
              </h1>
              <h2 className="text-white/90 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                Rejoignez le CAP-EPAC pour bâtir votre avenir académique et professionnel dans un environnement d'élite.
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 z-10">
              <Link
                to="/about"
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white text-primary text-base font-bold shadow-md hover:bg-gray-100 transition-colors"
              >
                <span>En savoir plus</span>
              </Link>
              <Link
                to="/apply"
                className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary/30 backdrop-blur-sm border border-white/40 text-white text-base font-bold hover:bg-primary/50 transition-colors"
              >
                <span>S'inscrire</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
