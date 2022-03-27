import { NodeType } from './types'
import { Scope } from './scope'
import { isArray } from 'ginlibs-type-check'
import { Chain } from 'ginlibs-chain'
import { NodePath } from './nodePath'
import { getChainKey } from './utils'

export type Options = {
  [p in NodeType]?: (node: any, scope: Scope) => void
}

const noop: any = () => undefined

export const traverse = (node: any, opts: Options) => {
  const chain = new Chain()
  const key = node.key || node.type || 'root'
  const children = node.children || []
  const rootNode =
    node.getChain && node.getChain?.()
      ? node
      : new NodePath({
          chain,
          astNode: node,
          key,
          type: node.type,
        })

  chain.push(key, {
    astNode: node,
    nodePath: rootNode,
    type: node.type,
  })

  const checkNode = (nodeIts: any[], parentKey: string) => {
    for (let i = 0; i < nodeIts.length; i++) {
      const it = nodeIts[i]
      const itType = it.type
      if (!itType) {
        continue
      }
      const itKey = getChainKey(parentKey, i, itType)
      const itChildList = it.children
      const itNodePath = new NodePath({
        chain,
        astNode: it,
        key: itKey,
        type: itType,
      })
      chain.push(itKey, {
        astNode: it,
        nodePath: itNodePath,
        parentKey,
        type: itType,
        index: i,
      })
      if (isArray(itChildList)) {
        checkNode(itChildList, itKey)
      }
    }
  }
  checkNode(children, key)

  let cNode: any = chain.getHead()

  while (cNode) {
    const payload = cNode.payload || {}
    const { type, nodePath } = payload
    const func = opts[type] || noop
    func(nodePath)
    cNode = cNode.next
  }

  return rootNode
}
