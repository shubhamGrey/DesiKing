"use client";

import { useState, useCallback } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/styles/theme";

/**
 * ThemeRegistry ensures MUI Emotion styles are properly
 * flushed during SSR and rehydrated on the client,
 * preventing hydration mismatches.
 */
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = useState(() => {
    const c = createCache({ key: "mui" });
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(
    useCallback(() => {
      const names = Object.keys(cache.inserted);
      if (names.length === 0) return null;

      let styles = "";
      const dataEmotionAttribute = cache.key;

      const flushedNames: string[] = [];
      for (const name of names) {
        const val = cache.inserted[name];
        if (typeof val === "string") {
          styles += val;
          flushedNames.push(name);
        }
      }
      // Don't delete names from cache.inserted here — Emotion
      // needs them for de-duplication during rehydration.

      if (styles.length === 0) return null;

      return (
        <style
          key={dataEmotionAttribute}
          data-emotion={`${dataEmotionAttribute} ${flushedNames.join(" ")}`}
          dangerouslySetInnerHTML={{ __html: styles }}
        />
      );
    }, [cache])
  );

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
