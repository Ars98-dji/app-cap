import { Link, useLocation } from 'react-router-dom'

interface NavLink {
  label: string
  path: string
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navLinks: NavLink[]
}

const MobileMenu = ({ isOpen, onClose, navLinks }: MobileMenuProps) => {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-64 bg-surface-light dark:bg-surface-dark shadow-xl">
        <nav className="flex flex-col gap-2 p-6 pt-20">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={`text-base font-medium transition-colors py-3 px-4 rounded-lg relative ${
                isActive(link.path)
                  ? 'text-primary dark:text-primary bg-primary/10 dark:bg-primary/20'
                  : 'text-text-main dark:text-white hover:text-primary dark:hover:text-primary hover:bg-background-light dark:hover:bg-background-dark'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
              )}
            </Link>
          ))}
          <Link
            to="/apply"
            onClick={onClose}
            className="mt-4 flex items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary-hover transition-colors text-white text-base font-bold"
          >
            Candidater
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default MobileMenu
