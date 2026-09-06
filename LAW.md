> [!IMPORTANT]
>
> ### 🏛️ The Foundation Creed & Supreme Motivation
>
> **"Clarity before cleverness. Precision before haste. Simplicity without weakness. Strength without spectacle."**
>
> 📜 **Constitutional Mandate**: Non-negotiable architectural laws and engineering standards for all human engineers and autonomous AI agents on **Rexone Web** (`rexone-web`). Zero exceptions!!!
>
> This application is built upon the **Rexone Ecosystem** (`rex-9`). These are immutable **Rexone Laws and Protocols** to be strictly observed and enforced without any exception across all human engineers and autonomous AI agents. Developers building on top of this foundation are warmly encouraged to preserve ecosystem credit to support the project.

> > _"If you don't follow These LAWS, u're gay."_
> >
> > — _Newton'z Law_

---

## 🏛️ 1. Design System & Component Law

### 1.1 Zero Components Outside `src/design/` & Mandatory Component Reuse

- **Rule**: NEVER create custom UI components, buttons, inputs, modals, or base presentation widgets outside `src/design/`.
- Reusable UI elements live exclusively in:
  - `src/design/elements/` — Tokens (colors, fonts, radius, shadows, animations) configured into Tailwind & DaisyUI.
  - `src/design/components/` — Semantic UI components:
    - Form: `FormContainer`, `TextInput`, `TextArea`, `PasswordInput`, `Dropdown`, `Toggle`, `SearchInput`.
    - Buttons: `Button`, `GoogleButton`, `SignOutButton`.
    - Overlays: `Dialog`, `ConfirmDialog`, `LoadingOverlay`, `Toast`.
    - Common & Media: `NavBar`, `Badge`, `ProfileAvatar`, `Typography`, `TextLink`, `Asset`/`Image`, `Video`.
  - `src/design/pages/` — Shared layout shells (`LayoutPage`, `HomePage`, `NotFoundPage`).
- **Forbidden Raw HTML Elements**: NEVER use raw `<img>`, `<video>`, `<a>`, `<textarea>`, `<button>`, `<form>`, or `<select>`. Always use the Design System wrappers (`Asset`, `TextLink`, `Dropdown`, `Button`, `Dialog`).

### 1.2 Automated Theming & Pure Tailwind Spacing

- **Spacing Scale**: Strictly adhere to the standard Tailwind spacing scale (`p-2`, `p-3`, `p-4`, `p-6`, `gap-3`, `space-y-4`). Custom pixel spacing overrides are forbidden.
- **Semantic Tokens**: NEVER import directly from `src/design/elements/` for inline component styles. Always use semantic Tailwind and DaisyUI utility classes (`bg-base-100`, `bg-base-200`, `text-primary`, `text-base-content`, `shadow-sm`, `btn-primary`). Light and dark themes adapt automatically.

---

## 🖼️ 2. Centralized Assets & Media Law (`src/assets/`)

### 2.1 Centralized Asset Registry & Icons

- **Rule**: ALL static assets (images, icons, SVGs, videos, audio) MUST be registered and exported through `src/assets/index.ts` (`images`, `icons`, `videos`, `sounds`, `iconsLib`).
- **Zero Inline SVGs**: NEVER write raw inline `<svg>...</svg>`. Register in `iconsLib` in `src/assets/index.ts` or add an `.svg` under `src/assets/icons/` and render via `Asset`.
- **Zero Raw Media Imports**: All media imports MUST route through `src/assets/`.

### 2.2 Distributed Centralized Dynamic Assets

- **Rule**: NEVER store raw media URL strings directly on domain entities.
- ALL media is managed through the backend distributed assets system (`type`, `storage_key`, `assetable_type`, `assetable_id`).
- Display dynamic avatars via `ProfileAvatar` or `Asset`.

---

## 💾 3. State Management & Lifecycle Law

### 3.1 Zero Direct Storage Access

- **Rule**: NEVER call `localStorage`, `sessionStorage`, or `document.cookie` directly.
- ALL persistent/reactive state MUST use Jotai atoms in `src/atoms.ts` via `AtomService.getAtom()` with centralized `StorageKeys` from `src/constants/storageKeys.ts`.

### 3.2 Universal `LoadingContext` Authority

- **Rule**: NEVER create redundant local loading states (`const [isLoading, setIsLoading] = useState(false)`).
- ALL async operations, page loads, and mutations MUST use `LoadingContext` via `useLoading()` (`const { isLoading, setLoading } = useLoading()`).

### 3.3 Lifecycle State, Recycle Bin & Action Placement Law

- **Lifecycle Hierarchy & Terminology**:
  1. **`discard` (Soft Delete)**: Stamps `discarded_at`. Invoked strictly from the Active resource view to move records to the Recycle Bin.
  2. **`undiscard` (Restore)**: Clears `discarded_at`. Name all code functions, endpoints, and variables `undiscard` (`ADMIN_ACTIONS.UNDISCARD`, `undiscardUser`), and render "Restore" as the user-facing label (`ADMIN_COMMON_LABELS.UNDISCARD = "Restore"`).
  3. **`destroy` (Hard Delete)**: Permanently purges records from the database. Strictly confined to the Recycle Bin for destroyable resources.
- **Non-Destroyable Resources**: Users, Products, Roles, and Permissions are strictly soft-deleted (`discard`) and restored (`undiscard`). They must NEVER be permanently destroyed.
- **Zero Ambiguous "Delete" Terminology**: "Delete" (e.g. `handleDelete`, `isDeleting`, "Delete") is strictly forbidden. Use `discardTarget` / `handleDiscard` for active views, and `destroyTarget` / `handleDestroy` for Recycle Bin purges.
- **Mandatory Recycle Bin Tab**: Whenever `discard` is supported on a resource, that page MUST include a Recycle Bin tab in `<PageHeader>` via `<Tabs>` (Active vs. Recycle Bin).
- **Strict Prohibition of `destroy` in Active Views**: Active views MUST NEVER expose `destroy`. Hard deletion is strictly confined to the Recycle Bin.

### 3.4 Mandatory Confirm Dialog for Destructive Actions

- **Rule**: ALL destructive or state-mutating actions (`discard`, `destroy`, `revoke`, `signout`, `reset`, `clear`) MUST be gated behind an explicit `ConfirmDialog` before invoking Controller or Service methods.
- **Zero Browser Popups**: `window.confirm()` and `window.alert()` are strictly forbidden. Always use `ConfirmDialog` integrated with `useLoading()`.

---

## 🗂️ 4. Constants & Enums Organization Law

### 4.1 Zero Loose String Literals or Magic Numbers

- Every status string, event name, query param, and configuration value MUST be centralized and strongly typed using `as const`.

### 4.2 Colocation of Constants

- **Shared Constants**: `src/constants/` (`storageKeys.ts`, `platform.ts`, `index.ts`).
- **Module Constants**: `src/modules/<name>/constants.ts` and exported via module `index.ts`.

---

## 🌐 5. Architecture & Layering Law (Strict 4-Tier MVCS)

### 5.1 Server-Business Logic Authority vs. Client-Business Logic

- **Server Authority**: All domain rules, access lifecycles, pricing, rate limits, and transactions live exclusively in `rexone-core`.
- **Zero Logic Duplication**: Web client NEVER duplicates or recalculates server rules. It strictly manages frontend state, form validations, UI transitions, and responsive presentation.

### 5.2 4-Tier MVCS Structure

```
Model Layer       (src/models/ & src/modules/*/types.ts)
  ↓ (Typed interfaces, request/response models, state schemas)
View Layer        (src/design/pages/ or src/modules/*/components/ & pages/)
  ↓ (Presentation, local form state, consumes atoms/hooks, calls Controllers)
Controller Layer  (src/modules/*/*.controller.ts)
  ↓ (Orchestrates backend-facing client logic, formats payloads, returns typed results)
Service Layer     (src/services/ & src/modules/*/*.service.ts)
  ↓ (Directs remote HTTP/WebSocket transport via ApiService, returns IApiResponse)
Transport Layer   (src/services/api.service.ts)
    (Global Axios instance, JWT/Platform/Locale headers, 401 interceptor)
```

- **Views**: Pure presentation. Zero direct API calls (`axios`, `fetch`, `*.service.ts`). Zero server-business logic calculations.
- **Controllers**: Lean orchestration. Zero UI callbacks (`setError`, `toast`, `navigate`). Always return strongly typed result objects (`Promise<{ success: boolean; data?: T; error?: string }>`).
- **Services**: Pure transport. Zero UI state, zero DOM access.
- **Custom Hooks**: Manage UI-only client logic (timers, scroll, shortcuts) or bridge complex stateful workflows to Controllers.

### 5.3 Client-Business Logic Bifurcation Law

- **Backend-Facing Logic (`Controller` + `Service`)**: API orchestration, remote state, payload formatting, and error mapping flow strictly through `<feature>.controller.ts` and `<feature>.service.ts`.
- **UI-Only Logic (`Custom Hooks`)**: Purely clientside behavior (timers, physics, shortcuts, DOM measurements, animations, audio playback) lives exclusively in custom React hooks (`src/hooks/use*.ts`).
- **Stateful Workflow Bridge (`Custom Hooks` → `Controllers`)**: Complex reactive workflows (auth wizards, streaming chats) use custom hooks to manage UI state and invoke controllers for backend operations, keeping views declarative and controllers lean.

---

## 🔐 6. RBAC & Admin Permission Isolation Law

### 6.1 Three-Tier Administrative Hierarchy

1. **`super_admin`**: Full access to all administration modules, routes, user management, and IAM governance.
2. **`admin`**: Full access across domain operational modules (`feedbacks`, `payments`, `ai`, `logs`, `notifications`). Restricted from `users` and `iam`.
3. **Partial Admin (`*_admin` Suffix)**: Users possessing a specific `*_admin` role (e.g. `notification_admin`, `product_admin`, `chat_admin`, `log_admin`, `feedback_admin`).

### 6.2 Strict Non-Admin Role Permission Isolation Law

- **Admin Portal Entry Gate**: Users holding ONLY non-admin roles (`user`, `member`, `subscriber`) have ZERO access to the Admin Portal (`/admin/*`). Even if a non-admin role contains `read_users`, `read_products`, or other permissions, the user CANNOT enter the portal or any of its subroutes (all admin routes render 404 / `NotFoundPage`).
- **Role Partitioning / Scoping**: When evaluating capabilities in the Admin Portal, permissions are scoped STRICTLY to the resources covered by the user's active **admin roles** (`super_admin`, `admin`, `*_admin`). Permissions granted under base/non-admin roles (`user`) are **strictly ignored and NEVER leak into the admin portal**.
  - _Example 1_: A user holding `chat_admin` and `user` with `read_logs` under the `user` role:
    - Can enter the Admin Portal and access `/admin/chat/*`.
    - **Cannot** see the Client Logs & Telemetry menu item in the sidebar.
    - **Cannot** access `/admin/logs` through direct route navigation (renders 404 / `NotFoundPage`).
  - _Example 2_: A user holding `log_admin` and `user` with `read_logs` under the `log_admin` role:
    - Can enter the Admin Portal, see the logs sidebar menu item, and access `/admin/logs`.

### 6.3 Granular CUD UI & Route Gating Law

1. **Create Operations**:
   - **UI**: Create action buttons in `<PageHeader>` and table headers MUST be gated by `can(ADMIN_ACTIONS.CREATE, resource)`.
   - **Routes**: Create pages (`/admin/<resource>/new`) MUST be guarded by `AdminRootRoute(action: ADMIN_ACTIONS.CREATE, resource: <resource>)`.
2. **Update Operations**:
   - **UI**: Edit, review, and extend action buttons in `<AdminTableActions>` and table rows MUST be gated by `can(ADMIN_ACTIONS.UPDATE, resource)`.
   - **Routes**: Edit pages (`/admin/<resource>/:id/edit`) MUST be guarded by `AdminRootRoute(action: ADMIN_ACTIONS.UPDATE, resource: <resource>)`.
3. **Delete Operations (Discard, Undiscard, Destroy & Recycle Bin)**:
   - **UI**: Discard, undiscard (restore), destroy, and revoke buttons in `<AdminTableActions>` MUST be gated by `can(ADMIN_ACTIONS.DELETE, resource)`.
   - **Recycle Bin Tab**: The Recycle Bin tab in `<Tabs>` on list pages is visible ONLY if `can(ADMIN_ACTIONS.DELETE, resource)` is true.
   - **Routes**: Recycle bin pages (`/admin/<resource>/discarded`) MUST be guarded by `AdminRootRoute(action: ADMIN_ACTIONS.DELETE, resource: <resource>)`.
4. **Read Operations**:
   - **UI**: Sidebar navigation items and list views are visible ONLY if `can(ADMIN_ACTIONS.READ, resource)` is true.
   - **Routes**: List pages (`/admin/<resource>`) MUST be guarded by `AdminRootRoute(action: ADMIN_ACTIONS.READ, resource: <resource>)`.

### 6.4 Client Admin Portal Completeness

- Sub-admins do not access internal Rails engines (`/admin`, `/red`, `/solid_queue`, `/pulse`). The Client Admin Portal provides all operational modules: Overview (`/admin/analytics`), Commerce (`/admin/product`, `/admin/access`), Communication (`/admin/feedback`, `/admin/notification`, `/admin/chat/*`), IAM (`/admin/user`, `/admin/role`), Observability (`/admin/log`).

---

## 📄 7. Pagination & API Envelope Law

### 7.1 Mandatory Universal Pagy Pagination & Zero "All" Flags

- **Universal Pagy Protocol**: ALL collection and list endpoints MUST use `pagy` and return a standard Pagy envelope (`data` array + `meta.pagination`).
- **Default Full Collection (Zero Query Params)**: When the client requests a collection without `page` or `limit` parameters, the backend returns ALL records in a single page wrapped in standard `pagy` metadata (`current_page: 1`, `total_pages: 1`, `total_count: N`).
- **Prohibition of "all" Query Parameters**: Clients MUST NEVER send `limit: "all"` or arbitrary string flags. Omitting `page` and `limit` fetches the full collection cleanly and uniformly through Pagy. Backend controllers MUST NEVER implement `if params[:limit] == "all"` branching or return unpaginated serializers without `pagy`.

### 7.2 Centralized Response Parsing

- ALWAYS use centralized parsers from `src/services/api.service.ts` (`parseResponse`, `parsePaginatedResponse`, `parseFromList`, `apiHandler`). Zero manual axios parsing.

---

## 🌍 8. Localization Law

- ALL user-facing text, errors, labels, and placeholders MUST be localized via `src/locales/` (`AppLocales.*`).
- `api.service.ts` automatically attaches the active locale via `X-Locale`.

---

## 🧪 9. End-to-End (E2E) Testing Law (Playwright)

- Every core journey (Auth, Passcode, Lifecycle, RBAC) MUST have Playwright E2E tests in `e2e/specs/` using Page Object Models (`e2e/pages/`).

---

## 🧱 10. Module Boundary Law

- Feature domains live inside `src/modules/<feature_name>/`:
  - `components/` — Feature UI components and dialogs.
  - `pages/` — Route pages and dedicated bin pages.
  - Flat root files: `<feature>.controller.ts`, `<feature>.service.ts`, `constants.ts`, `types.ts`, `index.ts`.
- Code outside `src/modules/` is strictly shared infrastructure (`src/design/`, `src/services/`, `src/constants/`, `src/contexts/`, `src/models/`, `src/routes/`, `src/locales/`, `src/helpers/`, `src/hooks/`, `src/atoms.ts`).

---

## ⏰ 11. UTC Transport & Client Local Timezone Law

- Backend operates in UTC. Client sends dates in UTC ISO 8601 strings and formats timestamps into the user's browser local timezone for display.

---

## 📊 12. Dashboard Separation Law

- **Rails Infrastructure Dashboards**: Rails Pulse (hardware/latency), RED (Ruby 500s), Solid Queue (jobs), Administrate (DB tables).
- **Client Admin Panel**: Business KPIs, RBAC governance, catalogue, feedback inbox, client telemetry (`Log::Client` for frontend exceptions). Zero duplication of server infrastructure metrics.

---

## 📚 13. Documentation Synchronization Law

- After every feature or bugfix, keep documentation synchronized:
  - **`README.md`**: Updated with newly added screens, capabilities, or configuration.
  - **`ECOSYSTEM.md`**: Updated for cross-platform contracts, WebSocket events, or shared protocols.
  - **`LAW.md`**: Modified only when establishing or refining fundamental architectural laws.
