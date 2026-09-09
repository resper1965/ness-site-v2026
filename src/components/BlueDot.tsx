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

export default BlueDot;
