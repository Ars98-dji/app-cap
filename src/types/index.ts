export interface NavLink {
  label: string
  path: string
}

export interface Program {
  title: string
  level: string
  icon: string
  description: string
  image?: string
}

export interface NewsItem {
  date: string
  category: string
  categoryColor: string
  title: string
  description: string
  image?: string
}

export interface TeamMember {
  name: string
  role: string
  image: string
}

export interface Service {
  icon: string
  iconBg: string
  title: string
  description: string
  badge?: string | null
  badgeColor?: string | null
}
