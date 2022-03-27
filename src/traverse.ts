import { NodeType } from './types'
import { Scope } from './scope'
import { isArray } from 'ginlibs-type-check'
import { Chain } from 'ginlibs-chain'
import { NodePath } from './nodePath'

export type Options = {
  [p in NodeType]?: (node: any, scope: Scope) => void
}

const IDX = '_idx_'
const TYPE = '_type_'

export const traverse = (node: any, opts: Options) => {
  const chain = new Chain()
  const key = node.key || node.type || 'root'
  const children = node.children || []
  const rootNode = node._traverseChain
    ? node
    : new NodePath({
        chain,
        astNode: node,
        key,
      })

  chain.push(key, {
    astNode: node,
    nodePath: rootNode,
  })

  const checkNode = (nodeIts: any[], parentKey: string) => {
    for (let i = 0; i < nodeIts.length; i++) {
      const it = nodeIts[i]
      const itType = it.type
      if (!itType) {
        continue
      }
      const itKey = `${parentKey}${IDX}${i}${TYPE}${itType}`
      const itChildList = it.children
      const itNodePath = new NodePath({
        chain,
        astNode: it,
        key: itKey,
      })
      chain.push(itKey, {
        astNode: it,
        nodePath: itNodePath,
        parentKey,
        index: i,
      })
      if (isArray(itChildList)) {
        checkNode(itChildList, itKey)
      }
    }
  }

  checkNode(children, key)

  return rootNode
}
