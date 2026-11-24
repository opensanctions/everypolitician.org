import { OSA_URL } from '@/lib/constants';

interface FlagProps {
  code: string;
  className?: string;
}

/**
 * Show the flag for a territory code, sized by the caller's CSS.
 *
 * Safe for any code EP knows: the OpenSanctions flags API falls back to the
 * parent territory's flag or a neutral placeholder, so this never renders a
 * broken image. Decorative by design — every call site names the territory
 * next to the flag.
 */
export function Flag({ code, className }: FlagProps) {
  const src = `${OSA_URL}/flags/${encodeURIComponent(code.toLowerCase())}.svg`;
  return (
    <img
      src={src}
      alt=""
      className={['flag', className].filter(Boolean).join(' ')}
      loading="lazy"
    />
  );
}
