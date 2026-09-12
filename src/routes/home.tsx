import { useBrand } from '../config/brand';
import { homeMeta, routeMeta } from '../utils/meta';
import NessHome from '../pages/Home';
import TrustnessHome from '../pages/trustness/Home';
import ForenseHome from '../pages/forense/Home';

/**
 * A rota `/` serve as três marcas; o `handle` vale para todas elas. A frente 2
 * usa a home da forense.io como prova, e o `Layout` lê esta marca para decidir
 * se emite os scripts.
 */
export const handle = { semJs: true };

/**
 * "/" é a mesma rota nos três domínios, com conteúdo diferente. A marca vem
 * do Host, resolvida no loader da raiz — então o HTML que sai da edge já é o
 * da marca certa, sem esperar JavaScript.
 *
 * ponytail: as três homes vão no mesmo chunk (~27 kB a mais por marca). Com
 * import dinâmico o conteúdo da home — que é o LCP — passaria a esperar um
 * segundo round-trip. Se o custo incomodar, o caminho é build por marca.
 */
export default function Home() {
  const brand = useBrand();
  if (brand === 'trustness') return <TrustnessHome />;
  if (brand === 'forense') return <ForenseHome />;
  return <NessHome />;
}

export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (brand, lang) => homeMeta(brand, lang));
}
