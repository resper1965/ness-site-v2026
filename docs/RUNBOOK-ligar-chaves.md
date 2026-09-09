# Runbook — ligar Turnstile, Web Analytics, Resend e Zaraz

Tudo abaixo já está implementado e **desligado por ausência de chave**. Nada
quebra enquanto não for ligado: o formulário funciona sem Turnstile, o site
funciona sem beacon, o lead é gravado sem Resend.

Ordem sugerida: 1 → 2 → 3 → 4. Cada bloco é independente.

---

## 1. Turnstile (antirrobô no formulário) — 5 min

**No painel**

1. Cloudflare → **Turnstile** → *Add widget*
2. Nome: `ness-site2026`
3. Hostnames: `ness.com.br`, `trustness.com.br`, `forense.io`
   *(adicione também `ness-site2026.ness.workers.dev` se quiser testar no preview)*
4. Widget mode: **Managed**
5. Copie a **Site Key** e a **Secret Key**

**No GitHub** (a Site Key é pública, entra como variável do repositório)

1. Repositório → Settings → Secrets and variables → Actions → aba **Variables**
2. *New repository variable*
   - Name: `TURNSTILE_SITEKEY`
   - Value: a Site Key

**No terminal** (a Secret Key nunca passa pelo GitHub nem por chat)

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
# cole a Secret Key quando pedir
```

**Conferir:** depois do próximo deploy, `/contato` mostra o widget e
`curl -s https://ness.com.br/contato | grep data-sitekey` devolve a chave.

> Enquanto a `TURNSTILE_SECRET_KEY` não existir, o servidor aceita envios sem
> token — é o que mantém o formulário vivo entre um passo e outro. Assim que
> ela existir, envio sem token é recusado.

---

## 2. Cloudflare Web Analytics — feito

Os três sites estão em **setup automático** e coletando. Confirmado em
09/09/2026 num navegador real: o beacon aparece no DOM e a chamada a
`static.cloudflareinsights.com` dispara nos três domínios.

Duas observações para quem for conferir:

- **`curl` não enxerga o beacon.** A injeção automática só acontece para
  requisições de navegador; num `curl` o HTML volta sem ele. Isso não é
  defeito — confira com um navegador de verdade.
- **A injeção depende da nossa CSP.** `static.cloudflareinsights.com` está em
  `script-src` e `cloudflareinsights.com` em `connect-src`, em
  `workers/app.ts`. Remover qualquer uma das duas mata a medição em silêncio.

## 3. Resend (aviso de lead novo por e-mail) — 10 min

**No Resend**

1. **Domains** → *Add domain* → `ness.com.br`
2. Publique os registros DNS que ele mostrar (SPF/DKIM). Se o DNS está na
   Cloudflare, são três registros TXT/CNAME — publique com o proxy **desligado**
3. Espere verificar (minutos)
4. **API Keys** → *Create API Key* → permissão de envio

**No terminal**

```bash
npx wrangler secret put RESEND_API_KEY
# cole a chave quando pedir
```

**Conferir os destinatários** em `wrangler.toml`, seção `[vars]`:

```toml
LEAD_EMAIL_FROM = "site@ness.com.br"   # precisa ser do domínio verificado
LEAD_EMAIL_TO   = "contato@ness.com.br"
```

Se o endereço de destino for outro, altere e abra um PR — é configuração
versionada, não secret.

**Conferir:** envie o formulário de `/contato` uma vez e veja se o e-mail chega.
O lead aparece no D1 de qualquer jeito; o e-mail é aviso.

---

## 4. Zaraz + consentimento — 15 min, e depois me chame

**No painel**

1. Cloudflare → **Zaraz** (no zone de `ness.com.br`) → *Add tool* → **Google
   Analytics 4**
2. Measurement ID: `G-H181SG5HQT` (o mesmo que está no site hoje)
3. Zaraz → **Consent** → ativar o *Consent Management*
   - Purposes: pelo menos `Analytics` (obrigatório marcar o GA4 nele)
   - Idiomas: pt-BR, en, es
4. Repita para os zones de `trustness.com.br` e `forense.io`

**Depois disso, me avise.** Enquanto o GA4 estiver nos dois lugares — no Zaraz
e no nosso `/boot.js` — cada visita conta duas vezes. A remoção do gtag do
código é um PR de dois minutos, mas só faz sentido depois que o Zaraz estiver
medindo.

---

## Resumo do que fica ligado

| Chave | Onde vai | Efeito quando existe |
|---|---|---|
| `TURNSTILE_SITEKEY` | GitHub → Variables | Widget aparece no formulário |
| `TURNSTILE_SECRET_KEY` | `wrangler secret put` | Servidor passa a exigir o token |
| `RESEND_API_KEY` | `wrangler secret put` | Aviso de lead novo por e-mail |

Nenhuma delas precisa passar por chat: as duas públicas vão no GitHub, as duas
secretas vão direto do seu terminal para a Cloudflare.
