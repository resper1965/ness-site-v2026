/**
 * O ponto azul da marca. É a assinatura visual do ecossistema ness. e vem
 * sempre em `--color-primary-container` (#00ade8), qualquer que seja a cor do
 * texto ao lado. `letterSpacing: 0` impede que o tracking apertado dos títulos
 * empurre o ponto para longe da última letra.
 *
 * Uso: só depois do nome de uma marca (ness., trustness., forense.io) ou como
 * ponto final de um título de seção. Nunca em rótulo de botão ou link.
 */
const BlueDot = () => (
  <span className="text-primary-container" style={{ letterSpacing: 0 }}>.</span>
);

/**
 * Nome de produto da familia n: n.secops, n.cirt, n.infraops.
 *
 * O ponto tambem e o BlueDot — a regra vale para qualquer marca do
 * ecossistema, nao so para ness., trustness. e forense.io. Estava sendo
 * quebrada nos tres lugares que listam os produtos.
 */
export function NomeDeProduto({ nome }: { nome: string }) {
  const [antes, ...resto] = nome.split('.');
  if (!resto.length) return <>{nome}</>;
  return (
    <>
      {antes}
      <BlueDot />
      {resto.join('.')}
    </>
  );
}

export default BlueDot;
