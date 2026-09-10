#!/bin/bash
# Sobe o build num Worker local, para rodar e2e e auditoria contra ele.
#
#   bash scripts/preview-local.sh            # builda e sobe na 4351
#   PORTA=4361 bash scripts/preview-local.sh --sem-build
#
# Por que existe:
#   - o `wrangler dev` deixa o workerd segurando a porta quando morre, e cada
#     instancia come ~500 MB. Este script insiste ate a porta liberar, em vez
#     de deixar o processo velho servindo build antigo — o que ja custou uma
#     hora de depuracao em cima de captura de tela desatualizada;
#   - o node so esta no PATH em shell de login, entao o PATH e explicito.
#
# Atencao: o `wrangler dev` local resolve a marca como forense qualquer que
# seja o Host, e o guard de rota derruba as rotas exclusivas da ness. — em
# producao elas respondem 200. Para ver outra marca, builde com VITE_BRAND.
set -u

export PATH="$HOME/.local/bin:$PATH"
PORTA=${PORTA:-4351}
RAIZ=$(cd "$(dirname "$0")/.." && pwd)
cd "$RAIZ" || exit 1

if [ "${1:-}" != "--sem-build" ]; then
  npm run build 2>&1 | tail -2
fi

for _ in $(seq 1 15); do
  fuser -s "$PORTA"/tcp 2>/dev/null || break
  fuser -k -9 "$PORTA"/tcp >/dev/null 2>&1
  sleep 2
done

setsid npx wrangler dev --port "$PORTA" --local > "/tmp/preview-$PORTA.log" 2>&1 < /dev/null &

for _ in $(seq 1 30); do
  sleep 2
  if [ "$(curl -s --max-time 20 -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORTA/" 2>/dev/null)" = "200" ]; then
    echo "no ar em http://127.0.0.1:$PORTA"
    exit 0
  fi
done

echo "FALHOU — ultimas linhas do log:"
tail -5 "/tmp/preview-$PORTA.log"
exit 1
