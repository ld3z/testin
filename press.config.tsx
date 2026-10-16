import { defineConfig } from "fumapress";
import { Image } from "fumapress/image";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import type { LoaderPlugin } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/plugins/lucide-icons";
import type { Folder, Item, Node } from "fumadocs-core/page-tree";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import { Clipboard } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { ImageZoom, type ImageZoomProps } from "./src/components/image-zoom";
import { Gallery } from "./src/components/gallery";
import { Card, Cards } from "./src/components/card";
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

const docs = defineDocs({
  dir: "content",
  docs: {
    async: true,
    schema: pageSchema,
    lastModified: true,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  content: docs.toFumadocsSource(),
  site: {
    name: "Site4",
    // the URL where your site is deployed, needed for SEO features like sitemap:
    baseUrl: "https://ld3z.github.io/testin",
    git: {
      user: "ld3z",
      repo: "testin",
      branch: "main",
    },
  },
  mode: "static",
  loaderOptions: {
    plugins: [lucideIconsPlugin(), sidebarFoldersPlugin()],
  },
  meta: {
    root() {
      return (
        <link
          rel="icon"
          href={`${import.meta.env.BASE_URL}favicon.png`}
          type="image/png"
        />
      );
    },
  },
  defaultLayoutProps: {
    nav: {
      title: (
        <>
          <Image
            src={`${import.meta.env.BASE_URL}biggerIcon.png`}
            width={64}
            height={64}
            className="size-8"
            alt=""
          />
          Site4
        </>
      ),
    },
  },
})
  .adapters(
    fumadocsMdx({
      async getMdxComponents(page) {
        return {
          ...defaultMdxComponents,
          a: createRelativeLink(await this.getLoader(), page),
          img: (props) => <ImageZoom {...(props as ImageZoomProps)} />,
          Gallery,
          Card,
          Cards,
          Icon,
        } satisfies MDXComponents;
      },
    }),
  );
