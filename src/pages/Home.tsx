import React from "react";
import Solutions from '../pages/Solutions';
import Services from '../pages/Services';
import Verticals from '../pages/Verticals';
import Insights from '../pages/Insights';
import CTA from '../components/CTA';
import Hero from '../components/Hero';
import Presence from '../components/Presence';
import Metrics from '../components/Metrics';
import ClientLogos from '../components/ClientLogos';

const Home = () => {
  return (
    <>
      <Hero />
      <Presence />
      <Metrics />
      <Solutions />
      <Services />
      <Verticals />
      <Insights />
      <ClientLogos />
      <CTA />
    </>
  );
};

export default Home;
