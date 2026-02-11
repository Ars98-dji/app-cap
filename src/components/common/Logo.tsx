import { Link } from 'react-router-dom'
import { getImagePath } from '@/utils/assets'

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 text-primary dark:text-white">
      <img 
        src={getImagePath('cap-without-bg.png')} 
        alt="Logo CAP-EPAC" 
        className="h-10 w-auto"
      />
      <h2 className="text-text-main dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
        CAP-EPAC
      </h2>
    </Link>
  )
}

export default Logo
