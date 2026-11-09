import { getCollection } from "astro:content";
import { toFumadocsSource } from "@fumadocs/astro/source";
import { createPress } from "@fumapress/astro/config";
import type { LoaderPlugin } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import type { Folder, Item, Node } from "fumadocs-core/page-tree";
import { Clipboard } from "lucide-react";
import type { ReactNode } from "react";
import { Icon } from "./src/components/icon";

/**
 * Sidebar folders only. Page files stay in `content/`, and their URLs stay the same.
 * `pages` entries are filenames without the extension.
 */
const sidebarFolders: { name: string; icon: ReactNode; pages: string[] }[] = [
  {
    name: "Resources",
    icon: <Clipboard />,
    pages: ["cuphead", "stardew"],
  },
  {
    name: "Roblox",
    icon: <Icon icon="mingcute:roblox-fill" className="size-4" />,
    pages: ["doors", "phantom-forces"],
  },
];

function sidebarFoldersPlugin(): LoaderPlugin {
  return {
    transformPageTree: {
      root(root) {
        const used = new Set<Item>();
        const folders: Folder[] = [];

        for (const group of sidebarFolders) {
          const children: Node[] = [];

          for (const slug of group.pages) {
            const page = root.children.find(
              (node): node is Item =>
                node.type === "page" && pageSlug(node.url) === slug && !used.has(node),
            );
            if (!page) continue;
            used.add(page);
            children.push(page);
          }

          if (children.length === 0) continue;

          folders.push({
            type: "folder",
            $id: `sidebar:${group.name}`,
            name: group.name,
            icon: group.icon,
            defaultOpen: true,
            children,
          });
        }

        const rest = root.children.filter(
          (node) => node.type !== "page" || !used.has(node),
        );
        const home = rest.filter(
          (node) => node.type === "page" && isHome(node.url),
        );
        const other = rest.filter((node) => !home.includes(node));

        root.children = [...home, ...folders, ...other];
        return root;
      },
    },
  };
}

function pathname(url: string) {
  const path = url.split(/[?#]/, 1)[0] ?? "";
  return path.replace(/\/+$/, "");
}

function pageSlug(url: string) {
  const path = pathname(url);
  return path.slice(path.lastIndexOf("/") + 1);
}

function isHome(url: string) {
  const path = pathname(url);
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/+$/, "");
  return path === base || path === "";
}

export const app = createPress(
  toFumadocsSource(await getCollection("docs"), await getCollection("meta")),
  {
    loaderPlugins: [lucideIconsPlugin(), sidebarFoldersPlugin()],
  },
);

export default app.config({
  site: {
    name: "Site4",
    git: {
      user: "ld3z",
      repo: "testin",
      branch: "main",
    },
  },
  head({ page }) {
    if (page) return;
    return [
      {
        tag: "link",
        attrs: { rel: "icon", href: this.withBase("/favicon.png"), type: "image/png" },
      },
    ];
  },
  ui: {
    layoutProps() {
      return {
        nav: {
          title: (
            <>
              <img
                src={this.withBase("/biggerIcon.png")}
                width={64}
                height={64}
                className="size-8"
                alt=""
              />
              Site4
            </>
          ),
        },
      };
    },
  },
});
