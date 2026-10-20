'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import type { ReactNode } from 'react';
import { Icon } from '../icon';
import { tooltips } from './content';

const linkClass =
  'text-[#3451b2] underline hover:text-[#3a5ccc] hover:no-underline dark:text-[#a8b1ff] dark:hover:text-[#5c73e7]';

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let index = 0;

  for (const match of text.matchAll(LINK)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    const href = match[2] ?? '';
    nodes.push(
      <a key={`${keyPrefix}-${index++}`} href={href} className={linkClass}>
        {match[1]}
      </a>,
    );
    last = start + match[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function TooltipMarkdown({ source }: { source: string }) {
  const blocks: ReactNode[] = [];
  let items: string[] = [];
  let id = 0;

  const flush = () => {
    if (items.length === 0) return;
    const list = items;
    items = [];
    const listId = id++;
    blocks.push(
      <ul key={listId}>
        {list.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInline(item, `${listId}-${itemIndex}`)}</li>
        ))}
      </ul>,
    );
  };

  for (const raw of source.replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith('- ')) {
      items.push(line.slice(2));
      continue;
    }
    flush();
    const paragraphId = id++;
    blocks.push(<p key={paragraphId}>{renderInline(line, `p-${paragraphId}`)}</p>);
  }

  flush();
  return blocks;
}

export type TooltipProps = {
  /** Key in the shared tooltip dictionary, same as site4 (`tooltipKey="stardew-wiki"`). */
  tooltipKey?: string;
  /** Overrides the default "Info" heading. */
  title?: string;
  /** Iconify icon name. Defaults to the remix information icon. */
  icon?: string | ReactNode;
  /** Inline body. Used when `tooltipKey` is omitted. */
  children?: ReactNode;
};

export function Tooltip({
  tooltipKey,
  title,
  icon = 'ri:information-2-line',
  children,
}: TooltipProps) {
  const entry = tooltipKey ? tooltips[tooltipKey] : undefined;
  const resolvedTitle = title ?? (entry || children ? 'Info' : 'Tooltip Error');
  const renderedIcon =
    typeof icon === 'string' ? <Icon icon={icon} aria-hidden className="size-4" /> : icon;

  let body: ReactNode;
  if (children) {
    body = children;
  } else if (entry) {
    body = <TooltipMarkdown source={entry.content} />;
  } else {
    body = (
      <p>
        Tooltip content not found
        {tooltipKey ? (
          <>
            {' '}
            for key: <code>{tooltipKey}</code>
          </>
        ) : null}
        .
      </p>
    );
  }

  return (
    <TooltipPrimitive.Provider delay={0} closeDelay={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger
          aria-label={resolvedTitle}
          closeOnClick={false}
          className="not-prose inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-solid border-[rgba(100,108,255,0.16)] bg-[rgba(100,108,255,0.16)] align-middle text-[#3c3c43] select-none transition-all duration-300 hover:border-[#3451b2] hover:bg-[rgba(100,108,255,0.06)] focus-visible:ring-2 focus-visible:ring-[#3451b2] focus-visible:outline-none dark:text-[#dfdfd6] dark:hover:border-[#a8b1ff] dark:hover:bg-[rgba(100,108,255,0.06)] dark:focus-visible:ring-[#a8b1ff]"
        >
          {renderedIcon}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner side="top" sideOffset={8} className="z-50">
            <TooltipPrimitive.Popup className="w-max max-w-lg origin-(--transform-origin) rounded-2xl border-2 border-solid border-[#e2e2e3] bg-[#f6f6f7] p-4 text-[#3c3c43] shadow-none transition-opacity duration-150 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 dark:border-[#2e2e32] dark:bg-[#161618] dark:text-[#dfdfd6]">
              <h3 className="mb-2 text-lg leading-7 font-semibold">{resolvedTitle}</h3>
              <div className="text-sm text-[#67676c] dark:text-[#98989f] [&_a]:text-[#3451b2] [&_a]:underline hover:[&_a]:text-[#3a5ccc] hover:[&_a]:no-underline dark:[&_a]:text-[#a8b1ff] dark:hover:[&_a]:text-[#5c73e7] [&_li]:my-0 [&_li]:list-item [&_ol]:my-0 [&_ol]:list-decimal [&_ol]:pl-[15px] [&_p]:my-0 [&_ul]:my-0 [&_ul]:list-disc [&_ul]:pl-[15px]">
                {body}
              </div>
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
