import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, Link, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

  ShieldCheck, 
  Cloud, 
  Cpu, 
  Brain, 
  Scale, 
  Lock, 
  Workflow, 
  Fingerprint, 
  FileText, 
  ArrowRight, 
  ArrowUpRight, 
  Globe, 
  LayoutGrid,
  Send,
  ChevronRight,
  Gavel,
  FlaskConical,
  Share2,
  Network,
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  Target,
  Eye,
  Heart,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  Menu,
  X,
  AlertTriangle,
  Briefcase,
  Clock,
  Building2,
  Upload,
  PartyPopper,
  Sparkles,
  MessageSquare,
  Bot,
  User
} from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from 'constants/brand';

const CELEBRATION_CONFIG = {
  active: true, // Set to true to enable celebration
  label: `${YEARS_OF_LEGACY} anos`,
  title: `${YEARS_OF_LEGACY} anos de engenharia de precisão`,
  message: `estamos celebrando ${YEARS_OF_LEGACY} anos de inovação, resiliência e parcerias de sucesso. obrigado por fazer parte da nossa história.`,
  startDate: "2024-04-14", // User will provide the exact date
  durationDays: 7,
  foundationYear: FOUNDATION_YEAR,
  currentYear: CURRENT_YEAR
};


import BlueDot from './components/BlueDot';
import CelebrationPopup from './components/CelebrationPopup';
import ChatbotWidget from './components/ChatbotWidget';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Presence from './components/Presence';
import ChatPreview from './components/ChatPreview';
import SolutionPage from './pages/SolutionPage';
import Solutions from './pages/Solutions';
import Services from './pages/Services';
import Verticals from './pages/Verticals';
import Insights from './pages/Insights';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import CTA from './components/CTA';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Compliance from './pages/Compliance';
import Portfolio from './pages/Portfolio';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';


export default function App() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <CelebrationPopup />
      <ChatbotWidget />
      <AnimatePresence mode="wait">
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
      </AnimatePresence>
      <Footer />
    </div>
  );
}

