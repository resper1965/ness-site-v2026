import { useState } from "react";
import { createEntry } from "../lib/api";

const BRANDS = ["ness", "aegis", "cavan", "tne"];
const DEPARTMENTS = ["Diretoria", "Engenharia", "Comercial", "Operações", "RH", "Financeiro", "Marketing"];

export default function SignaturesHub() {
  const [form, setForm] = useState({
    name: "João Silva",
    role: "Engenheiro de Software",
    email: "joao.silva@ness.com.br",
    phone: "+55 (11) 99999-9999",
    brand: "ness",
    department: "Engenharia",
    photo_url: "",
    linkedin: "https://linkedin.com/in/joaosilva"
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await createEntry("signatures", form);
      alert("Assinatura salva no histórico com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar assinatura");
    }
    setSaving(false);
  };

  const copyHTML = () => {
    const html = document.getElementById("signature-preview")?.innerHTML || "";
    navigator.clipboard.writeText(html);
    alert("HTML copiado para a área de transferência!");
  };

  const colors = {
    ness: "#1A56DB",
    aegis: "#DC2626",
    cavan: "#059669",
    tne: "#7C3AED",
  } as Record<string, string>;

  const brandColor = colors[form.brand] || "#333";

  return (
    <div>
      <div className="collection-toolbar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2>Gerador de Assinaturas de Email</h2>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar no Histórico"}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 1.5fr)', gap: '2rem' }}>
        {/* Formulário */}
        <div className="card">
          <h3>Dados do Colaborador</h3>
          <div className="form" style={{ marginTop: 20 }}>
            <div className="field">
              <label>Nome Completo</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="field">
              <label>Cargo</label>
              <input value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="field">
              <label>Telefone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>Marca</label>
                <select value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Departamento</label>
                <select value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label>URL da Foto (opcional)</label>
              <input value={form.photo_url} onChange={e => setForm({...form, photo_url: e.target.value})} />
            </div>
            <div className="field">
              <label>URL do LinkedIn</label>
              <input value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Preview HTML</h3>
            <button className="btn btn-ghost btn-sm" onClick={copyHTML}>Copiar Código</button>
          </div>
          
          <div style={{ border: '1px solid var(--border)', padding: '2rem', marginTop: 20, flex: 1, backgroundColor: '#fff', color: '#000', borderRadius: 8, display: 'flex', alignItems: 'center' }}>
            <div id="signature-preview" style={{ width: '100%' }}>
              <table cellPadding={0} cellSpacing={0} border={0} style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#333' }}>
                <tbody>
                  <tr>
                    {form.photo_url && (
                      <td style={{ paddingRight: '20px', verticalAlign: 'top' }}>
                        <img src={form.photo_url} alt={form.name} width="80" height="80" style={{ borderRadius: '50%', objectFit: 'cover' }} />
                      </td>
                    )}
                    <td style={{ borderLeft: `3px solid ${brandColor}`, paddingLeft: '20px', verticalAlign: 'top' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold', color: '#111' }}>
                        {form.name}
                      </p>
                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                        {form.role} {form.department ? ` • ${form.department}` : ''}
                      </p>
                      <p style={{ margin: '0 0 4px 0' }}>
                        <a href={`mailto:${form.email}`} style={{ color: brandColor, textDecoration: 'none', fontWeight: 'bold' }}>{form.email}</a>
                      </p>
                      {form.phone && (
                        <p style={{ margin: '0 0 4px 0', color: '#555' }}>
                          {form.phone}
                        </p>
                      )}
                      {form.linkedin && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                          <a href={form.linkedin} style={{ color: '#0077b5', textDecoration: 'none' }}>LinkedIn</a>
                        </p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
