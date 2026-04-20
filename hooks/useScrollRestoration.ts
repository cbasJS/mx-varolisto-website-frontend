"use client";

import { useEffect } from "react";

export function useScrollRestoration(): void {
  useEffect(() => {
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);
}
