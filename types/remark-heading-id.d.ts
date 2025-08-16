import type {Plugin} from 'unified'
import type {Root} from 'mdast'

type Options = {
  defaults: boolean
}

declare module 'remark-heading-id' {
  declare const remarkHeadingId: Plugin<[(Options | undefined)?], string, Root>
  export default remarkHeadingId
}