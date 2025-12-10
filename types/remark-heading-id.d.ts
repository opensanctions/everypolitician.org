declare module 'remark-heading-id' {
  import type { Plugin } from 'unified';

  type Options = {
    defaults: boolean;
  };

  const remarkHeadingId: Plugin<[(Options | undefined)?]>;
  export default remarkHeadingId;
}
