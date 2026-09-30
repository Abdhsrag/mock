---
version: alpha
name: "ConnectO dashboard mock"
description: "A compact, bilingual marketplace operations dashboard with restrained blue navigation and clear data surfaces."
colors:
  primary: "#0066ff"
  heading: "#1a202c"
  body: "#494b5b"
  muted: "#6b7280"
  surface: "#ffffff"
  edge: "#e5e7eb"
  ai-accent: "#8b5cf6"
  ai-action: "#7c3aed"
  success: "#10b981"
  warning: "#f59e0b"
  danger: "#ef4444"
  danger-action: "#dc2626"
typography:
  sans:
    fontFamily: "Almarai, Arial, sans-serif"
  heading:
    fontFamily: "IBM Plex Sans Arabic, Almarai, Arial, sans-serif"
  mono:
    fontFamily: "ui-monospace, Menlo, Monaco, Consolas, monospace"
rounded:
  control: "9px"
  card: "14px"
  dialog: "16px"
spacing:
  screen-gap: "24px"
  compact-gap: "16px"
  dialog-gutter: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
  button-ai:
    backgroundColor: "{colors.ai-action}"
    textColor: "{colors.surface}"
  button-danger:
    backgroundColor: "{colors.danger-action}"
    textColor: "{colors.surface}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    rounded: "{rounded.card}"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.heading}"
    rounded: "{rounded.dialog}"
  quiet-text:
    textColor: "{colors.muted}"
  divider:
    backgroundColor: "{colors.edge}"
  status-success:
    textColor: "{colors.success}"
  status-warning:
    textColor: "{colors.warning}"
  status-danger:
    textColor: "{colors.danger}"
  ai-accent-icon:
    textColor: "{colors.ai-accent}"
---

# ConnectO dashboard mock design system

## Overview

### Creative North Star

The interface is a seller's operations desk: a calm canvas where products, channel status, and next actions are recognizable at a glance. The top-selling views use ranking and channel identity as their visual signature.

### Product context and register

- **Audience and job:** Marketplace operators inspect listings, add image previews, and compare top products across channels. The [README.md](README.md) establishes this as a frontend-only mock.
- **Markets and languages:** Sample datasets cover Egypt, Saudi Arabia, and the UAE. The interface switches between English and Arabic, including RTL layout. Sample markets do not establish a deployment policy.
- **Usage scene:** Desktop dashboard with a compact phone layout. The most common work is scanning rows, changing filters, and inspecting details.
- **Register:** Product UI. Familiar controls and dense, readable data lead; the AI image action alone carries the purple accent.
- **Restraint:** Do not turn channel data into decorative cards or obscure values behind hover-only affordances.
- **Anti-references:** Marketing hero layouts, gradient text, and developer endpoint language in task controls.
- **Runtime token owner:** Existing CSS in [src/styles.css](src/styles.css) is canonical. The frontmatter mirrors its `:root` colors and the shared 9–16px shape range. Feature rules in [src/top-selling.css](src/top-selling.css) and [src/generate-image-modal.css](src/generate-image-modal.css) consume those roles; this file does not generate CSS.

## Colors

Blue identifies primary navigation, selected views, and focus. Purple identifies AI image creation. Green, amber, and red are reserved for state. White surfaces sit on the existing cool gray-blue page background. Text and borders use the frontmatter values from `src/styles.css`. High-contrast mode should retain the system's native control and scrollbar colors.

## Typography

Almarai is the current body face and IBM Plex Sans Arabic is used for prominent headings and product names. Both scripts share the same component hierarchy. Technical identifiers and JSON use the monospace stack; ordinary labels do not. Product titles may truncate in dense lists, with the full title available in the detail dialog.

## Layout

The shared shell owns navigation and page gutters. `src/styles.css` sets 24px screen gaps on larger viewports and 16px in compact layouts. A listing image dialog has a bounded viewport height, a scrollable content region, and a persistent footer. Its two columns become one below 820px. Ranking tables keep semantic columns inside a visible horizontal scroller on narrow screens.

## Elevation & Depth

Borders and tonal separation carry most hierarchy. The modal has the strongest shadow to show focus context. Selected controls may receive a small offset shadow; static nested panels should remain quiet.

## Shapes

Controls use approximately 9px corners, data cards 12–14px, and dialogs 16px. Status badges may be pill shaped. Lucide icons use consistent stroke weight and accompany text where the action would otherwise be unclear.

## Components

### Foundational visual states

Interactive controls show hover, focus-visible, selected, disabled, and busy states. Empty search results offer a clear reset action. Loading stays within the dialog preview's reserved dimensions.

### Buttons and actions

Primary blue or purple actions use text and an icon. Quiet row actions retain accessible names. The listing's Add Image action is visibly labeled. Destructive controls remain visually separated.

### Navigation and data display

Top-selling tabs map to the sidebar's active view. Channel comparison uses per-channel product ranks; unified ranking preserves a stable sales rank across sort changes. Sample counts and scope remain visible beside the data.

### Forms and overlays

Native selects are used where operating-system popup geometry is acceptable. The image dialog uses a focus trap, Escape dismissal when safe, and focus restoration. The footer holds the next action while setup content scrolls.

### Iconography

Lucide is the application icon family. AI styles use Lucide icons rather than emoji selectors. Platform logos remain supplied assets.

### Motion

Transitions are brief and indicate hover, selection, or progress. Reduced-motion preference disables decorative transitions.

### Content and data visualization

Copy names seller tasks and distinguishes sample data from live operations. Unit bars support the numeric totals but never replace them. Demo storage and sync results are explicitly labeled as simulated.

## Do's and Don'ts

- **Do:** Keep both sidebar and in-page top-selling tabs synchronized.
- **Do:** Keep the image action and dialog's next step visible.
- **Don't:** Present a simulated image URL or sync as a live service result.
- **Don't:** Make a full row clickable when it contains separate actions.
