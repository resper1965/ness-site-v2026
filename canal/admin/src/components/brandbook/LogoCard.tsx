interface LogoCardProps {
  logo: Record<string, any>;
}

function downloadUrl(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function generateSVG(title: string, mode: 'light' | 'dark') {
  const parts = title.split('.');
  const width = title.length * 15 + 10;
  const textColor = mode === 'light' ? '#0f172a' : '#ffffff';

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 32" width="${width}" height="32">`;
  svg += `<style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap'); text { font-family: 'Montserrat', Arial, sans-serif; }</style>`;

  if (parts.length === 1) {
    svg += `<text x="0" y="26" font-size="26" font-weight="500" letter-spacing="-0.03em" fill="${textColor}">${parts[0]}</text>`;
  } else {
    const p0Width = parts[0].length * 15;
    svg += `<text x="0" y="26" font-size="26" font-weight="500" letter-spacing="-0.03em" fill="${textColor}">${parts[0]}</text>`;
    svg += `<text x="${p0Width}" y="26" font-size="26" font-weight="500" letter-spacing="-0.03em" fill="#00ade8">.</text>`;
    if (parts[1]) {
      svg += `<text x="${p0Width + 9}" y="26" font-size="26" font-weight="500" letter-spacing="-0.03em" fill="${textColor}">${parts[1]}</text>`;
    }
  }
  svg += `</svg>`;
  return svg;
}

function generatePNG(title: string, mode: 'light' | 'dark') {
  const parts = title.split('.');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scale = 4;
  canvas.width = (title.length * 15 + 20) * scale;
  canvas.height = 40 * scale;

  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '500 26px Montserrat, Arial, sans-serif';
  ctx.textBaseline = 'top';

  const textColor = mode === 'light' ? '#0f172a' : '#ffffff';
  let currentX = 0;

  ctx.fillStyle = textColor;
  ctx.fillText(parts[0], currentX, 4);
  currentX += ctx.measureText(parts[0]).width - 2;

  if (parts.length > 1) {
    ctx.fillStyle = '#00ade8';
    ctx.fillText('.', currentX, 4);
    currentX += ctx.measureText('.').width - 2;
    if (parts[1]) {
      ctx.fillStyle = textColor;
      ctx.fillText(parts[1], currentX, 4);
    }
  }

  return canvas.toDataURL('image/png');
}

function LogoPreview({ parts, mode }: { parts: string[]; mode: 'light' | 'dark'; previewUrl?: string }) {
  const bg = mode === 'light' ? '#ffffff' : '#060e20';
  const border = mode === 'light' ? '#e2e8f0' : '#1e293b';
  const textColor = mode === 'light' ? '#0f172a' : '#ffffff';
  const labelColor = mode === 'light' ? '#94a3b8' : '#475569';

  return (
    <div style={{ height: 75, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: `1px solid ${border}`, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 4, left: 6, fontSize: 9, fontWeight: 700, color: labelColor, textTransform: 'uppercase' }}>
        {mode === 'light' ? 'Light' : 'Dark'}
      </div>
      <span style={{ fontWeight: 500, fontFamily: 'Montserrat, sans-serif', fontSize: 22, letterSpacing: '-0.03em', color: textColor }}>
        {parts.map((part: string, i: number, arr: string[]) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && <span style={{ color: '#00ade8' }}>.</span>}
          </span>
        ))}
      </span>
    </div>
  );
}

export function LogoCard({ logo }: LogoCardProps) {
  const isSynthetic = !logo.preview_url;
  const parts = logo.title.split('.');

  const handleDownloadSVG = (mode: 'light' | 'dark') => {
    const svg = generateSVG(logo.title, mode);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    downloadUrl(URL.createObjectURL(blob), `${logo.title.replace('.', '')}-logo-${mode}-transparent.svg`);
  };

  const handleDownloadPNG = (mode: 'light' | 'dark') => {
    const url = generatePNG(logo.title, mode);
    if (url) downloadUrl(url, `${logo.title.replace('.', '')}-logo-${mode}-transparent.png`);
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', textAlign: 'center', background: 'var(--surface-2)', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {logo.preview_url ? (
          <>
            <div style={{ height: 75, backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 4, left: 6, fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Light</div>
              <img src={logo.preview_url} alt={logo.title} style={{ maxWidth: '80%', maxHeight: 40, objectFit: 'contain' }} />
            </div>
            <div style={{ height: 75, backgroundColor: '#060e20', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid #1e293b', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 4, left: 6, fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Dark</div>
              <img src={logo.preview_url} alt={logo.title} style={{ maxWidth: '80%', maxHeight: 40, objectFit: 'contain' }} />
            </div>
          </>
        ) : (
          <>
            <LogoPreview parts={parts} mode="light" />
            <LogoPreview parts={parts} mode="dark" />
          </>
        )}
      </div>

      <div style={{ fontWeight: 600, marginTop: 16, fontSize: 13 }}>{logo.title}</div>

      {isSynthetic ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button onClick={() => handleDownloadPNG('light')} style={{ background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(0, 173, 232, 0.2)' }} title="Baixar PNG Fundo Claro">
              PNG (Light)
            </button>
            <button onClick={() => handleDownloadSVG('light')} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }} title="Baixar SVG Fundo Claro">
              SVG (Light)
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button onClick={() => handleDownloadPNG('dark')} style={{ background: '#0b1326', color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }} title="Baixar PNG Fundo Escuro">
              PNG (Dark)
            </button>
            <button onClick={() => handleDownloadSVG('dark')} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }} title="Baixar SVG Fundo Escuro">
              SVG (Dark)
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <button onClick={() => navigator.clipboard.writeText(logo.title)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontSize: 11 }} title="Copiar texto do logo">
            Copiar Nome
          </button>
        </div>
      )}
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{logo.brand}</div>
    </div>
  );
}
