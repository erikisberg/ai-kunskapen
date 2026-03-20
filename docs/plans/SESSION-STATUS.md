# Session Status — 2026-03-20

## Vad som är byggt och live

### App (Vercel)
- Next.js 16 med Tailwind, shadcn/ui
- Landing page med hero, kurskort, testimonials, FAQ, CTA
- Två kurser med 9 + 11 moduler (14 + 14 slides totalt)
- 7 slide-typer: intro, content, flow (animerad), llm_chat, quiz, scenario, checklist, complete
- AI-chatt med Claude Haiku via AI Gateway (streaming)
- Dev preview: /dev/slides med klickbara slides
- Design: varm folkbildning-känsla, glas-header, #7546FF lila + #F8FE22 gul
- GitHub: github.com/erikisberg/ai-kunskapen

### CMS (Directus på Railway)
- URL: directus-production-2883.up.railway.app
- Login: admin@ai-kunskapen.se / AiKunskapen2026
- Static token: ai-kunskapen-static-token-2026
- 7 collections med O2M-relationer (courses → modules → slides → quiz/scenario/checklist)
- Allt kursinnehåll research-baserat (OECD, AI Safety Report, FI, svenska siffror)

### Env vars (Vercel)
- DIRECTUS_URL, DIRECTUS_TOKEN — CMS-koppling
- AI_GATEWAY_API_KEY — AI-chatt
- VERCEL_OIDC_TOKEN — auto

## Vad som saknas / nästa session

### Prioritet 1: Auth & Organisationer
→ Se `docs/plans/auth-and-org-system.md`
- Inbjudningslänk-system (unik token per anställd)
- Organisationer i DB
- Admin-vy för att bjuda in
- Onboarding-flöde
- Progress-dashboard per org

### Prioritet 2: Mejl-utskick
- Resend-integration
- Inbjudningsmejl med unik länk
- React Email-templates

### Prioritet 3: Content-polering
- Granska varje slide för kvalitet
- Testa fullständigt kursflöde
- Mobiltest
- Snabbspår för erfarna (test-out med 5 frågor)

### Prioritet 4: Lansering
- Custom domän (ai-kunskapen.se)
- Deployment protection av
- Första pilotföretag
- Välgörenhetsmottagare
