import { Fragment } from 'react';
import { NomeDeProduto } from './BlueDot';

/**
 * Desenha as marcas do ecossistema dentro de um texto corrido: Montserrat 500 e
 * o ponto sempre no azul da marca. A regra inegociável do brandbook vale também
 * no meio de uma frase — "a ness." num parágrafo com o ponto cinza é a regra
 * quebrada, e foi o exemplo que o Ricardo mandou em 10/09.
 *
 * trustness. vem antes de ness. na alternância, e ness. não casa colado a
 * letra ("business.") nem seguido de letra ("ness.com.br").
 */
export const MARCAS = /(n\.(?:secops|infraops|devarch|autoops|cirt)|forense\.io|trustness\.|(?<![\p{L}\p{N}])ness\.)(?![\p{L}\p{N}])/gu;

export default function ComMarcas({ children }: { children: string }) {
  const partes = children.split(MARCAS);
  return (
    <>
      {partes.map((parte, i) =>
        i % 2 ? (
          <span key={i} className="marca text-white">
            <NomeDeProduto nome={parte} />
          </span>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  );
}
