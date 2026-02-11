# CAP-EPAC - Site Vitrine

Site web institutionnel du Centre Autonome de Perfectionnement (CAP-EPAC).

## 🚀 Technologies

- **React 18** avec TypeScript
- **Vite** pour le build
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Hooks personnalisés** pour la logique réutilisable

## 📁 Structure du Projet

```
src/
├── components/
│   ├── common/          # Composants réutilisables (Header, Footer, etc.)
│   └── home/            # Composants spécifiques à la page d'accueil
├── hooks/               # Hooks personnalisés
├── pages/               # Pages de l'application
├── types/               # Types TypeScript
└── utils/               # Fonctions utilitaires
```

## 🛠️ Installation

```bash
npm install
```

## 🏃 Développement

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📦 Hooks Disponibles

- `useTheme` - Gestion du thème clair/sombre
- `useScrollPosition` - Position de scroll
- `useMobileMenu` - Menu mobile
- `useMediaQuery` - Media queries responsive
- `useForm` - Gestion de formulaires

## 🎨 Composants

Tous les composants sont modulaires et réutilisables.
