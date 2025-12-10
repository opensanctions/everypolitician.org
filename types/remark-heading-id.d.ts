import type { Plugin } from 'unified'

type Options = {
  defaults: boolean
}

declare module 'remark-heading-id' {
  const remarkHeadingId: Plugin<[(Options | undefined)?]>
  export default remarkHeadingId
}