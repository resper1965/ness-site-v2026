import { useBrand } from '../config/brand';
import NessHome from '../pages/Home';
import TrustnessHome from '../pages/trustness/Home';
import ForenseHome from '../pages/forense/Home';

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
