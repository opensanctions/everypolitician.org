import { describe, it, expect } from 'vitest';

import { safeJsonLd } from './schema';

describe('safeJsonLd', () => {
  it('escapes </script> so a caption cannot break out of a JSON-LD block', () => {
    const out = safeJsonLd({
      name: '</script><script>alert(1)</script>',
    });

    expect(out).not.toContain('</script>');
    expect(out).not.toContain('<script>');
    expect(out).toContain('\\u003c/script\\u003e');
  });

  it('round-trips through JSON.parse', () => {
    const payload = { name: 'Foo </script> & <b>bar</b>' };
    expect(JSON.parse(safeJsonLd(payload))).toEqual(payload);
  });
});
