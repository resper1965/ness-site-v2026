import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyMotion, MotionConfig } from "motion/react";

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatLauncher from './components/ChatLauncher';
import ScrollToTop from './components/ScrollToTop';
import SchemaOrg from './components/SchemaOrg';
import { BRAND } from './config/brand';
import { ErrorBoundary } from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const TrustnessHome = lazy(() => import('./pages/trustness/Home'));
const DpoService = lazy(() => import('./pages/trustness/DpoService'));
const ForenseHome = lazy(() => import('./pages/forense/Home'));
const About = lazy(() => import('./pages/About'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Services = lazy(() => import('./pages/Services'));
const Verticals = lazy(() => import('./pages/Verticals'));
const SolutionPage = lazy(() => import('./pages/SolutionPage'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const PortfolioCase = lazy(() => import('./pages/PortfolioCase'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const Compliance = lazy(() => import('./pages/Compliance'));
const Assessment = lazy(() => import('./pages/Assessment'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Brandbook = lazy(() => import('./pages/Brandbook'));

/**
 * Framer Motion é carregado sob demanda: o shell (navbar, footer, chat) usa
 * CSS puro, e as features de animação (`domMax`, necessário pelo `layout`
 * do portfólio) chegam num chunk separado depois do primeiro render.
 */
const loadMotionFeatures = () => import('motion/react').then((mod) => mod.domMax);

function PageLoader() {
  return (
    <div className="min-h-screen bg-surface-container-lowest pt-24 px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        {/* Tag skeleton */}
        <div className="w-48 h-6 rounded-full bg-white/5" />
        {/* Title skeleton */}
        <div className="space-y-3">
          <div className="w-3/4 h-12 rounded-2xl bg-white/5" />
          <div className="w-1/2 h-12 rounded-2xl bg-white/5" />
        </div>
        {/* Subtitle skeleton */}
        <div className="w-2/3 h-6 rounded-xl bg-white/5" />
        {/* CTA skeleton */}
        <div className="flex gap-4 pt-4">
          <div className="w-40 h-12 rounded-full bg-white/5" />
          <div className="w-32 h-12 rounded-full bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LazyMotion features={loadMotionFeatures}>
        <MotionConfig reducedMotion="user">
          <div className="min-h-screen">
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-container text-on-primary-container px-4 py-2 z-50 rounded-lg font-bold">
              Pular para o conteúdo principal
            </a>
            <SchemaOrg type="organization" />
            <ScrollToTop />
            <Navbar />
            <ChatLauncher />
            <Suspense fallback={<PageLoader />}>
              <main id="main-content" tabIndex={-1} className="outline-none">
                <Routes>
                  {/* Home page — determined by detected domain/brand */}
                  {BRAND === 'trustness' && <Route path="/" element={<TrustnessHome />} />}
                  {BRAND === 'forense' && <Route path="/" element={<ForenseHome />} />}
                  {BRAND === 'ness' && (
                    <>
                      <Route path="/" element={<Home />} />
                      <Route path="/solucoes" element={<Solutions standalone />} />
                      <Route path="/solucoes/:slug" element={<SolutionPage />} />
                      <Route path="/servicos" element={<Services standalone />} />
                      <Route path="/verticais" element={<Verticals standalone />} />
                    </>
                  )}

                  {/* Sub-brand pages — accessible from any domain */}
                  <Route path="/trustness" element={<TrustnessHome />} />
                  <Route path="/dpo-as-a-service" element={<DpoService />} />
                  <Route path="/forense" element={<ForenseHome />} />

                  {/* Universal shared routes */}
                  <Route path="/brandbook" element={<Brandbook />} />
                  <Route path="/sobre" element={<About />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/portfólio" element={<Portfolio />} />
                  <Route path="/portfolio/:slug" element={<PortfolioCase />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/carreiras" element={<Careers />} />
                  <Route path="/contato" element={<Contact />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/compliance/:type" element={<Compliance />} />
                  <Route path="/assessment/:type" element={<Assessment />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </Suspense>
            <Footer />
          </div>
        </MotionConfig>
      </LazyMotion>
    </ErrorBoundary>
  );
}
