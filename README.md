<div align="center">
  <img src="src/lib/assets/favicon.svg" width="84" alt="Vertere logo" />

  <h1>Vertere</h1>

  <p>Minimal, secure Markdown → PDF editor. Split editor + live A4 preview, exports via the browser's native PDF engine.</p>

  <p>
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white" alt="Svelte" />
    <img src="https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white" alt="SvelteKit" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
    <img src="https://img.shields.io/badge/marked-18-000000?logo=markdown&logoColor=white" alt="marked" />
    <img src="https://img.shields.io/badge/DOMPurify-3-16A34A?logo=letsencrypt&logoColor=white" alt="DOMPurify" />
  </p>
</div>

---

## Features

- **Split layout** — editor on the left, A4 preview on the right.
- **Real pagination** — the preview measures content and renders one card per page, matching the printed output.
- **Line numbers** — synced gutter in the editor.
- **Print-ready PDF** — `Export PDF` opens the browser's native print-to-PDF, with consistent margins on every sheet and clean page breaks.
- **Sanitized rendering** — no `javascript:` URIs, no inline event handlers, link `rel="noopener noreferrer nofollow"`.
- **Autosave** — local-only via `localStorage`. Nothing leaves your machine.

## Tech stack

| Layer            | Choice                           |
| ---------------- | -------------------------------- |
| Framework        | SvelteKit (Svelte 5, runes mode) |
| Language         | TypeScript                       |
| Bundler          | Vite                             |
| Package manager  | pnpm                             |
| Markdown parser  | `marked`                         |
| HTML sanitizer   | `DOMPurify`                      |
| Fonts            | Inter, Source Sans 3, Space Mono |

## Getting started

```sh
pnpm install
pnpm dev
```

Then open `http://localhost:5173`.

### Other scripts

```sh
pnpm build      # production build
pnpm preview    # preview the production build
pnpm check      # run svelte-check
```

## Security

- **XSS**: all rendered HTML passes through `DOMPurify` with a strict tag and attribute allowlist (`src/lib/markdown.ts`).
- **URI scheme allowlist**: only `http`, `https`, `mailto`, and inline `data:image/*` are permitted.
- **Link hardening**: every `<a>` is rewritten with `target="_blank"` + `rel="noopener noreferrer nofollow"`.
- **CSP**: applied in production via `src/hooks.server.ts` — `default-src 'self'`, `script-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`.
- **Other headers**: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restricting camera/mic/geo.

## Tip — Cleanest PDF export

In the browser print dialog, expand **More settings** and uncheck **Headers and footers** to remove any URL/date/host band the browser may still inject in some corporate builds.

## License

See [`LICENSE`](./LICENSE).
