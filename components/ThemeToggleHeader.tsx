"use client";

import { Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const ThemeToggleHeader = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="p-4">
        <div className="flex items-center justify-between max-w-full mx-auto">
          <div className="flex items-center gap-2 pl-4">
            <Sparkles className="h-6 w-6 text-black dark:text-white" />
            <h1 className="text-left pl-2 text-black dark:text-white font-semibold">
              StudyBuddy
            </h1>
          </div>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-4"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              aria-label="Toggle theme"
            >
              <span className="sr-only">Toggle theme</span>
              {resolvedTheme === "dark" ? (
                <Sun className="h-6 w-6 text-white" />
              ) : (
                <Moon className="h-6 w-6 text-black" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ThemeToggleHeader;
