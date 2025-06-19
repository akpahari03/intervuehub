"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-0 glass-subtle liquid-hover">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-0 mt-2">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="liquid-hover rounded-lg mx-1 focus:bg-white/10"
        >
          <Sun className="mr-2 h-4 w-4 text-yellow-500" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="liquid-hover rounded-lg mx-1 focus:bg-white/10"
        >
          <Moon className="mr-2 h-4 w-4 text-blue-400" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="liquid-hover rounded-lg mx-1 focus:bg-white/10"
        >
          <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-yellow-500 to-blue-400" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}