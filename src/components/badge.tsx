import { cva, type VariantProps } from 'class-variance-authority';
import Link, { type LinkProps } from 'fumadocs-core/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './icon';

export const badgeVariants = cva(
  'not-prose inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors [&_svg]:size-3.5 [&_svg]:shrink-0 [&_img]:size-3.5 [&_img]:shrink-0',
  {
    variants: {
      variant: {
        default: 'border-fd-border bg-fd-secondary text-fd-secondary-foreground',
        primary: 'border-fd-primary/30 bg-fd-primary/15 text-fd-primary',
        outline: 'border-fd-border bg-transparent text-fd-foreground',
      },
      interactive: {
        true: ' focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        interactive: true,
        className: 'hover:bg-fd-accent hover:text-fd-accent-foreground',
      },
      {
        variant: 'primary',
        interactive: true,
        className: 'hover:bg-fd-primary/25',
      },
      {
        variant: 'outline',
        interactive: true,
        className: 'hover:bg-fd-accent hover:text-fd-accent-foreground',
      },
    ],
    defaultVariants: {
      variant: 'default',
      interactive: false,
    },
  },
);

type BaseBadgeProps = Omit<VariantProps<typeof badgeVariants>, 'interactive'> & {
  /** Iconify icon name (e.g. `"simple-icons:discord"`) or custom React element. */
  icon?: string | ReactNode;
  /** Optional text label (alternative to passing `children`, handy for self-closing MDX `<Badge label="..." />`). */
  label?: ReactNode;
  children?: ReactNode;
};

export type BadgeProps = BaseBadgeProps &
  (
    | ({ href: string } & Omit<LinkProps, keyof BaseBadgeProps | 'href'>)
    | ({ href?: undefined } & Omit<ComponentPropsWithoutRef<'span'>, keyof BaseBadgeProps>)
  );

function resolveHref(href: string) {
  if (/^([a-z][a-z\d+.-]*:|\/\/|#)/i.test(href) || !href.startsWith('/')) {
    return href;
  }
  const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
  if (!base || href === base || href.startsWith(`${base}/`)) return href;
  return `${base}${href}`;
}

export function Badge({ icon, label, variant, className, children, ...props }: BadgeProps) {
  const renderedIcon =
    typeof icon === 'string' ? <Icon icon={icon} aria-hidden /> : icon;
  const content = children ?? label;
  const classes = cn(
    badgeVariants({ variant, interactive: Boolean(props.href) }),
    className,
  );

  if (props.href !== undefined) {
    return (
      <Link {...props} href={resolveHref(props.href)} className={classes}>
        {renderedIcon}
        {content}
      </Link>
    );
  }

  const { href: _, ...spanProps } = props;
  return (
    <span {...spanProps} className={classes}>
      {renderedIcon}
      {content}
    </span>
  );
}
