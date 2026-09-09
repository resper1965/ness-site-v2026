import React from "react";
import { Link, useLocation, useMatches } from "react-router";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import SchemaOrg from "./SchemaOrg";
import { BRAND_DOMAINS, BRAND_LABELS, useBrand } from "../config/brand";
import { idiomaDaRota, rotaNoIdioma, rotaSemIdioma } from "../utils/lang";
import { solutionsData } from "../data/solutionsData";

interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  /** Quando omitido, a trilha é deduzida da URL. */
  items?: Crumb[];
  /**
   * O JSON-LD vale em toda página interna; a trilha visível depende do
   * layout de cada uma — cada página tem seu próprio espaçamento no topo, e
   * uma trilha injetada de fora encosta na navbar fixa. Por isso o shell
   * emite só o schema, e a página que tem lugar para a trilha a renderiza.
   */
  semTrilhaVisivel?: boolean;
  semSchema?: boolean;
}

/** Título do conteúdo carregado pelo loader, quando a rota tem um. */
function tituloDoConteudo(matches: ReturnType<typeof useMatches>): string | null {
  for (const m of matches) {
    const dados = m.data as { post?: { title?: string }; item?: { project?: string } } | undefined;
    if (dados?.post?.title) return dados.post.title;
    if (dados?.item?.project) return dados.item.project;
  }
  return null;
}

/**
 * Trilha de navegação: caminho de volta para o visitante e hierarquia para o
 * Google, que a exibe no resultado de busca no lugar da URL crua.
 *
 * A raiz é a marca do domínio, não "ness." fixo — a mesma página é servida
 * pelos três.
 */
export default function Breadcrumbs({ items, semTrilhaVisivel, semSchema }: BreadcrumbsProps) {
  const { pathname } = useLocation();
  const matches = useMatches();
  const { t } = useTranslation();
  const brand = useBrand();
  const lang = idiomaDaRota(pathname);
  const base = rotaSemIdioma(pathname);

  const ROTULOS: Record<string, string> = {
    solucoes: t("nav.solutions", "soluções"),
    servicos: t("nav.services", "serviços"),
    verticais: "verticais",
    sobre: t("nav.about", "sobre"),
    portfolio: t("nav.portfolio", "portfólio"),
    blog: t("nav.blog", "insights"),
    carreiras: t("nav.careers", "carreiras"),
    contato: t("nav.contact", "contato"),
    compliance: "compliance",
    assessment: "assessment",
    trustness: "trustness.",
    forense: "forense.io",
    "dpo-as-a-service": "DPO as a Service",
    brandbook: "brandbook",
    obrigado: "obrigado",
  };

  const deduzidos: Crumb[] = base
    .split("/")
    .filter(Boolean)
    .map((segmento, i, todos) => {
      const ultimo = i === todos.length - 1;
      const caminho = "/" + todos.slice(0, i + 1).join("/");
      const titulo = ultimo ? tituloDoConteudo(matches) : null;
      return {
        label:
          ROTULOS[segmento] ??
          solutionsData[segmento]?.metaTitle?.split(" — ")[0] ??
          titulo ??
          segmento.replace(/-/g, " "),
        to: ultimo ? undefined : rotaNoIdioma(caminho, lang),
      };
    });

  // A home não tem trilha: não se navega de volta para onde já se está.
  const itens = items ?? deduzidos;
  if (itens.length === 0) return null;

  const crumbs: Crumb[] = [{ label: BRAND_LABELS[brand], to: rotaNoIdioma("/", lang) }, ...itens];

  return (
    <>
    {!semSchema && (
    <SchemaOrg
      type="breadcrumb"
      data={{
        items: crumbs.map((crumb, i) => ({
          name: crumb.label,
          url: BRAND_DOMAINS[brand] + (crumb.to ?? rotaNoIdioma(base, lang)),
          position: i + 1,
        })),
      }}
    />
    )}
    {!semTrilhaVisivel && (
    <nav
      aria-label={t("a11y.breadcrumb", "trilha de navegação")}
      className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-medium"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <ChevronRight
                size={10}
                className="text-on-surface-variant/70 shrink-0"
              />
            )}
            {isLast || !crumb.to ? (
              <span className="text-primary-container truncate max-w-[200px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="text-on-surface-variant/70 hover:text-on-surface-variant transition-colors truncate max-w-[120px]"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
    )}
    </>
  );
}
