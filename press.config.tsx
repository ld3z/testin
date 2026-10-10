import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import defaultMdxComponents, { createRelativeLink } from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ImageZoom, type ImageZoomProps } from "./src/components/image-zoom";

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
    name: "test",
    // the URL where your site is deployed, needed for SEO features like sitemap:
    baseUrl: "https://ld3z.github.io/testin",
    git: {
      user: "ld3z",
      repo: "testin",
      branch: "main",
    },
  },
  mode: "static",
})
  .adapters(
    fumadocsMdx({
      async getMdxComponents(page) {
        return {
          ...defaultMdxComponents,
          a: createRelativeLink(await this.getLoader(), page),
          img: (props) => <ImageZoom {...(props as ImageZoomProps)} />,
        } satisfies MDXComponents;
      },
    }),
  );
