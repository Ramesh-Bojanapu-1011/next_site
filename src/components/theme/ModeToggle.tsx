"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className="flex items-center justify-center rounded-md border border-transparent bg-muted p-2 text-muted-foreground shadow-sm transition-colors dark:text-white hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
