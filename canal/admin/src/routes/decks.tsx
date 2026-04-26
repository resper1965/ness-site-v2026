import { useState } from "react";
import { Document, Page, Text, View, StyleSheet, pdf, Font, Svg, Circle } from "@react-pdf/renderer";

// Register Montserrat font
Font.register({
  family: "Montserrat",
  fonts: [
    { src: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM70w-.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCvr70w-.ttf", fontWeight: 700 },
  ],
});

const COLORS = {
  cyan: "#00ADE8",
  dark: "#0A0A0A",
  surface: "#111111",
  gray: "#888888",
  white: "#FFFFFF",
  lightBg: "#F8F9FA",
};

const BRANDS: Record<string, { name: string; tagline: string }> = {
  "ness": { name: "ness.", tagline: "Tecnologia, Segurança e Inteligência desde 1991" },
  "trustness": { name: "trustness.", tagline: "Compliance, Privacidade & Governança" },
  "forense": { name: "forense.io", tagline: "Investigação Digital & Resposta a Incidentes" },
};

const TEMPLATES: Record<string, { label: string; slides: string[] }> = {
  comercial: {
    label: "Proposta Comercial",
    slides: ["Capa", "Sobre a Empresa", "O Problema", "Nossa Solução", "Diferenciais", "Cases de Sucesso", "Investimento", "Próximos Passos"],
  },
  onepager: {
    label: "One-Pager de Serviço",
    slides: ["Capa", "Visão Geral", "Benefícios", "Como Funciona", "Contato"],
  },
  institucional: {
    label: "Deck Institucional",
    slides: ["Capa", "Quem Somos", "Timeline", "Verticais", "Números", "Equipe", "Contato"],
  },
  tecnico: {
    label: "Relatório Técnico",
    slides: ["Capa", "Sumário Executivo", "Metodologia", "Resultados", "Recomendações", "Anexos"],
  },
};

const s = StyleSheet.create({
  page: { backgroundColor: COLORS.dark, padding: 0 },
  pageCover: { backgroundColor: COLORS.dark, padding: 60, justifyContent: "flex-end", height: "100%" },
  pageContent: { backgroundColor: COLORS.white, padding: 60 },
  
  // Cover
  coverBrand: { fontSize: 42, fontFamily: "Montserrat", fontWeight: 700, color: COLORS.white, letterSpacing: -1 },
  coverDot: { color: COLORS.cyan },
  coverTitle: { fontSize: 28, fontFamily: "Montserrat", fontWeight: 600, color: COLORS.white, marginTop: 24, lineHeight: 1.3 },
  coverSub: { fontSize: 14, fontFamily: "Montserrat", fontWeight: 400, color: COLORS.gray, marginTop: 12 },
  coverLine: { width: 60, height: 3, backgroundColor: COLORS.cyan, marginTop: 32, borderRadius: 2 },
  coverDate: { fontSize: 11, fontFamily: "Montserrat", color: COLORS.gray, marginTop: 16, textTransform: "uppercase" as "uppercase", letterSpacing: 2 },
  
  // Content pages
  slideTitle: { fontSize: 24, fontFamily: "Montserrat", fontWeight: 700, color: COLORS.dark, marginBottom: 24 },
  slideLine: { width: 40, height: 3, backgroundColor: COLORS.cyan, marginBottom: 24, borderRadius: 2 },
  slideBody: { fontSize: 13, fontFamily: "Montserrat", fontWeight: 400, color: "#444", lineHeight: 1.8 },
  slideNumber: { position: "absolute" as "absolute", bottom: 30, right: 40, fontSize: 10, fontFamily: "Montserrat", color: COLORS.gray },
  footer: { position: "absolute" as "absolute", bottom: 30, left: 60, fontSize: 9, fontFamily: "Montserrat", color: "#CCC" },

  // CTA page
  ctaPage: { backgroundColor: COLORS.dark, padding: 60, justifyContent: "center", alignItems: "center", height: "100%" },
  ctaTitle: { fontSize: 28, fontFamily: "Montserrat", fontWeight: 700, color: COLORS.white, textAlign: "center" as "center", marginBottom: 16 },
  ctaEmail: { fontSize: 16, fontFamily: "Montserrat", fontWeight: 400, color: COLORS.cyan, textAlign: "center" as "center" },
  ctaSub: { fontSize: 12, fontFamily: "Montserrat", fontWeight: 400, color: COLORS.gray, textAlign: "center" as "center", marginTop: 8 },
});

type SlideContent = { title: string; body: string };

function DeckDocument({ brand, title, slides, date }: { brand: string; title: string; slides: SlideContent[]; date: string }) {
  const b = BRANDS[brand] || BRANDS.ness;
  const brandParts = b.name.split(".");

  return (
    <Document>
      {/* Cover */}
      <Page size="A4" orientation="landscape" style={s.pageCover}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text style={s.coverBrand}>
            {brandParts[0]}<Text style={s.coverDot}>.</Text>{brandParts[1] || ""}
          </Text>
          <Text style={s.coverTitle}>{title}</Text>
          <Text style={s.coverSub}>{b.tagline}</Text>
          <View style={s.coverLine} />
          <Text style={s.coverDate}>{date}</Text>
        </View>
      </Page>

      {/* Content slides */}
      {slides.map((slide, i) => (
        <Page key={i} size="A4" orientation="landscape" style={s.pageContent}>
          <Text style={s.slideTitle}>{slide.title}</Text>
          <View style={s.slideLine} />
          <Text style={s.slideBody}>{slide.body}</Text>
          <Text style={s.slideNumber}>{String(i + 2).padStart(2, "0")}</Text>
          <Text style={s.footer}>{b.name} — Confidencial</Text>
        </Page>
      ))}

      {/* CTA / Contact */}
      <Page size="A4" orientation="landscape" style={s.ctaPage}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Svg width={60} height={60} viewBox="0 0 60 60">
            <Circle cx={30} cy={30} r={6} fill={COLORS.cyan} />
          </Svg>
          <Text style={[s.ctaTitle, { marginTop: 24 }]}>Vamos conversar?</Text>
          <Text style={s.ctaEmail}>comercial@ness.com.br</Text>
          <Text style={s.ctaSub}>+55 11 3230-6757 · ness.com.br</Text>
        </View>
      </Page>
    </Document>
  );
}

export default function DecksPage() {
  const [brand, setBrand] = useState("ness");
  const [template, setTemplate] = useState("comercial");
  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<{ title: string; brand: string; template: string; date: string; url: string }[]>([]);

  const handleGenerate = () => {
    const tpl = TEMPLATES[template];
    if (!tpl) return;

    // Pre-populate slides from template
    const preSlides = tpl.slides.slice(1, -1).map((s) => ({
      title: s,
      body: `Conteúdo da seção "${s}" — edite abaixo antes de exportar.`,
    }));
    setSlides(preSlides);
    setPdfUrl(null);
  };

  const handleSlideChange = (idx: number, field: "title" | "body", value: string) => {
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const handleExportPdf = async () => {
    setGenerating(true);
    try {
      const date = new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" });
      const blob = await pdf(
        <DeckDocument brand={brand} title={title || "Apresentação"} slides={slides} date={date} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      setHistory((prev) => [
        { title: title || "Sem título", brand, template, date, url },
        ...prev,
      ]);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${brand}-${template}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Generator Card */}
      <div className="card" style={{ padding: 24 }}>
        <div className="card-header" style={{ padding: 0, marginBottom: 20, border: "none" }}>
          <span className="card-title">Gerar Nova Apresentação</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Marca</label>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="role-select" style={{ width: "100%" }}>
              {Object.entries(BRANDS).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Template</label>
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="role-select" style={{ width: "100%" }}>
              {Object.entries(TEMPLATES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Título da Apresentação</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Proposta de Serviços para Empresa X"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface-2)",
                color: "var(--text)",
                fontSize: 13,
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost" onClick={handleGenerate}>
            Montar Slides
          </button>
          {slides.length > 0 && (
            <button className="btn" style={{ background: "var(--accent)", color: "#fff" }} onClick={handleExportPdf} disabled={generating}>
              {generating ? "Gerando PDF..." : "Exportar PDF"}
            </button>
          )}
          {pdfUrl && (
            <button className="btn btn-ghost" onClick={handleDownload}>
              ⬇ Baixar PDF
            </button>
          )}
        </div>
      </div>

      {/* Slide Editor */}
      {slides.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <div className="card-header" style={{ padding: 0, marginBottom: 20, border: "none" }}>
            <span className="card-title">Editar Slides ({slides.length} seções)</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {slides.map((slide, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 16,
                  background: "var(--surface-2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--mono)" }}>
                    SLIDE {String(i + 2).padStart(2, "0")}
                  </span>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleSlideChange(i, "title", e.target.value)}
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      border: "1px solid var(--border)",
                      borderRadius: 4,
                      background: "var(--bg)",
                      color: "var(--text)",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  />
                </div>
                <textarea
                  value={slide.body}
                  onChange={(e) => handleSlideChange(i, "body", e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid var(--border)",
                    borderRadius: 4,
                    background: "var(--bg)",
                    color: "var(--text)",
                    fontSize: 13,
                    resize: "vertical",
                    lineHeight: 1.6,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Preview */}
      {pdfUrl && (
        <div className="card" style={{ padding: 24 }}>
          <div className="card-header" style={{ padding: 0, marginBottom: 20, border: "none" }}>
            <span className="card-title">Preview</span>
          </div>
          <iframe src={pdfUrl} style={{ width: "100%", height: 500, border: "1px solid var(--border)", borderRadius: 8 }} />
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <div className="card-header" style={{ padding: 0, marginBottom: 16, border: "none" }}>
            <span className="card-title">Histórico desta sessão</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Título</th><th>Marca</th><th>Template</th><th>Data</th><th>Ação</th></tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{h.title}</td>
                    <td><span className="badge badge-new" style={{ fontSize: 10 }}>{h.brand}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{TEMPLATES[h.template]?.label}</td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{h.date}</td>
                    <td>
                      <a href={h.url} download={`${h.brand}-deck.pdf`} className="btn btn-ghost btn-sm">⬇ PDF</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
