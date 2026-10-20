import { lookupCollection } from "@iconify/json";
import type { IconifyIcon } from "@iconify/react/offline";
import { getIconData } from "@iconify/utils";
import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import press from "fumapress/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";

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
  plugins: [
    iconifySubset(icons),
    press({ basePath: "/testin/" }),
    fumadocsMdx(),
    tailwindcss(),
  ],
});
