# Runbook — virada dos domínios do Pages para o Worker

Quem executa: alguém com acesso ao painel Cloudflare da conta `ness`.
Quando: depois do merge do PR #6 e de conferir o preview.
Duração: ~15 min, com uma janela de segundos sem resposta por domínio.

> O passo é manual de propósito. É o único da Onda 2 que derruba produção se
> sair errado, e a `wrangler.toml` não declara `routes` justamente para o
> deploy não fazer isso sozinho.

## Antes de começar

1. O merge na `main` roda `wrangler deploy` e publica o Worker
   `ness-site2026` em `workers.dev`. Confirme que ele responde:

   ```bash
   curl -sI https://ness-site2026.ness.workers.dev/ | head -3
   ```

2. Confirme as três marcas no Worker publicado, antes de qualquer DNS:

   ```bash
   for h in ness.com.br trustness.com.br forense.io; do
     echo "== $h"
     curl -s -H "Host: $h" https://ness-site2026.ness.workers.dev/ \
       | grep -o '<title>[^<]*</title>'
   done
   ```

   Cada um precisa devolver o título da própria marca. Se devolver ness nos
   três, **pare**: a marca não está saindo do `Host`.

## A virada, um domínio por vez

Comece por `forense.io` (menor tráfego), valide, e só então repita para
`trustness.com.br` e `ness.com.br`.

Para cada domínio:

1. **Painel → Workers & Pages → `ness-site2026` (Pages) → Custom domains**
   → remover o domínio.
   Enquanto ele não estiver no Worker, o hostname fica sem destino. É a
   janela; ela dura o tempo dos dois cliques.

2. **Painel → Workers & Pages → `ness-site2026` (Worker) → Settings →
   Domains & Routes → Add → Custom Domain** → o mesmo hostname.
   A Cloudflare cria/ajusta o registro DNS proxied sozinha.

3. Valide antes de ir para o próximo:

   ```bash
   curl -sI https://forense.io/ | head -5          # 200, sem redirect estranho
   curl -s  https://forense.io/ | grep -o '<title>[^<]*</title>'
   curl -sI https://forense.io/ | grep -i content-security-policy   # tem nonce
   curl -s  https://forense.io/robots.txt | head -2                 # marca certa
   curl -so /dev/null -w '%{http_code}\n' https://forense.io/solucoes  # 404
   ```

## Rollback

Remover o Custom Domain do Worker e readicionar no projeto do Pages. O
projeto do Pages continua existindo e com o último build — não o apague
antes de uns dias de operação normal.

## Depois

- `www` → apex e os redirects 301 das rotas espelho são a task 2.4.
- O projeto do Pages pode ser aposentado quando os três domínios estiverem
  estáveis no Worker.
