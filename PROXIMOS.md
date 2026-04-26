# Próximos Passos — Lançamento em Produção

> ⚠️ **Este documento foi incorporado ao roadmap master.**
> Consulte [`docs/PLAN-epics-roadmap.md`](docs/PLAN-epics-roadmap.md) — **Fase 1: Infraestrutura & Go-Live** para o checklist completo de deploy.

## Checklist Resumido de Go-Live

> Referência rápida. O detalhe completo está no roadmap (Fase 1).

### P0 — Bloqueadores

- [ ] `wrangler deploy` no canal → Worker respondendo
- [ ] Secrets definidos (BETTER_AUTH_SECRET, ADMIN_SETUP_KEY, RESEND_API_KEY)
- [ ] Admin inicial criado via `/api/setup/admin`
- [ ] Seed de vetores executado (`/api/admin/seed-vectors`)
- [ ] Build do site sem erros (`npm run build`)
- [ ] CF Pages com `CANAL_WORKER_URL` configurado

### P1 — Antes de ligar os domínios

- [ ] Custom Domains adicionados (ness.com.br, trustness.com.br, forense.io)
- [ ] DNS CNAME apontando para CF Pages
- [ ] Preview URLs no CORS do canal
- [ ] Conteúdo no D1 verificado

### P2 — Pós-lançamento

- [ ] Fix streaming local em `server.ts`
- [ ] i18n do EmergencyChatModal
- [ ] Workers Analytics Engine ativado

---

> 📋 **Documento completo:** [`docs/PLAN-epics-roadmap.md`](docs/PLAN-epics-roadmap.md)
