import { createContext, useState, ReactNode, useEffect } from "react";

export interface ITheme {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTheme: () => void;
  themeClass: string;
}
interface ThemeContextProviderProps {
  children: ReactNode;
}
export const ThemeContext = createContext<ITheme | undefined>(undefined);

const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    return savedTheme ? JSON.parse(savedTheme) : true; // Par défaut : mode sombre
  });

  const toggleTheme = () => {
    setIsDarkMode((previousValue: boolean) => !previousValue);
  };
  useEffect(() => {
    // Save the theme preference to localStorage

    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // isDarkMode variable  is used to condition the rendering according to the theme.
  const themeClass = isDarkMode ? "dark-theme" : "light-theme";

  const contextValue: ITheme = {
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
    themeClass,
  };
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContextProvider;
