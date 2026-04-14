import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// Layout components — carregados imediatamente (parte do shell)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import CelebrationPopup from './components/CelebrationPopup';
import ScrollToTop from './components/ScrollToTop';

// Pages — lazy loaded por rota (code splitting automático)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Services = lazy(() => import('./pages/Services'));
const Verticals = lazy(() => import('./pages/Verticals'));
const SolutionPage = lazy(() => import('./pages/SolutionPage'));
const Insights = lazy(() => import('./pages/Insights'));
const Blog = lazy(() => import('./pages/Blog'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const Compliance = lazy(() => import('./pages/Compliance'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary-container border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <CelebrationPopup />
      <ChatbotWidget />
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solucoes/:slug" element={<SolutionPage />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/portfólio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/carreiras" element={<Careers />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/compliance/:type" element={<Compliance />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
