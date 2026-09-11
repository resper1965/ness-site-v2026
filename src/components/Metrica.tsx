/**
 * Número de destaque com rótulo. Sai pronto do servidor: a contagem animada a
 * partir de zero publicava "0+" no HTML — sem JavaScript, e para o buscador,
 * a página dizia zero — e atrasava justamente o dado que o leitor veio buscar.
 */
export default function Metrica({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  return (
    <div className="text-center space-y-2">
      <div className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight">
        {value}
        <span className="text-primary-container">{suffix}</span>
      </div>
      <p className="text-xs text-on-surface-variant/80 uppercase tracking-widest font-medium">{label}</p>
    </div>
  );
}
