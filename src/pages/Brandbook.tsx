import { useState } from "react";
import { useTranslation } from "react-i18next";
import { routeMeta } from '../utils/meta';
import CTA from "../components/CTA";
import BlueDot from "../components/BlueDot";
import { Check, Copy, Download, Component, Monitor, ShieldCheck, Sun, Moon } from "lucide-react";

export default function Brandbook() {
  const { t } = useTranslation();

  // A pagina inteira existe para copiar valor. Sem retorno visual, quem clica
  // nao sabe se copiou - e clica de novo.
  const [copiado, setCopiado] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiado(text);
      setTimeout(() => setCopiado((atual) => (atual === text ? null : atual)), 1600);
    } catch {
      // Area de transferencia bloqueada (http, permissao negada): sem alarde.
    }
  };

  /**
   * O arquivo anterior nao abria fora do navegador: puxava a Montserrat por
   * @import do Google Fonts, que praticamente nenhum editor de SVG busca, e
   * punha o ponto num <circle> de coordenada fixa - com a fonte trocada por
   * Arial, o ponto pousava longe do "s". Aqui o ponto e um <tspan> dentro do
   * mesmo bloco de texto, entao acompanha a largura real das letras em
   * qualquer maquina.
   */
  const downloadSvg = (mode: 'light' | 'dark') => {
    const textColor = mode === 'light' ? '#000000' : '#ffffff';
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 44" role="img" aria-label="ness.">` +
      `<title>ness.</title>` +
      `<text x="4" y="33" font-family="Montserrat, Arial, Helvetica, sans-serif" font-size="32"` +
      ` font-weight="500" letter-spacing="-0.32" fill="${textColor}">ness<tspan fill="#00ADE8">.</tspan></text>` +
      `</svg>`;
    
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

  // Os valores abaixo sao os mesmos tokens de src/index.css. Se um mudar la,
  // muda aqui - um brandbook com hexadecimal errado e pior que nenhum.
  const colors = [
    { name: "BlueDot", role: "o ponto da marca, destaque e ação", hex: "#00ADE8", rgb: "0, 173, 232" },
    { name: "Primária", role: "links e ícones sobre fundo escuro", hex: "#7BD0FF", rgb: "123, 208, 255" },
    { name: "Superfície", role: "fundo das páginas", hex: "#0B1326", rgb: "11, 19, 38" },
    { name: "Superfície mais baixa", role: "hero e faixas de destaque", hex: "#060E20", rgb: "6, 14, 32" },
    { name: "Superfície baixa", role: "cards e formulários", hex: "#0F172A", rgb: "15, 23, 42" },
    { name: "Texto principal", role: "corpo de texto", hex: "#DAE2FD", rgb: "218, 226, 253" },
    { name: "Texto secundário", role: "descrições e apoio", hex: "#9DB0C0", rgb: "157, 176, 192" },
    { name: "Texto sobre BlueDot", role: "rótulo dentro do botão azul", hex: "#003549", rgb: "0, 53, 73" },
  ];

  return (
    <div className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <div className="max-w-3xl">
           <p className="text-primary-container font-mono text-[11px] uppercase tracking-[0.3em] mb-5">
             official guidelines
           </p>
           <h1 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight leading-[1.1] mb-6 lowercase">
             brandbook<BlueDot />
           </h1>
           <p className="text-base md:text-lg text-on-surface-variant font-normal leading-relaxed max-w-xl">
             Bem-vindo ao manual online da marca Ness. Aqui você encontra as diretrizes oficiais de uso do logotipo, paleta de cores institucionais e arquivos em alta resolução para aplicações corporativas.
           </p>
        </div>

        {/* Logo Section */}
        <section className="space-y-8 border-t border-white/5 pt-16">
          <div>
             <h2 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-3">
               <Component className="text-primary-container" size={24} /> O Logotipo
             </h2>
             <p className="mt-4 text-sm text-on-surface-variant font-normal max-w-2xl">
               Nossa marca de nascença carrega precisão e foco. Use sempre as versões oficiais SVG ou PNG sem alterar as proporções ou substituir a tipografia customizada. O 'Blue Dot' (ponto final ciano) deve estar sempre presente.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {/* Dark Mode Application */}
             <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col group">
                <div className="h-48 flex items-center justify-center border-b border-white/5 relative">
                   <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-white/70">
                     <Moon size={14} /> Fundo Escuro (Padrão)
                   </div>
                   <div className="flex items-center marca text-5xl text-white">
                      ness<BlueDot />
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
                   <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-black/70">
                     <Sun size={14} /> Fundo Claro (Documentos)
                   </div>
                   <div className="flex items-center marca text-5xl text-black">
                      ness<BlueDot />
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
             <p className="mt-4 text-sm text-on-surface-variant font-normal max-w-2xl">
               Uma base azul-noite de alto contraste. O BlueDot (#00ADE8) entra só como destaque — o ponto da marca, a ação primária, o ícone que precisa ser visto. Nunca como fundo de área grande.
             </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {colors.map((color) => (
                <div key={color.hex} className="group relative">
                   <div 
                     className="h-32 rounded-xl mb-4 border shadow-inner transition-transform group-hover:scale-[1.02]"
                     style={{ backgroundColor: color.hex, borderColor: 'rgba(255,255,255,0.14)' }}
                   />
                   <h3 className="text-white text-sm font-medium">{color.name}</h3>
                   <p className="text-on-surface-variant text-xs mb-3">{color.role}</p>
                   
                   <div className="space-y-1">
                     {([['HEX', color.hex], ['RGB', color.rgb]] as const).map(([rotulo, valor]) => (
                       <button
                         key={rotulo}
                         type="button"
                         onClick={() => handleCopy(valor)}
                         aria-label={`copiar ${rotulo} ${valor}`}
                         className="flex w-full items-center justify-between gap-2 rounded-md bg-white/5 px-3 py-2 font-mono text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-primary-container"
                       >
                          <span>{rotulo}</span>
                          <span>{valor}</span>
                          {copiado === valor
                            ? <Check size={12} className="text-primary-container" aria-hidden="true" />
                            : <Copy size={12} className="opacity-40 group-hover:opacity-100" aria-hidden="true" />}
                       </button>
                     ))}
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
                <p className="text-sm text-on-surface-variant font-normal leading-relaxed">
                  O logotipo deve sempre respirar. Deve haver um espaço vazio correspondente à altura completa da letra "n" ao redor de toda a extensão do bloco da marca.
                </p>
             </div>
             <div className="p-6 rounded-2xl bg-surface-container-low/40 border border-white/5">
                <h3 className="text-white font-medium mb-3">02. Ponto Final Obrigatório</h3>
                <p className="text-sm text-on-surface-variant font-normal leading-relaxed">
                  O BlueDot "." não é adorno: é elemento essencial da linguagem visual. Representa foco, diretividade e inteligência orquestrada.
                </p>
             </div>
             <div className="p-6 rounded-2xl bg-surface-container-low/40 border border-red-500/20">
                <h3 className="text-white font-medium mb-3">03. O Que NÃO Fazer</h3>
                <ul className="text-sm text-red-200/70 font-normal leading-relaxed list-disc list-inside space-y-1">
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
    </div>
  );
}


export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, {
    title: 'brandbook',
    description: 'A identidade visual da ness. e das marcas do grupo: tipografia, cores, uso do ponto e dos logos.',
    noindex: true,
  });
}
