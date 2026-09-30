# ConnectO dashboard mock UX contract

## Product and source

This is a browser-only demo. [README.md](README.md) defines the data and interactions as local mock state; [src/mockData.js](src/mockData.js) and [src/topSellingData.js](src/topSellingData.js) supply the sample records. No server permission, payment, or real marketplace mutation is represented here. English and Arabic are the supported UI languages. The accessibility target for touched flows is WCAG 2.2 AA.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native `<select>` | `premium-ui.json` and existing controls | Native system popup | Browser selection and keyboard check |
| Date | Native date input in `App.jsx` | `premium-ui.json` and existing controls | Native system popup | Browser date entry check |
| Form | `App.jsx` and `GenerateProductImageModal.jsx` | Local demo workflow | Listing edit / image generation | Build and browser flow |
| Scrollbar | `src/styles.css` | Runtime CSS | Geometry exceptions per container | Computed style and narrow browser |
| Toast | `App.jsx` `notify` | Local demo workflow | Success / error copy | Browser flow |
| CRUD | `App.jsx` listing state | `README.md` frontend-only demo | Local add / edit / delete | Browser flow |

Navigation uses `App.jsx` page state passed to `TopSellingTabs.jsx`. Sidebar and in-page tabs render one selected view; Arrow keys, Home, and End operate the tablist. Dialog focus is owned by `useModalFocus.js`, which enters and traps focus, handles safe Escape dismissal, and restores the trigger on close.

## Workflow ledger

| Operation | Trigger | Pending | Success and feedback | Failure recovery |
|---|---|---|---|---|
| Switch top-selling view | Sidebar item or in-page tab | Immediate | The breadcrumb, selected tab, and content agree. | N/A: local state. |
| Change marketplace | Native select | Immediate | Channel cards, ranking, and filter options reflect the selected sample. | Return to another sample. |
| Search ranking | Search input | Immediate | Result count and stable sales rank update. | Empty state offers Clear filters. |
| Inspect ranked product | Product button or Inspect action | Immediate | Accessible detail dialog. | Close or Escape returns focus. |
| Add listing image | Labeled Add Image action | Preview progress | Generated preview is attached to local listing; optional sync sequence is explicitly simulated. | Invalid reference image shows inline guidance; Cancel leaves listing unchanged. |
| Delete listing | Delete row action | Immediate after confirmation | Local record is removed and a toast acknowledges it. | Cancel leaves record unchanged. |

## Interaction and layout

- The image dialog is sized to the viewport, with a scrollable body and persistent actions. The main footer action starts preview creation, then becomes Add Image after a preview exists.
- The unified ranking's sales rank is based on units sold across connected channels. Changing sort order does not recalculate that rank. Channel rank remains the platform's supplied rank.
- The ranking table scrolls horizontally on small screens; no column disappears. Channel comparison cards become a single column as space narrows.
- Only connected platforms appear as ranking filters. A platform with no connection remains visible in the channel comparison with an explanatory state.
- The demo's state is not persisted after reload. Values and flow labels must not imply live network writes.
