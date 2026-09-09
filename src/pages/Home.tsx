import React from "react";
import Solutions from '../pages/Solutions';
import Insights from '../pages/Insights';
import CTA from '../components/CTA';
import Hero from '../components/Hero';
import Prova from '../components/Prova';
import ClientLogos from '../components/ClientLogos';

/**
 * Seis seções, não nove.
 *
 * Presença e Métricas viraram uma faixa de prova só. Serviços e Verticais
 * saíram: são páginas completas, e repeti-las aqui alongava a home em duas
 * telas de rolagem no celular sem dizer nada novo — elas agora aparecem no
 * mega-menu de Soluções.
 *
 * Quando a pesquisa de conteúdo entregar casos com números e depoimentos,
 * "casos" entra no lugar de ClientLogos e "como trabalhamos" entra depois de
 * Soluções. A home segue em seis.
 */
const Home = () => {
  return (
    <>
      <Hero />
      <Prova />
      <Solutions comoSecao />
      <Insights />
      <ClientLogos />
      <CTA />
    </>
  );
};

export default Home;
