type ImageNode = { url: string; alt?: string | null; title?: string | null };

/**
 * Astro renders Markdown images outside the React island of the page, so they
 * would skip the `ImageZoom` component and the base path. Rewriting them to
 * `<ImageZoom>` keeps them inside the island.
 */
export function imageZoomPlugin() {
  return {
    name: "image-zoom",
    image(node: ImageNode) {
      const attributes = [
        { type: "mdxJsxAttribute", name: "src", value: node.url },
        { type: "mdxJsxAttribute", name: "alt", value: node.alt ?? "" },
      ];
      if (node.title) attributes.push({ type: "mdxJsxAttribute", name: "title", value: node.title });

      return {
        type: "mdxJsxTextElement",
        name: "ImageZoom",
        attributes,
        children: [],
      } as never;
    },
  };
}
