import Solutions from '../pages/Solutions';
import Services from '../pages/Services';
import Verticals from '../pages/Verticals';
import Insights from '../pages/Insights';
import CTA from '../components/CTA';
import Hero from '../components/Hero';
import Presence from '../components/Presence';
import React, {  } from "react";

// Celebration Configuration
const FOUNDATION_YEAR = 1991;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR;



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
