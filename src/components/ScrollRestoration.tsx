import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

const scrollPositions = new Map<string, number>();

function ScrollRestoration() {
  const location = useLocation();

  useLayoutEffect(() => {
    const pos = scrollPositions.get(location.key) ?? 0;
    window.scrollTo(0, pos);

    const handleScroll = () => {
      scrollPositions.set(location.key, window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  return null;
}


export default ScrollRestoration;