import React from "react";
import Solutions from '../pages/Solutions';
import Insights from '../pages/Insights';
import CTA from '../components/CTA';
import Hero from '../components/Hero';
import ClientLogos from '../components/ClientLogos';

/**
 * Cinco seções, no desenho delicado: nenhum título acima de 32 px.
 *
 * A faixa de prova saiu. Dos seus números, só o tempo de casa tinha fonte, e
 * ele já está no texto do hero; os países estão no rodapé de todas as páginas.
 * Serviços e verticais viraram o mapa de soluções, que vem logo depois do hero.
 *
 * Quando a pesquisa de conteúdo entregar casos com números e depoimentos,
 * "casos" entra no lugar de ClientLogos e "como trabalhamos" entra depois de
 * Soluções.
 */
const Home = () => {
  return (
    <>
      <Hero />
      <Solutions />
      <Insights />
      <ClientLogos />
      <CTA />
    </>
  );
};

export default Home;
