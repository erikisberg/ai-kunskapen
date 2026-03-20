# Auth, Organisation & Admin — Implementationsplan

## Mål

Företag bjuder in anställda via mejl. Anställda klickar en unik länk, loggas in utan lösenord, genomför kurser, och företagets admin ser progress i en dashboard.

## Arkitektur

```
Admin skapar org → Laddar upp mejllista → System skickar inbjudningar
                                              ↓
Anställd klickar unik länk → Auto-inlogg → Onboarding (2 skärmar) → Kurser
                                              ↓
Admin dashboard ← Progress-data ← Kursgenomförande
```

## Databasschema (Drizzle/Neon)

```
organizations
  id            uuid PK
  name          text (företagsnamn)
  slug          text UNIQUE
  logo_url      text nullable
  charity_name  text nullable (vald välgörenhet)
  price_per_user integer default 200 (öre)
  created_at    timestamp

invitations
  id            uuid PK
  org_id        uuid FK → organizations
  email         text
  token         text UNIQUE (kryptografisk, 32+ tecken)
  status        enum: pending | accepted | expired
  sent_at       timestamp nullable
  accepted_at   timestamp nullable
  expires_at    timestamp

users (uppdatera befintlig)
  + org_id      uuid FK → organizations nullable
  + name        text nullable
  + onboarded   boolean default false

progress (befintlig, redan klar)
  user_id, course_slug, module_slug, completed_at
```

## Routes

### Publika
- `GET /join/[token]` — Validera token → skapa/hitta user → logga in → redirect till onboarding eller kurs
- `GET /onboarding` — 2-3 skärmar: "Välkommen [namn]", "Din arbetsplats [org] har bjudit in dig", "Välj kurs"

### Auth-skyddade (inloggad användare)
- `GET /dashboard` — Min progress, mina kurser, mitt diplom
- `GET /api/me` — Användardata + org + progress

### Admin-skyddade (org admin)
- `GET /admin` — Org-dashboard: antal inbjudna, slutfört, bidrag
- `GET /admin/invite` — Ladda upp mejllista (CSV/textarea)
- `POST /api/admin/invite` — Skapa inbjudningar + skicka mejl
- `GET /api/admin/progress` — Aggregerad progress per org

## Implementationsordning

### Task 1: Databasschema
- [ ] Lägg till organizations, invitations tabeller i schema.ts
- [ ] Uppdatera users med org_id, name, onboarded
- [ ] Kör migration mot Neon

### Task 2: Inbjudningslänk-flöde
- [ ] `app/join/[token]/page.tsx` — Server component som validerar token
- [ ] Skapa user om den inte finns, koppla till org
- [ ] Sätt JWT-session (Auth.js) och redirecta
- [ ] Markera invitation som accepted
- [ ] Hantera expired/invalid tokens med felmeddelande

### Task 3: Onboarding
- [ ] `app/onboarding/page.tsx` — Client component
- [ ] Skärm 1: "Välkommen! [Org] har bjudit in dig att lära dig om AI"
- [ ] Skärm 2: "Välj vilken kurs du vill börja med" (2 kort)
- [ ] Markera user som onboarded efter sista skärmen
- [ ] Redirecta redan onboardade users direkt till /dashboard

### Task 4: Admin — Skapa org & bjud in
- [ ] `app/admin/page.tsx` — Enkel dashboard
- [ ] `app/admin/invite/page.tsx` — Textarea för mejladresser (en per rad)
- [ ] `POST /api/admin/invite` — Parse mejl, skapa invitations, generera tokens
- [ ] Admin-auth: enklast = lista av admin-mejl i env var, eller org.admin_user_id

### Task 5: Mejl-utskick
- [ ] Installera Resend (eller Nodemailer med SMTP)
- [ ] Mejlmall: "Du är inbjuden av [Org] att gå AI-kunskapen. Klicka här: [länk]"
- [ ] Mjuk design som matchar appen
- [ ] Rate limiting på utskick

### Task 6: Progress-dashboard
- [ ] Uppdatera befintliga progress-routes att koppla till riktiga users
- [ ] `app/dashboard/page.tsx` — Inloggad users progress, kurskort, diplom
- [ ] `app/admin/page.tsx` — Org-dashboard: "47 av 52 slutfört", bidrag-counter
- [ ] Badge/certifikat: "AI-redo arbetsplats 2026"

### Task 7: Säkerhet & polish
- [ ] Token-expiry (30 dagar)
- [ ] Rate limiting på invite-endpoint
- [ ] Hantera edge cases: redan accepterad token, redan inloggad user
- [ ] Deployment protection av /admin (bara admin-mejl)
- [ ] GDPR: hantera radering av userdata

## Teknikval

| Komponent | Val | Motivering |
|-----------|-----|------------|
| Auth | Auth.js JWT + magic token | Ingen lösenord. Inbjudningslänk = inlogg. |
| Mejl | Resend | Vercel Marketplace, React Email templates |
| DB | Neon Postgres + Drizzle | Redan uppsatt |
| Admin-auth | Env var ADMIN_EMAILS | Enklast för v1 |

## Beroenden

```
Task 1 (schema) → Task 2 (join) → Task 3 (onboarding)
                → Task 4 (admin) → Task 5 (mejl)
Task 2 + Task 3 → Task 6 (dashboard)
Alla → Task 7 (säkerhet)
```

Task 1-3 kan byggas och testas utan mejl-utskick (manuell token-generering).
Task 4-5 kan byggas parallellt med Task 3.

## Uppskattning

~4-6 timmar total implementation. Task 1-3 ger en fungerande MVP (inbjudan via länk + onboarding + kurser). Task 4-7 gör det produktionsredo.
