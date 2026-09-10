import type { Ator } from './Glifo';

/**
 * O caminho de um evento pelo n.secops: das fontes aos agentes de IA, deles ao
 * time de segurança quando é preciso julgar, e a você. O tracejado é o
 * contrato. É o modelo de operação do n.secops desenhado — por isso os textos
 * dos nós moram aqui, e só as fontes vêm do dado.
 *
 * Dois desenhos, não um escalado: no celular o horizontal cairia para texto
 * de 4 px. O vertical é o mesmo grafo, rearranjado.
 */

const TEXTO = 'fill-on-surface text-[12px]';
const ROTULO = 'fill-on-surface-variant text-[12px]';
const SETA = 'fill-none stroke-on-surface-variant';

const NO: Record<Ator, { titulo: string; linhas: [string, string]; caixa: string; marca: string }> = {
  ia: {
    titulo: 'agentes de IA',
    linhas: ['correlação 24×7', 'triagem e prioridade'],
    caixa: 'fill-primary-container/15 stroke-primary-container/70',
    marca: 'fill-primary-container',
  },
  time: {
    titulo: 'time de segurança',
    linhas: ['valida, investiga', 'e intervém'],
    caixa: 'fill-primary/10 stroke-primary/50',
    marca: 'fill-none stroke-primary stroke-2',
  },
  voce: {
    titulo: 'você',
    linhas: ['no canal combinado', 'e no portal'],
    caixa: 'fill-on-surface/5 stroke-on-surface/40',
    marca: 'fill-on-surface',
  },
};

function No({ ator, x, y, w, h }: { ator: Ator; x: number; y: number; w: number; h: number }) {
  const { titulo, linhas, caixa, marca } = NO[ator];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={caixa} />
      <circle cx={x + 18} cy={y + 22} r={ator === 'time' ? 5 : 6} className={marca} />
      <text x={x + 32} y={y + 27} className="fill-white font-display text-[14px] font-semibold">{titulo}</text>
      <text x={x + 18} y={y + 52} className={TEXTO}>{linhas[0]}</text>
      <text x={x + 18} y={y + 70} className={TEXTO}>{linhas[1]}</text>
    </g>
  );
}

function Seta({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" className="fill-on-surface-variant" />
      </marker>
    </defs>
  );
}

function Marca({ x, y }: { x: number; y: number }) {
  return (
    <text x={x} y={y} className="fill-on-surface font-brand text-[13px] font-medium">
      n<tspan className="fill-primary-container">.</tspan>secops
    </text>
  );
}

const DESCRICAO =
  'Eventos das suas fontes chegam aos agentes de IA do n.secops. Eles contêm o que já está autorizado no runbook, escalam ao time de segurança o que precisa de julgamento e notificam você conforme a severidade; o time aciona você com contexto.';

export default function FluxoDoEvento({ fontes }: { fontes?: string[] }) {
  if (!fontes?.length) return null;

  return (
    <section id="fluxo" className="mb-24">
      <figure className="rounded-3xl border border-white/5 bg-surface-container-low/60 p-4 md:p-8">
        <svg viewBox="0 0 960 330" role="img" aria-label={DESCRICAO} className="hidden h-auto w-full font-sans md:block">
          <Seta id="seta-h" />
          <text x={0} y={34} className={ROTULO}>suas fontes</text>
          {fontes.map((fonte, i) => (
            <g key={fonte}>
              <rect x={0} y={50 + i * 40} width={150} height={30} rx={6} className="fill-surface-container-lowest stroke-surface-container-highest" />
              <text x={75} y={69.5 + i * 40} textAnchor="middle" className={TEXTO}>{fonte}</text>
              <line x1={150} y1={65 + i * 40} x2={238} y2={140 + i * 11} className="stroke-surface-container-highest" strokeWidth={1.5} />
            </g>
          ))}
          <text x={194} y={254} textAnchor="middle" className={ROTULO}>eventos e logs</text>

          <rect x={222} y={88} width={496} height={156} rx={14} strokeDasharray="5 5" className="fill-none stroke-surface-container-highest" />
          <Marca x={240} y={110} />
          <No ator="ia" x={240} y={122} w={180} h={92} />
          <No ator="time" x={520} y={122} w={180} h={92} />
          <No ator="voce" x={800} y={122} w={160} h={92} />

          <g className={SETA} strokeWidth={1.5}>
            <line x1={420} y1={168} x2={516} y2={168} markerEnd="url(#seta-h)" />
            <line x1={700} y1={168} x2={796} y2={168} markerEnd="url(#seta-h)" />
            <path d="M330,122 V58 H880 V118" markerEnd="url(#seta-h)" />
            <path d="M330,214 V300 H75 V284" markerEnd="url(#seta-h)" />
          </g>
          <text x={468} y={146} textAnchor="middle" className={ROTULO}>precisa de</text>
          <text x={468} y={159} textAnchor="middle" className={ROTULO}>julgamento</text>
          <text x={756} y={146} textAnchor="middle" className={ROTULO}>aciona com</text>
          <text x={756} y={159} textAnchor="middle" className={ROTULO}>contexto</text>
          <text x={605} y={50} textAnchor="middle" className={ROTULO}>notificação e registro, conforme a severidade</text>
          <text x={202} y={320} textAnchor="middle" className={ROTULO}>contém, quando a ação já está autorizada no runbook</text>
        </svg>

        <svg viewBox="0 0 372 580" role="img" aria-label={DESCRICAO} className="block h-auto w-full font-sans md:hidden">
          <Seta id="seta-v" />
          <rect x={16} y={8} width={340} height={104} rx={10} className="fill-surface-container-lowest stroke-surface-container-highest" />
          <text x={28} y={30} className={ROTULO}>suas fontes</text>
          {fontes.map((fonte, i) => {
            const x = 28 + (i % 3) * 108;
            const y = 40 + Math.floor(i / 3) * 36;
            return (
              <g key={fonte}>
                <rect x={x} y={y} width={100} height={28} rx={6} className="fill-surface stroke-surface-container-highest" />
                <text x={x + 50} y={y + 18.5} textAnchor="middle" className={TEXTO}>{fonte}</text>
              </g>
            );
          })}

          <rect x={48} y={160} width={276} height={252} rx={14} strokeDasharray="5 5" className="fill-none stroke-surface-container-highest" />
          <Marca x={62} y={180} />
          <No ator="ia" x={78} y={192} w={216} h={80} />
          <No ator="time" x={78} y={320} w={216} h={80} />
          <No ator="voce" x={78} y={480} w={216} h={80} />

          <g className={SETA} strokeWidth={1.5}>
            <line x1={186} y1={112} x2={186} y2={188} markerEnd="url(#seta-v)" />
            <line x1={186} y1={272} x2={186} y2={316} markerEnd="url(#seta-v)" />
            <line x1={186} y1={400} x2={186} y2={476} markerEnd="url(#seta-v)" />
            <path d="M78,232 H30 V116" markerEnd="url(#seta-v)" />
            <path d="M294,232 H348 V520 H298" markerEnd="url(#seta-v)" />
          </g>
          <text x={198} y={152} className={ROTULO}>eventos e logs</text>
          <text x={38} y={134} className={ROTULO}>contém, se</text>
          <text x={38} y={148} className={ROTULO}>autorizado</text>
          <text x={198} y={290} className={ROTULO}>precisa de</text>
          <text x={198} y={303} className={ROTULO}>julgamento</text>
          <text x={198} y={436} className={ROTULO}>aciona com</text>
          <text x={198} y={449} className={ROTULO}>contexto</text>
          <text x={362} y={376} textAnchor="middle" transform="rotate(-90 362 376)" className={ROTULO}>notificação e registro</text>
        </svg>

        <figcaption className="mt-4 max-w-3xl text-sm leading-relaxed text-on-surface-variant">
          O caminho de um evento. O tracejado é o n.secops: tudo dentro dele a ness. opera. Contenção só acontece sem
          consulta quando a ação já está autorizada no runbook.
        </figcaption>
      </figure>
    </section>
  );
}
