# Runbook — virada dos domínios do Pages para o Worker

Quem executa: alguém com acesso ao painel Cloudflare da conta `ness`.
Quando: depois do merge do PR #6 e de conferir o preview.
Duração: ~15 min, com uma janela de segundos sem resposta por domínio.

> O passo é manual de propósito. É o único da Onda 2 que derruba produção se
> sair errado, e a `wrangler.toml` não declara `routes` justamente para o
> deploy não fazer isso sozinho.

## Antes de começar

1. O merge na `main` roda `wrangler deploy` e publica o Worker
   `ness-site2026` em `workers.dev`.

   **Já validado em 08/09/2026**, no Worker publicado: HTML com conteúdo,
   `robots.txt` da ness, 404 real em rota inexistente, `/api/chatbot-config`
   respondendo do D1 e CSP no cabeçalho.

   ```bash
   U=https://ness-site2026.ness.workers.dev
   curl -s $U/ | grep -o '<title>[^<]*</title>'      # ness. IT Company — ...
   curl -so /dev/null -w '%{http_code}\n' $U/nao-existe  # 404
   ```

2. As outras duas marcas **não dá para conferir com `-H "Host:"`**: o edge da
   Cloudflare devolve 403 quando o `Host` não bate com o hostname pedido.
   Esse truque só funciona no preview local.

   Para provar a detecção de marca no edge antes de mexer em DNS, publique
   um Worker descartável cujo hostname contenha o nome da marca — é o mesmo
   `Host` que o código lê:

   ```bash
   npm run build
   for marca in trustness forense; do
     npx wrangler deploy -c dist/server/wrangler.json --name $marca-preflight
     curl -s https://$marca-preflight.ness.workers.dev/ | grep -o '<title>[^<]*</title>'
     npx wrangler delete --name $marca-preflight --force
   done
   ```

   Cada um precisa devolver o título da própria marca. Se devolver ness,
   **pare**: a marca não está saindo do `Host`.

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
