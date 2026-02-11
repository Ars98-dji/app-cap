import { Link, useLocation } from 'react-router-dom'
import { useMobileMenu, useScrollPosition } from '@/hooks'
import Logo from './Logo'
import MobileMenu from './MobileMenu'

const Header = () => {
  const { isOpen, toggle } = useMobileMenu()
  const { isScrolled } = useScrollPosition()
  const location = useLocation()

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'À propos', path: '/about' },
    { label: 'Formations', path: '/formations' },
    { label: 'Etudiant CAP', path: '/student-services' },
    { label: 'Suggestions', path: '/suggestions' },
    { label: 'Contact', path: '/contact' },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? 'bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md shadow-sm'
            : 'bg-surface-light dark:bg-surface-dark'
        } border-border-light dark:border-border-dark`}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary dark:text-primary'
                      : 'text-text-main dark:text-white hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>
            <Link
              to="/apply"
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-primary-hover transition-colors text-white text-sm font-bold shadow-sm"
            >
              <span className="truncate">Candidater</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggle}
            className="md:hidden text-text-main dark:text-white"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined cursor-pointer">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      <MobileMenu isOpen={isOpen} onClose={toggle} navLinks={navLinks} />
    </>
  )
}

export default Header
