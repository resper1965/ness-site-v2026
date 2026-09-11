# Próximos Passos — Lançamento em Produção

Status atual: código pronto, pendências são configurações de infra e deploy.

---

## P0 — Bloqueadores (sem isso o site não funciona)

### 1. Deploy do canal Worker

```bash
cd canal
wrangler deploy
```

O Worker precisa estar no ar antes do site — ele responde `/api/chat`, `/api/insights`, `/api/jobs`, `/api/cases`, `/api/forms`, `/api/newsletter`.

### 2. Secrets do canal no Cloudflare

No painel: **Workers → canal → Settings → Variables → Add variable (encrypt)**

| Secret | Valor |
|--------|-------|
| `BETTER_AUTH_SECRET` | string aleatória ≥ 32 chars |
| `ADMIN_SETUP_KEY` | chave para bootstrap do admin |
| `RESEND_API_KEY` | chave da conta Resend (emails) |

### 3. Criar o admin inicial do canal

Após o deploy do Worker:

```bash
curl -X POST https://canal.ness.com.br/api/setup/admin \
  -H "Content-Type: application/json" \
  -H "x-setup-key: SEU_ADMIN_SETUP_KEY" \
  -d '{"email":"admin@ness.com.br","password":"...","name":"Admin"}'
```

### 4. Seed de vetores (RAG do chatbot)

Sem isso o chatbot Gabi responde sem contexto real da empresa.

```bash
curl -X POST https://canal.ness.com.br/api/admin/seed-vectors \
  -H "x-setup-key: SEU_ADMIN_SETUP_KEY"
```

### 5. Deploy do site no Cloudflare Pages

```bash
# na raiz do projeto
npm run build
# ou via CI/CD — o push para main já triggera o build no CF Pages
```

No painel CF Pages: **Settings → Environment Variables**
- Confirmar que `CANAL_WORKER_URL = https://canal.ness.com.br` está definido
- `VITE_CANAL_BASE_URL` deve ficar **vazio** (as chamadas usam o proxy Functions)

---

## P1 — Necessário antes de ligar os domínios

### 6. Custom Domains no CF Pages

No painel: **Pages → ness-site2026 → Custom Domains → Add**

| Domínio | Marca carregada |
|---------|-----------------|
| `ness.com.br` | ness. |
| `www.ness.com.br` | ness. |
| `trustness.com.br` | trustness. |
| `www.trustness.com.br` | trustness. |
| `forense.io` | forense.io |
| `www.forense.io` | forense.io |

A detecção de marca é feita em runtime por `window.location.hostname` — um único deploy serve os três domínios.

### 7. Adicionar preview URLs ao CORS do canal

Editar `canal/src/index.ts` → array `origin` do cors:

```ts
// Adicionar as preview URLs do CF Pages
'https://*.ness-site2026.pages.dev',
```

> O domínio `https://ness-site2026.pages.dev` já está na lista. Se CF Pages gerar branches com hash (ex: `abc123.ness-site2026.pages.dev`), adicionar o wildcard acima ou os slugs específicos.

### 8. Conteúdo no D1 antes do go-live

Verificar que os dados de produção estão presentes no banco D1 `canal-db`:

```bash
# Listar insights publicados
wrangler d1 execute canal-db --command "SELECT COUNT(*) FROM entries WHERE status='published'"

# Listar vagas ativas
wrangler d1 execute canal-db --command "SELECT COUNT(*) FROM entries WHERE type='job' AND status='published'"

# Listar cases do portfolio
wrangler d1 execute canal-db --command "SELECT COUNT(*) FROM entries WHERE type='case' AND status='published'"
```

Se os dados estiverem vazios, rodar os seeds:

```bash
wrangler d1 execute canal-db --file=canal/seed-ness-data.sql
wrangler d1 execute canal-db --file=canal/seed.sql
```

---

## P2 — Qualidade / Ajustes pós-lançamento

### 9. `server.ts` — dev local com streaming

O servidor de desenvolvimento (`server.ts`) ainda coleta o stream do canal com `await response.text()` e devolve `{ reply }`, mas o widget agora espera plain text stream. O chat funciona corretamente em produção (CF Pages Function faz pipe direto); em dev local o chat não vai funcionar até este fix:

```ts
// server.ts — rota POST /api/chat
// Substituir await response.text() + res.json({ reply }) por:
response.body.pipe(res)  // ou usar stream passthrough
```

### 10. `EmergencyChatModal` — textos PT hardcoded

O modal de emergência tem título, aviso e placeholder em português hardcoded (sem `t()`). Não é bloqueador para lançamento, mas deve ser internacionalizado em seguida para consistência com o restante do site.

### 11. Monitoramento

- Ativar **Workers Analytics Engine** no canal para métricas de uso do chatbot
- Configurar alerta de erro rate > 1% no CF Dashboard
- Testar o rate limit do chat (20 req/min por IP) em staging antes de ir ao ar

---

## Checklist de go-live

- [ ] `wrangler deploy` no canal concluído sem erros
- [ ] Secrets `BETTER_AUTH_SECRET`, `ADMIN_SETUP_KEY`, `RESEND_API_KEY` definidos
- [ ] Admin inicial criado via `/api/setup/admin`
- [ ] Seed de vetores executado (`/api/admin/seed-vectors`)
- [ ] Build do site sem erros TypeScript (`npm run build`)
- [ ] CF Pages com `CANAL_WORKER_URL` configurado
- [ ] Custom Domains adicionados para os 3 domínios
- [ ] DNS apontando para CF Pages (registros CNAME)
- [ ] Chatbot Gabi respondendo com contexto real em produção
- [ ] Newsletter testada (inscrição + confirmação)
- [ ] Formulário de contato testado (recebe email via Resend)
