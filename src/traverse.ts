import { NodeType } from './types'
import { Scope } from './scope'
import { isArray } from 'ginlibs-type-check'
import { Chain } from 'ginlibs-chain'
import { NodePath } from './nodePath'
import { getChainKey } from './utils'
import cache from 'ginlibs-cache'

export type Options = {
  [p in NodeType]?: (path: NodePath) => void
}

const noop: any = () => undefined

export const traverse = (node: any, opts: Options) => {
  const chain = new Chain()
  const children = node.children || []
  const hasChain = node.getChain && node.getChain?.()
  const astNode = hasChain ? node.node : node
  const type = node.type || 'root'
  const key = node.key || type
  const pathInfo = {
    chain,
    astNode,
    key,
    type,
  }

  const rootPath =
    node.getChain && node.getChain?.() ? node : new NodePath(pathInfo)

  chain.push(key, {
    nodePath: rootPath,
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
      const itPathInfo = {
        chain,
        astNode: it,
        parentKey,
        key: itKey,
        type: itType,
        index: i,
      }
      const itNodePath = new NodePath(itPathInfo)
      chain.push(itKey, {
        nodePath: itNodePath,
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
    const { nodePath } = payload
    const { type } = nodePath || {}
    const func = opts[type] || noop
    func(nodePath)
    cNode = cNode.next
  }
  return rootPath
}
