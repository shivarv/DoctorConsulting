---
name: react-frontend-dev
description: Use whenever writing, reviewing, or structuring frontend React/TypeScript code in this repo's frontend/ folder — pages, components, hooks, API services, or state management. Triggers on "add a page", "add a component", "frontend logic", "React hook", "API service call", or any new file under frontend/src/.
---

# React frontend development (DoctorConsulting)

Conventions for the `frontend/` React + TypeScript app (Vite). Confirm what's
actually installed via `frontend/package.json` before assuming a router,
state library, or UI kit is available.

## Project layout

Feature-oriented structure. Dependencies flow one way only:
`Page -> Feature/Component -> Hook/Service -> API`.

```
frontend/src/
├── app/          # bootstrap, routing, providers, global config — no feature logic
├── pages/        # route-level screens; compose features, handle page-level loading/error/empty states
├── features/     # feature-owned components/hooks/services/types/utils (e.g. features/appointments/)
├── components/   # reusable, presentation-only shared UI (Button, Modal, Table...) — no API calls, no feature logic
├── hooks/        # reusable app-wide hooks (useAuth, useDebounce...) — feature-specific hooks stay in the feature
├── services/     # shared API client + request functions — centralize HTTP, auth headers, error handling
├── types/        # shared TS types/interfaces; feature-specific types stay in the feature
├── utils/        # small pure functions — no components, no API calls, no state
├── constants/    # values reused across the app — not single-feature values
└── assets/       # static images/icons/fonts — never secrets or runtime config
```

- Don't move something into a shared folder (`components/`, `hooks/`, `types/`)
  just because it *is* a component/hook/type — only when it's reused outside
  its feature.
- Dependency direction: `app -> pages -> features -> shared
  (components/hooks/services)`. Shared modules must never import from a
  specific feature; `utils/`/`services/` must never import UI.

## Component responsibilities

- Components handle rendering, user interaction, local UI state, and calling
  hooks/callbacks — not business workflows.
- Extract non-trivial or reused logic into a hook or service, not inline JSX.

## API access

- Flow: `Component/Page -> hook or feature service -> services/ API client ->
  backend`. Never call `fetch`/Axios directly from a component when a
  service already exists.
- Centralize base URL, auth headers, and error/response handling in
  `services/`.
- Env-specific values (API URLs, keys) come from frontend env config (e.g.
  Vite `import.meta.env`), never hardcoded. Anything shipped to the browser
  is public — no secrets in frontend code.

## State management

- Prefer the smallest scope: local state -> lifted state -> feature
  hook/context -> app-wide store, in that order.
- Don't add Redux/Zustand/etc. "for consistency" without a concrete need;
  don't duplicate the same server data across multiple stores.

## Forms & error handling

- Validate on the frontend for UX, but treat backend validation as the
  source of truth for anything security-sensitive.
- Handle errors per layer: services normalize technical errors,
  pages/features decide user-facing behavior, components just render the
  given error state. Never swallow errors silently.
- Every async action handles loading / success / empty / failure explicitly;
  guard against duplicate submissions.

## Code style

- Functional components with TypeScript; explicit prop types/interfaces.
- Composition over large components with many boolean props.
- No unnecessary `useEffect`; don't store derived values in state when they
  can be computed from existing state/props.
- Skip `useMemo`/`useCallback` until there's a real perf or
  referential-stability reason.

## Before writing code

1. Check `frontend/package.json` before assuming a router, state library, or
   UI kit is installed.
2. Follow existing structure/patterns; don't introduce React Router, Redux,
   Zustand, TanStack Query, Axios, MUI, Tailwind, etc. without checking for
   an existing equivalent first.
3. Reuse existing components/hooks/services before creating new ones.
4. New dependency -> update `frontend/package.json` (and lockfile).

## Definition of done

- [ ] `npm run build` (or configured build/typecheck) passes in `frontend/`
- [ ] Lint passes if configured
- [ ] Relevant tests pass
- [ ] Loading/error/success/empty states handled where applicable
- [ ] New dependencies reflected in `frontend/package.json`
- [ ] No secrets/credentials committed
- [ ] API calls not duplicated ad hoc across components
