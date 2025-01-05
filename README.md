# Ketu Squads

A modern web application for managing squads in [Ketubara](https://www.ketubara.org)

## Tech Stack

- **Frontend Framework**:
  - React 18
  - TypeScript
  - Vite

- **UI Components & Styling**:
  - Radix UI
  - Styled Components
  - Tailwind CSS
  - clsx + tailwind-merge for class utilities

- **Canvas & Graphics**:
  - Konva / React Konva for canvas manipulation
  - use-image for image handling

- **Development Tools**:
  - TypeScript
  - Vite
  - PostCSS
  - Autoprefixer

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/ketu-squads.git
cd ketu-squads
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Available Scripts

- `npm start` - Starts the development server using Vite
- `npm run build` - Runs TypeScript compilation and creates production build
- `npm run preview` - Previews the production build locally
- `npm run deploy` - Deploys the app to GitHub Pages
- `npm run tsc` - Runs TypeScript check without emitting files
- `npm run typecheck` - Runs TypeScript check against tsconfig.json

## Project Structure

```
src/
├── components/         # UI Components
│   ├── Canvas/        # Canvas-related components
│   ├── ContextMenu/   # Context menu components
│   ├── Dialog/        # Dialog components
│   ├── Menu/          # Menu components
│   └── Portal/        # Portal component
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── styles/            # Global styles
├── theme/            # Theme configuration
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```
