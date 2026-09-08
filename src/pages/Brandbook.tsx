import React from "react";
import { m as motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../hooks/usePageTitle";
import CTA from "../components/CTA";
import BlueDot from "../components/BlueDot";
import { Copy, Download, Component, Monitor, ShieldCheck, Sun, Moon } from "lucide-react";

export default function Brandbook() {
  const { t } = useTranslation();
  usePageTitle('brandbook.meta_title', 'brandbook — ness.');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Em a real app, you might show a toast here
  };

  const downloadSvg = (mode: 'light' | 'dark') => {
    const textColor = mode === 'light' ? '#0f172a' : '#ffffff';
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 32" width="70" height="32">`;
    svg += `<style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&amp;display=swap'); text { font-family: 'Montserrat', Arial, sans-serif; }</style>`;
    svg += `<text x="5" y="24" font-size="24" font-weight="500" fill="${textColor}" letter-spacing="-1">ness</text>`;
    svg += `<circle cx="65" cy="24" r="4" fill="#00ADE8" />`;
    svg += `</svg>`;
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ness-logo-${mode}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const colors = [
    { name: "Cyan Primário", role: "Marca principal & Destaque", hex: "#00ADE8", rgb: "0, 173, 232", textClass: "text-white" },
    { name: "Surface Lowest", role: "Fundo principal Escuro", hex: "#0A0A0A", rgb: "10, 10, 10", textClass: "text-white" },
    { name: "Surface Vercel", role: "Cards", hex: "#111111", rgb: "17, 17, 17", textClass: "text-white" },
    { name: "Gray Secundário", role: "Subtítulos", hex: "#888888", rgb: "136, 136, 136", textClass: "text-black" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <div className="max-w-3xl">
           <motion.p
             initial={{ y: 10, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="text-primary-container font-mono text-[11px] uppercase tracking-[0.3em] mb-5"
           >
             official guidelines
           </motion.p>
           <motion.h1
             initial={{ y: 16, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight leading-[1.1] mb-6 lowercase"
           >
             brandbook<BlueDot />
           </motion.h1>
           <motion.p
             initial={{ y: 16, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="text-base md:text-lg text-on-surface-variant font-light leading-relaxed max-w-xl"
           >
             Bem-vindo ao manual online da marca Ness. Aqui você encontra as diretrizes oficiais de uso do logotipo, paleta de cores institucionais e arquivos em alta resolução para aplicações corporativas.
           </motion.p>
        </div>

        {/* Logo Section */}
        <section className="space-y-8 border-t border-white/5 pt-16">
          <div>
             <h2 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-3">
               <Component className="text-primary-container" size={24} /> O Logotipo
             </h2>
             <p className="mt-4 text-sm text-on-surface-variant font-light max-w-2xl">
               Nossa marca de nascença carrega precisão e foco. Use sempre as versões oficiais SVG ou PNG sem alterar as proporções ou substituir a tipografia customizada. O 'Blue Dot' (ponto final ciano) deve estar sempre presente.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {/* Dark Mode Application */}
             <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col group">
                <div className="h-48 flex items-center justify-center border-b border-white/5 relative">
                   <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-white/40">
                     <Moon size={14} /> Fundo Escuro (Padrão)
                   </div>
                   <div className="flex items-center text-5xl font-display text-white font-medium lowercase tracking-tight">
                      ness<span className="text-[#00ADE8] ml-1">.</span>
                   </div>
                </div>
                <div className="p-6 bg-surface-container-low/30 backdrop-blur-sm flex justify-between items-center">
                   <div>
                     <p className="text-sm text-white font-medium">Logotipo Principal Diapositivo</p>
                     <p className="text-xs text-white/50">Ideal para nossa comunicação digital padrão (dark mode).</p>
                   </div>
                   <button 
                     onClick={() => downloadSvg('dark')}
                     className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-medium transition-colors"
                   >
                     <Download size={14} /> Baixar SVG
                   </button>
                </div>
             </div>

             {/* Light Mode Application */}
             <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden flex flex-col group">
                <div className="h-48 flex items-center justify-center border-b border-black/5 relative">
                   <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-black/40">
                     <Sun size={14} /> Fundo Claro (Documentos)
                   </div>
                   <div className="flex items-center text-5xl font-display text-slate-900 font-medium lowercase tracking-tight">
                      ness<span className="text-[#00ADE8] ml-1">.</span>
                   </div>
                </div>
                <div className="p-6 bg-slate-50 flex justify-between items-center">
                   <div>
                     <p className="text-sm text-slate-900 font-medium">Logotipo Aplicação Clara</p>
                     <p className="text-xs text-slate-500">Uso obrigatório em documentos físicos, impressões e fundos inviáveis.</p>
                   </div>
                   <button 
                     onClick={() => downloadSvg('light')}
                     className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-full text-xs font-medium transition-colors"
                   >
                     <Download size={14} /> Baixar SVG
                   </button>
                </div>
             </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="space-y-8 border-t border-white/5 pt-16">
          <div>
             <h2 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-3">
               <Monitor className="text-primary-container" size={24} /> Paleta de Cores
             </h2>
             <p className="mt-4 text-sm text-on-surface-variant font-light max-w-2xl">
               Uma paleta sóbria, de alto contraste. O ciano brilhante (#00ADE8) atua exclusivamente como detalhe de destaque, iluminando interfaces escuras pautadas em tons "chumbo" e "oled black".
             </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {colors.map((color) => (
                <div key={color.hex} className="group relative">
                   <div 
                     className="h-32 rounded-xl mb-4 border shadow-inner transition-transform group-hover:scale-[1.02]"
                     style={{ backgroundColor: color.hex, borderColor: color.hex === '#0A0A0A' ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                   />
                   <h3 className="text-white text-sm font-medium">{color.name}</h3>
                   <p className="text-on-surface-variant text-xs mb-3">{color.role}</p>
                   
                   <div className="space-y-1">
                     <div 
                       onClick={() => handleCopy(color.hex)}
                       className="flex items-center justify-between text-xs font-mono text-white/70 bg-white/5 rounded-md px-3 py-1.5 cursor-pointer hover:bg-white/10 hover:text-white"
                     >
                        <span>HEX</span> <span>{color.hex}</span> <Copy size={12} className="opacity-0 group-hover:opacity-100" />
                     </div>
                     <div 
                       onClick={() => handleCopy(color.rgb)}
                       className="flex items-center justify-between text-xs font-mono text-white/50 bg-white/5 rounded-md px-3 py-1.5 cursor-pointer hover:bg-white/10 hover:text-white"
                     >
                        <span>RGB</span> <span>{color.rgb}</span> <Copy size={12} className="opacity-0 group-hover:opacity-100" />
                     </div>
                   </div>
                </div>
             ))}
          </div>
        </section>

        {/* Rules Section */}
        <section className="space-y-8 border-t border-white/5 pt-16 mb-24">
          <div>
             <h2 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-3">
               <ShieldCheck className="text-primary-container" size={24} /> Regras de Uso
             </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             <div className="p-6 rounded-2xl bg-surface-container-low/40 border border-white/5">
                <h3 className="text-white font-medium mb-3">01. Margem de Segurança ("X")</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                  O logotipo deve sempre respirar. Deve haver um espaço vazio correspondente à altura completa da letra "n" ao redor de toda a extensão do bloco da marca.
                </p>
             </div>
             <div className="p-6 rounded-2xl bg-surface-container-low/40 border border-white/5">
                <h3 className="text-white font-medium mb-3">02. Ponto Final Obrigatório</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                  O Blue Dot "." não adorno, mas elemento essencial da linguagem visual. Representa foco, diretividade e inteligência orquestrada.
                </p>
             </div>
             <div className="p-6 rounded-2xl bg-surface-container-low/40 border border-red-500/20">
                <h3 className="text-white font-medium mb-3">03. O Que NÃO Fazer</h3>
                <ul className="text-sm text-red-200/70 font-light leading-relaxed list-disc list-inside space-y-1">
                   <li>Não achatar ou esticar a marca.</li>
                   <li>Não aplicar outline ou sombras intensas.</li>
                   <li>Não usar a versão "Clear" em fundos poluídos.</li>
                   <li>Não trocar o Azul Ciano (#00ADE8) por outras cores.</li>
                </ul>
             </div>
          </div>
        </section>

        <CTA />
      </div>
    </motion.div>
  );
}
