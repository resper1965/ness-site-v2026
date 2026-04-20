import React from "react";
import Solutions from '../pages/Solutions';
import Services from '../pages/Services';
import Verticals from '../pages/Verticals';
import Insights from '../pages/Insights';
import CTA from '../components/CTA';
import Hero from '../components/Hero';
import Presence from '../components/Presence';

const Home = () => {
  return (
    <>
      <Hero />
      <Presence />
      <Solutions />
      <Services />
      <Verticals />
      <Insights />
      <CTA />
    </>
  );
};

export default Home;
