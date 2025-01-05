import { createContext, useState, useEffect, useContext } from "react";

// Create the context
const OrientationContext = createContext(false);

interface props {
    children: React.ReactNode
}

// Provider component
export const OrientationProvider = ({ children}: props) => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <OrientationContext.Provider value={isPortrait}>
      {children}
    </OrientationContext.Provider>
  );
};

// Hook to use the context
export const useOrientation = () => useContext(OrientationContext);
