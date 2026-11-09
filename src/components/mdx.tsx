import defaultMdxComponents from "fumadocs-ui/mdx";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import type { MDXComponents } from "mdx/types";
import { ImageZoom, type ImageZoomProps } from "./image-zoom";
import { Gallery } from "./gallery";
import { Card, Cards } from "./card";
import { Badge } from "./badge";
import { Icon } from "./icon";
import { Tooltip } from "./tooltip";
import { withBase } from "../lib/with-base";

export default {
  ...defaultMdxComponents,
  ImageZoom: (props: ImageZoomProps) => (
    <ImageZoom
      {...props}
      src={typeof props.src === "string" ? withBase(props.src) : props.src}
    />
  ),
  Accordion,
  Accordions,
  Gallery,
  Card,
  Cards,
  Badge,
  Icon,
  Tooltip,
} satisfies MDXComponents;
