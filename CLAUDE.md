# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static website for LEPUS LAB deployed on Vercel. No build system — all files are served directly. Two pages: `index.html` (main landing) and `brand.html` (CI/brand identity).

## Development

Open locally by serving the directory with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Vercel deployment is automatic on push to `master`. Clean URLs are enabled (`cleanUrls: true` in `vercel.json`), so `/brand` serves `brand.html`.

## Architecture

### File roles

| File | Purpose |
|------|---------|
| `index.html` | Main page: Hero, Expertise, Projects, Philosophy, Contact |
| `brand.html` | Standalone brand identity page (separated from index) |
| `styles.css` | All styles for both pages; brand.html-specific styles are inlined in a `<style>` block in that file |
| `script.js` | Theme toggle system + canvas starfield animation; shared by both pages |
| `vercel.json` | Deployment config + security headers (strict CSP) |

### Theme system

- CSS variables in `:root` define the dark theme (default). Light theme overrides live in `:root[data-theme="light"]`.
- `script.js` reads `localStorage("theme-preference")` and sets `data-theme` + `data-theme-preference` on `<html>`.
- The inline `<script>` block at the top of each HTML file initializes the theme before render to prevent flash.
- The theme toggle button requires `data-theme-toggle` attribute and a child `<span class="theme-toggle-label">`.

### Starfield background

Canvas-based animated particle system in `script.js`. Stars drift and draw connecting lines when within 135px — evoking the Lepus constellation metaphor. Uses `--star-rgb` and `--link-rgb` CSS variables so colors adapt to the active theme.

### CSP constraint

`vercel.json` sets a strict `Content-Security-Policy: script-src 'self'`. Inline scripts in HTML are technically blocked by this policy — the existing theme-init inline scripts predate this constraint. Do not add new inline scripts; use `script.js` instead.

## Typography

Two Google Fonts are loaded on both pages:

- **Josefin Sans** (`wght@100;300;400`) — headings (h1–h4), logo, wordmark. Use `font-weight: 100` for hero/logo/major headings, `300` for section titles and card headings. Never use 600/700 on these elements.
- **DM Mono** (`wght@300;400`) — eyebrows, nav links, tags, `<code>`, pillar numbers, project-tag/year. Carries the "technical label" feel throughout the site.

Body paragraphs use `Josefin Sans` at `font-weight: 300` (set on `body`).

## Design tokens

Key CSS variables (defined in `:root` for dark, overridden in `[data-theme="light"]`):

- `--bg` / `--bg-soft` — page background
- `--text` / `--muted` / `--soft` — text hierarchy (full / 76% / 46% opacity)
- `--accent` / `--accent-soft` — Signal Blue highlight color
- `--line` / `--line-strong` — border colors
- `--panel` — card/surface background

## Brand colors

| Name | Hex | Usage |
|------|-----|-------|
| Nebula Navy | `#090B12` | Primary background |
| Cloud Silver | `#EEF2FF` | Primary text |
| Signal Blue | `#C6D2FF` | Accent, links, constellation lines |
