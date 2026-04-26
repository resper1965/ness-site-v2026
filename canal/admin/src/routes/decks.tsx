import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { DeckDocument, BRANDS, TEMPLATES, type SlideContent } from "../components/decks/DeckDocument";

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
      setHistory((prev) => [{ title: title || "Sem título", brand, template, date, url }, ...prev]);
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
              {Object.entries(BRANDS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Template</label>
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="role-select" style={{ width: "100%" }}>
              {Object.entries(TEMPLATES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Título da Apresentação</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Proposta de Serviços para Empresa X"
              style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface-2)", color: "var(--text)", fontSize: 13 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-ghost" onClick={handleGenerate}>Montar Slides</button>
          {slides.length > 0 && (
            <button className="btn" style={{ background: "var(--accent)", color: "#fff" }} onClick={handleExportPdf} disabled={generating}>
              {generating ? "Gerando PDF..." : "Exportar PDF"}
            </button>
          )}
          {pdfUrl && <button className="btn btn-ghost" onClick={handleDownload}>⬇ Baixar PDF</button>}
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
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 16, background: "var(--surface-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--mono)" }}>
                    SLIDE {String(i + 2).padStart(2, "0")}
                  </span>
                  <input type="text" value={slide.title} onChange={(e) => handleSlideChange(i, "title", e.target.value)}
                    style={{ flex: 1, padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 4, background: "var(--bg)", color: "var(--text)", fontSize: 14, fontWeight: 600 }} />
                </div>
                <textarea value={slide.body} onChange={(e) => handleSlideChange(i, "body", e.target.value)} rows={3}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 4, background: "var(--bg)", color: "var(--text)", fontSize: 13, resize: "vertical", lineHeight: 1.6 }} />
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
              <thead><tr><th>Título</th><th>Marca</th><th>Template</th><th>Data</th><th>Ação</th></tr></thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{h.title}</td>
                    <td><span className="badge badge-new" style={{ fontSize: 10 }}>{h.brand}</span></td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{TEMPLATES[h.template]?.label}</td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{h.date}</td>
                    <td><a href={h.url} download={`${h.brand}-deck.pdf`} className="btn btn-ghost btn-sm">⬇ PDF</a></td>
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
