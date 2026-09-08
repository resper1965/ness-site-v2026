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

## A virada: rota, não Custom Domain

**Feita em 08/09/2026.** Registrado aqui porque a diferença entre os dois
mecanismos é o que decide se existe ou não janela de indisponibilidade.

**Custom Domain** cria um registro DNS próprio para o Worker — e a Cloudflare
recusa criar sobre um CNAME existente. Como os três domínios já tinham CNAME
apontando para o Pages, seria preciso removê-los do projeto do Pages primeiro:
uma janela com o domínio sem destino nenhum.

**Route** não toca em DNS. O registro continua apontando para o Pages e o
Worker passa na frente; o Pages vira um origin que nunca é chamado. Sem
janela, e o rollback é apagar a rota.

Um domínio por vez, começando por `forense.io` (menor tráfego):

1. **Painel → Workers & Pages → `ness-site2026` (o Worker) → Domains →
   + Add Route**

   | Campo | Valor |
   |---|---|
   | Zone | `forense.io` |
   | Route | `forense.io/*` |

   O valor sugerido pelo painel é `*.forense.io/*` — **não serve**: com o
   ponto antes, o curinga casa só com subdomínios e deixa o domínio raiz de
   fora.

2. Valide antes de ir para o próximo. A primeira leitura pode vir do cache do
   Pages; use uma query aleatória para furar:

   ```bash
   U=https://forense.io
   curl -s "$U/?nocache=$$" | grep -o '<title>[^<]*</title>'   # marca certa
   curl -sD- -o /dev/null $U/ | grep -i content-security-policy # tem nonce
   curl -s $U/robots.txt | head -1                              # marca certa
   curl -so /dev/null -w '%{http_code}\n' $U/solucoes           # 404 fora da ness
   curl -so /dev/null -w '%{http_code}\n' $U/nao-existe         # 404
   ```

3. Repita para `trustness.com.br/*` e `ness.com.br/*`.

4. As rotas precisam entrar na `wrangler.toml` — o deploy trata o arquivo como
   fonte da verdade e sobrescreve o que existir só no painel.

## Rollback

Apagar a rota (painel, ou remover da `wrangler.toml` e reimplantar). O domínio
volta na hora para o Pages, que continua de pé com o último build. Não apague
o projeto do Pages antes de uns dias de operação normal.

## Depois

- `www` → apex e os redirects 301 das rotas espelho são a task 2.4.
- O projeto do Pages pode ser aposentado quando os três domínios estiverem
  estáveis no Worker.
