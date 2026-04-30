# Quantum Parking API — client implementation guide

This document describes how a web or mobile client should call the NestJS backend: base URL, authentication, CORS, and HTTP routes with JSON bodies where validation applies.

---

## Base URL and transport

- **Host / port:** set by server env `PORT_APP` (no global API prefix in code).
- **Example base:** `http://localhost:${PORT_APP}` — replace with your deployed origin.
- **JSON:** send `Content-Type: application/json` on `POST`, `PATCH`, and JSON bodies.
- **HTTPS:** use in production.

---

## CORS (browser clients)

From `main.ts`:

- **Origins:** `*` (any origin).
- **Methods:** `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`.
- **Allowed request headers:** `Content-Type`, `Authorization`.
- **Credentials:** `credentials: true` is enabled; with `origin: '*'` some browsers restrict credentialed requests — prefer a concrete origin in production if you use cookies (this API uses Bearer tokens, so typical SPA usage is fine).

If you add custom headers (for example `X-Request-Id`), the server must list them in `allowedHeaders` or the browser will block the preflight.

---

## Authentication

### JWT (Bearer)

- Most routes run **`AuthTokenMiddleware`**: the client must send  
  `Authorization: Bearer <access_token>`.
- Algorithm **RS256**. Access tokens are issued with a **7-day** expiry (renewal extends the session).
- The server decodes the JWT and attaches the payload to the request as **`user`** for controllers. The client **must not** send a `user` header; it is **server-only** (derived from the token).

**JWT payload fields** (relevant to clients; full payload may include standard `iat` / `exp`):

| Claim     | Meaning                                      |
|----------|-----------------------------------------------|
| `uuid`   | MongoDB user id (string)                     |
| `role`   | `admin` \| `user` \| `worker`                 |
| `business` | Business id string tied to the user (may be empty) |

### Routes **without** Bearer validation (middleware skips)

These paths do **not** require a valid token at the edge (still send JSON where needed):

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/auth/login` | Body: login |
| `POST` | `/auth/register` | Body: register |
| `POST` | `/auth/renew` | Header: `Authorization: Bearer <token>` (may be expired within server grace window) |
| `GET`  | `/auth/validate` | Returns `{ "valid": true }` (lightweight ping) |
| `GET`  | `/.well-known/jwks.json` | If exposed by your deployment |
| `GET`  | `/getCollectionsInfo` | DB tooling (root controller) |
| `*`    | `/config` | Middleware treats base `/config` as public — align with your deployment’s `baseUrl` behavior |

All **other** routes require a **non-expired** JWT unless you only use the renew flow with a token still inside the server’s renewal rules.

### Recommended client session flow

1. **`POST /auth/login`** or **`POST /auth/register`** → store `token` from the response.
2. For every protected call, set **`Authorization: Bearer <token>`**.
3. **`GET /auth/me`** (protected) → refresh user profile and obtain a **new** `token` in the same response shape as login.
4. Before or after expiry, **`POST /auth/renew`** with the current (or recently expired) Bearer token → new `token` + user fields; update stored token.
5. On **`401`** with body like `{ "error": "Not authorized" }`, clear session and redirect to login (or call renew once if you still have a renewable token).

### Auth response shape (login / register / me / renew)

Typical success fields (see `AuthService`):

```json
{
  "id": "<ObjectId>",
  "email": "<string>",
  "role": "admin | user | worker",
  "name": "<string>",
  "lastName": "<string>",
  "business": "<ObjectId or null>",
  "token": "<JWT string>"
}
```

### Login / register request bodies

**`POST /auth/login`** — `LoginDto`:

```json
{
  "user": "user@example.com",
  "password": "secret"
}
```

- `user` is validated as **email** in the DTO; the service also looks up by stored `user` field where applicable.

**`POST /auth/register`** — `RegisterDto`:

```json
{
  "user": "user@example.com",
  "password": "atleast6chars"
}
```

**`POST /auth/renew`**

- Headers: `Authorization: Bearer <token>` (no body required).

---

## Errors

- **401 (middleware):** `{ "error": "Not authorized" }` — missing/invalid/expired token on a protected route.
- **401 / 403 / 404 / 409:** Nest HTTP exceptions with default JSON bodies (`message`, `statusCode`, etc.) depending on the endpoint.

---

## Role matrix (high level)

| Role    | Typical use |
|---------|-------------|
| `admin` | Full operators; extra endpoints (e.g. vehicle search by `business`, financial by `businessId`, admin vehicle-log filter, user admin actions). |
| `user`  | Business-scoped managers; some user-management patches. |
| `worker`| Restricted; several “create-by-user” / “update-by-user” paths forbid `worker`. |

Always read **403** responses from the API when implementing UI gating.

---

## API reference by module

Below, **Auth** means: `Authorization: Bearer <token>` unless the route is listed as public above.

### Root (`AppController`)

| Method | Path | Auth | Body / query |
|--------|------|------|----------------|
| `GET` | `/getCollectionsInfo` | No | — |
| `POST` | `/removeIndexFromCollection` | Yes (unless you change middleware) | `{ "indexName": "...", "collectionName": "..." }` |

*Note: middleware skip list includes `getCollectionsInfo` only for **GET**; `removeIndexFromCollection` expects a valid JWT.*

---

### `GET/POST/PATCH/DELETE` — `/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/login` | No | Login |
| `POST` | `/auth/register` | No | Register |
| `POST` | `/auth/renew` | No* | Renew JWT (*Bearer still sent, not validated by middleware) |
| `GET` | `/auth/validate` | No | `{ "valid": true }` |
| `GET` | `/auth/me` | Yes | Current user + new token |

---

### `/users` — all require Auth unless you change middleware

| Method | Path | Roles / notes |
|--------|------|----------------|
| `POST` | `/users/create` | **admin** — `CreateUserDto`: `{ "user": "string", "password": "string" }` |
| `POST` | `/users/create-by-user` | Not **worker** — `CreateUserByUserDto`: `{ "email": "a@b.com", "password": "string" }` |
| `GET` | `/users` | Scoped by caller in service |
| `GET` | `/users/business/:businessId` | By business id |
| `GET` | `/users/my-business` | Caller must have `business` on JWT |
| `GET` | `/users/:id` | By id (param parsed as number in code — prefer numeric-compatible id) |
| `PATCH` | `/users/:id` | **admin** — `UpdateUserDto` (partial user + optional `role`) |
| `PATCH` | `/users/:id/role` | **admin** — `UpdateUserRoleDto`: `{ "role": "admin" \| "user" \| "worker" }` |
| `PATCH` | `/users/:id/status` | **admin** or **user** — `UpdateUserStatusDto`: `{ "enabled": true }` |
| `PATCH` | `/users/:id/update-by-user` | Not **worker** — `UpdateUserByUserDto` optional `email`, `password` |
| `PATCH` | `/users/:id/business` | **admin** — `UpdateUserBusinessDto`: `{ "business": "<MongoId>" }` |

---

### `/business` — Auth required for most; `GET /business/all` still goes through middleware (needs token)

| Method | Path | Body / behavior |
|--------|------|-----------------|
| `POST` | `/business` | `CreateBusinessDto` — pricing + legal/address fields (see server DTO for full list) |
| `GET` | `/business` | Current user’s business (uses JWT `uuid`, `role`, `business`) |
| `GET` | `/business/all` | All businesses |
| `GET` | `/business/my-businesses` | Businesses for JWT user |
| `GET` | `/business/:id` | One business |
| `PATCH` | `/business/:id` | `UpdateBusinessDto` (partial) |
| `DELETE` | `/business/:id` | Delete |
| `PATCH` | `/business/:id/set-user` | Associate JWT user to business |

`CreateBusinessDto` includes: optional `name`; required `businessName`, `businessBrand`, multiple **number** costs (`carHourCost`, `motorcycleHourCost`, monthly/day/night/student costs), `businessNit`, `businessResolution`, `address`, `schedule`.

---

### `/vehicle` — Auth required (middleware)

| Method | Path | Body / params |
|--------|------|----------------|
| `POST` | `/vehicle` | `CreateVehicleDto`: `{ "plateNumber": "ABC123", "vehicleType": "car" \| "motorcycle" }` — scoped to JWT `business` |
| `GET` | `/vehicle` | List by JWT business |
| `GET` | `/vehicle/business/:businessId` | List by business |
| `GET` | `/vehicle/my-vehicles` | By JWT user id |
| `GET` | `/vehicle/active` | Active by JWT business |
| `GET` | `/vehicle/plate/:plateNumber` | Uppercased in service |
| `GET` | `/vehicle/plate/:plateNumber/all` | All businesses |
| `GET` | `/vehicle/business-ids` | Distinct business ids |
| `POST` | `/vehicle/find` | `FindVehiclesDto`: `{ "plateNumber": "...", "business?": "<MongoId>" }` — `business` only for **admin** |
| `PATCH` | `/vehicle/plate/:plateNumber/parking` | Body: `{ "parking": true \| false }` |
| `GET` | `/vehicle/:id` | One vehicle (JWT business) |
| `PATCH` | `/vehicle/:id` | `UpdateVehicleDto` (partial plate / type) |
| `PATCH` | `/vehicle/:id/vehicle-type` | `UpdateVehicleTypeDto`: `{ "vehicleType": "car" \| "motorcycle" }` |
| `DELETE` | `/vehicle/:id` | Delete one |
| `DELETE` | `/vehicle/business/:businessId` | Delete all for business |

---

### `/vehicle-log` — Auth required for most handlers that use `@Headers('user')`

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/vehicle-log` | `CreateVehicleLogDto`: `{ "plateNumber": "abc123", "vehicleType": "car" \| "motorcycle" }` |
| `GET` | `/vehicle-log` | By JWT business |
| `GET` | `/vehicle-log/active` | Active vehicles |
| `PATCH` | `/vehicle-log/update-business-id` | `UpdateBusinessIdDto`: `{ "from": "<MongoId>", "to": "<MongoId>" }` |
| `GET` | `/vehicle-log/:id` | One log |
| `PATCH` | `/vehicle-log/:id` | `UpdateVehicleLogDto`: extends create fields partially + **required** `cost` (number) |
| `DELETE` | `/vehicle-log/admin/:id` | **admin** or **user** |
| `DELETE` | `/vehicle-log/:id` | By id + JWT business |
| `GET` | `/vehicle-log/vehicle/:plateNumber/last` | Last log for plate |
| `PATCH` | `/vehicle-log/vehicle/:plateNumber/checkout` | Body: `UpdateVehicleLogDto` |
| `GET` | `/vehicle-log/vehicle/:plateNumber/logs` | History |
| `GET` | `/vehicle-log/vehicle-id/:vehicleId/logs` | By vehicle id |
| `DELETE` | `/vehicle-log/all/business/:businessId` | Bulk delete |
| `GET` | `/vehicle-log/date/:date` | Logs for date string |
| `POST` | `/vehicle-log/filter` | **admin** — `FilterVehicleLogsDto`: `{ "dateStart": "ISO-8601", "dateEnd": "ISO-8601", "businessId": "<MongoId>" }` |

---

### `/membership`

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/membership` | Body `CreateMembershipDto` — **no** `@Headers('user')` in controller (middleware still runs: token required) |
| `GET` | `/membership` | No user header in controller |
| `GET` | `/membership/active` | JWT `business` |
| `GET` | `/membership/vehicle/plate/:plateNumber` | JWT `business` |
| `GET` | `/membership/vehicle/plate/:plateNumber/business/:businessId` | No user header |
| `GET` | `/membership/:id` | — |
| `PATCH` | `/membership/:id/toggle` | `ToggleMembershipDto`: `{ "enable": true }` |
| `PATCH` | `/membership/:id` | `UpdateMembershipDto` (partial) |
| `DELETE` | `/membership/:id` | — |

`CreateMembershipDto` (JSON): `dateStart`, `dateEnd` as **dates** (client often sends ISO strings; server uses `@Type(() => Date)`), `value` (number), `businessId`, optional `enable`, `plateNumber`, `userName`, `phone`, `vehicleType` (`car` \| `motorcycle`).

---

### `/financial` — Auth required

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/financial/resume/date/:date` | `:date` is path param; JWT `business` |
| `GET` | `/financial/resume/date/:date/business/:businessId` | **admin** only |

---

### `/config` — middleware skip uses strict `baseUrl == '/config'` in code; verify in your environment

| Method | Path | Body |
|--------|------|------|
| `POST` | `/config` | `CreateConfigDto`: `{ "key": "string", "value": "string" }` |
| `GET` | `/config` | List |
| `GET` | `/config/:key` | Get by key |
| `DELETE` | `/config/:key` | Remove |

---

### `/accounting` — stub service (placeholder strings)

Standard CRUD on `/accounting` and `/accounting/:id`; DTOs are minimal/empty — treat as **not production-ready** until implemented server-side.

---

## Minimal client examples

### Fetch wrapper (TypeScript)

```typescript
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function api<T>(
  path: string,
  opts: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
```

### Login and store token

```typescript
const session = await api<{
  token: string;
  id: string;
  email: string;
  role: string;
  business: string | null;
}>('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ user: 'you@example.com', password: '***' }),
});
localStorage.setItem('qp_token', session.token);
```

### Authenticated GET

```typescript
const me = await api<typeof session>('/auth/me', {
  method: 'GET',
  token: localStorage.getItem('qp_token'),
});
```

---

## Checklist for client teams

- [ ] Centralize **base URL** per environment.
- [ ] Persist **Bearer token** securely (mobile: Keychain / Keystore; web: memory + refresh via `/auth/renew` or `/auth/me` as needed).
- [ ] Attach **`Authorization`** on every protected request.
- [ ] Handle **401** globally (logout or renew).
- [ ] Respect **403** for role-gated UI.
- [ ] Send **`vehicleType`** only as **`car`** or **`motorcycle`**.
- [ ] Prefer **ISO 8601** strings for dates where DTOs use `@IsDateString` or `@IsDate`.

---

*Generated from the `src` tree as of the repository state; if controllers change, update this file or generate OpenAPI (e.g. `@nestjs/swagger`) for a single source of truth.*
