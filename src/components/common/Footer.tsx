import { Link } from 'react-router-dom'
import { getImagePath } from '@/utils/assets'

const Footer = () => {
  return (
    <footer className="bg-surface-dark text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={getImagePath('cap-without-bg.png')} 
                alt="Logo CAP-EPAC" 
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold">CAP-EPAC</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Le Centre Autonome de Perfectionnement est votre partenaire pour une formation de qualité et une carrière réussie.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">mail</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">call</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Liens Rapides</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">À propos</Link></li>
              <li><Link to="/formations" className="hover:text-primary transition-colors">Formations</Link></li>
              <li><Link to="/apply" className="hover:text-primary transition-colors">Admissions</Link></li>
              <li><Link to="/student-services" className="hover:text-primary transition-colors">Etudiant CAP</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="font-bold text-lg mb-4">Ressources</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Portail Étudiant</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bibliothèque Numérique</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Calendrier Académique</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Offres de Stage</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-base mt-0.5 text-primary">location_on</span>
                <span>EPAC, Abomey-Calavi<br />Bénin</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-primary">phone</span>
                <span>+229 01 91 94 73 67</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-primary">email</span>
                <span>contact@cap-epac.online</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2024 CAP-EPAC. Tous droits réservés.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
