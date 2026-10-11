import { Star } from 'lucide-react';
import { Card as BaseCard, type CardProps as BaseCardProps } from 'fumadocs-ui/components/card';

export { Cards } from 'fumadocs-ui/components/card';

export type CardProps = BaseCardProps & {
  /** Highlight the card as a preferred option. */
  favorite?: boolean;
};

export function Card({ favorite, title, className, ...props }: CardProps) {
  if (!favorite) return <BaseCard title={title} className={className} {...props} />;

  return (
    <BaseCard
      {...props}
      data-favorite=""
      className={`border-fd-primary/50 bg-fd-primary/5 ring-1 ring-fd-primary/20 ${className ?? ''}`}
      title={
        <span className="inline-flex items-center gap-1.5">
          {title}
          <span className="inline-flex items-center gap-1 rounded-full bg-fd-primary/15 px-1.5 py-0.5 text-xs font-medium text-fd-primary">
            <Star className="size-3 fill-current" aria-hidden />
            Preferred
          </span>
        </span>
      }
    />
  );
}
