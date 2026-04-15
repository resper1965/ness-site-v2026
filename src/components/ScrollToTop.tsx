import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';



const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


export default ScrollToTop;
