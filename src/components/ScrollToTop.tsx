import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Sobe ao topo em navegações novas (PUSH/REPLACE). No "voltar" do navegador
 * (POP) preserva a posição, como o usuário espera numa lista de blog/portfólio.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;
    window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
