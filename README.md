# Connecto Dashboard Mock

A standalone, local-only mock of four screens from the dashboard:

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
