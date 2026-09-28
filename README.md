# Connecto Dashboard Mock

A standalone, frontend-only mock of four screens from the dashboard:

- Alpha AI image generator
- Jumia Overview
- Amazon Orders
- Amazon Product Listings

All screen data is seeded in `src/mockData.js`. Search, filters, dialogs, and listing/order edits update browser state only. Alpha AI uses local sample previews. There are no backend clients, API requests, remote image URLs, or account credentials in this app.

## Run

```bash
npm install
npm run dev
```

The mock is a separate Vite app; the source dashboard remains untouched.

## Production build

```bash
npm ci
npm run build
npm run preview
```

All dependencies, including Recharts, are installed inside this project. No neighboring dashboard directory is required. `node_modules/` and the generated `dist/` directory are excluded from Git.

## Vercel

For the standalone `mock` repository, keep the Root Directory at the repository root (`.`). If deploying from a parent repository, set it to the `mock` directory instead.

- Framework Preset: Vite
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`

The `allowScripts` entry in `package.json` approves the locked esbuild version's installation script. Review and update this approval if esbuild is upgraded.
