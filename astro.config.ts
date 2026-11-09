import { lookupCollection } from "@iconify/json";
import type { IconifyIcon } from "@iconify/react/offline";
import { getIconData } from "@iconify/utils";
import { defineConfig } from "astro/config";
import type { Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import press from "@fumapress/astro";
import { imageZoomPlugin } from "./src/lib/image-zoom-plugin";

/**
 * Only these icons are extracted from `@iconify/json` and bundled.
 */
const icons = [
  "mingcute:roblox-fill",
  "simple-icons:miraheze",
  "simple-icons:fandom",
  "simple-icons:discord",
  "simple-icons:patreon",
  "codicon:twitter",
  "logos:youtube-icon",
  "mdi:spotify",
  "mdi:reddit",
  "mdi:github-face",
  "selfhst:google-sheets",
  "selfhst:google-docs",
  "ri:information-2-line",
];

function iconifySubset(iconNames: string[]): Plugin {
  const virtualId = "virtual:iconify-icons";
  const resolvedId = "\0" + virtualId;

  return {
    name: "iconify-subset",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    async load(id) {
      if (id !== resolvedId) return;

      const byPrefix = new Map<string, string[]>();
      for (const icon of iconNames) {
        const [prefix, name] = icon.split(":");
        if (!prefix || !name) continue;
        const list = byPrefix.get(prefix) ?? [];
        list.push(name);
        byPrefix.set(prefix, list);
      }

      const resolved: Record<string, IconifyIcon> = {};
      for (const [prefix, names] of byPrefix) {
        const collection = await lookupCollection(prefix);
        for (const name of names) {
          const data = getIconData(collection, name);
          if (data) {
            resolved[`${prefix}:${name}`] = data;
          }
        }
      }

      return `export default ${JSON.stringify(resolved)};`;
    },
  };
}

export default defineConfig({
  // the URL where your site is deployed, needed for SEO features like sitemap:
  site: "https://ld3z.github.io",
  base: "/testin/",
  integrations: [
    press({
      collections: { docs: { dir: "content" } },
      components: "./src/components/mdx.tsx",
      mdastPlugins: [imageZoomPlugin()],
      lastModified: true,
      includeProcessedMarkdown: true,
    }),
  ],
  vite: {
    plugins: [iconifySubset(icons), tailwindcss()],
  },
});
