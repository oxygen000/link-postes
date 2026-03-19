import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContextProvider";
import { IoSunnyOutline } from "react-icons/io5";
import { RiMoonClearLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 p-2 rounded-full flex items-center justify-center
                 bg-card dark:bg-card-dark hover:bg-hover dark:hover:bg-hover-dark 
                 transition-colors duration-300 cursor-pointer relative overflow-hidden"
    >
      <AnimatePresence exitBeforeEnter initial={false}>
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <IoSunnyOutline className="w-6 h-6" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <RiMoonClearLine className="w-6 h-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
