export function withBase(src: string) {
  if (/^([a-z][a-z\d+.-]*:|\/\/)/i.test(src)) return src;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (base && src.startsWith(`${base}/`)) return src;
  return `${base}/${src.replace(/^\//, '')}`;
}
