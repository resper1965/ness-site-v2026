import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// Layout components — immediate load (shell)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import CelebrationPopup from './components/CelebrationPopup';
import ScrollToTop from './components/ScrollToTop';

// Pages — lazy loaded (code splitting)
const Home = lazy(() => import('./pages/Home'));
const TrustnessHome = lazy(() => import('./pages/trustness/Home'));
const ForenseHome = lazy(() => import('./pages/forense/Home'));
const About = lazy(() => import('./pages/About'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Services = lazy(() => import('./pages/Services'));
const Verticals = lazy(() => import('./pages/Verticals'));
const SolutionPage = lazy(() => import('./pages/SolutionPage'));
const Insights = lazy(() => import('./pages/Insights'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const PortfolioCase = lazy(() => import('./pages/PortfolioCase'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const Compliance = lazy(() => import('./pages/Compliance'));
const NotFound   = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary-container border-t-transparent animate-spin" />
    </div>
  );
}

const BRAND = import.meta.env.VITE_BRAND || 'ness';

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
            {BRAND === 'ness' && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/solucoes" element={<Solutions />} />
                <Route path="/solucoes/:slug" element={<SolutionPage />} />
              </>
            )}

            {BRAND === 'trustness' && (
              <Route path="/" element={<TrustnessHome />} />
            )}

            {BRAND === 'forense' && (
              <Route path="/" element={<ForenseHome />} />
            )}

            {/* Vertical sub-brand routes (accessible from ness site) */}
            <Route path="/trustness" element={<TrustnessHome />} />
            <Route path="/forense" element={<ForenseHome />} />

            {/* Shared universal routes */}
            <Route path="/sobre" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            {/* legacy redirect for accented route */}
            <Route path="/portfólio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<PortfolioCase />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/carreiras" element={<Careers />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/compliance/:type" element={<Compliance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
