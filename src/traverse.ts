import { NodeType } from './types'
import { Scope } from './scope'
import tc from 'ginlibs-type-check'

export type Options = {
  [p in NodeType]?: (node: any, scope: Scope) => void
}

const noop: any = () => undefined

export const traverse = (node: any, opts: Options) => {
  const nodeMap: Partial<Record<NodeType, any>> = {}
  const type = node.type || 'root'
  const children = node.children || []
  const nodeScope = new Scope({ node, children, level: 0, nodeMap })
  nodeMap[type] = [nodeScope]

  const checkNode = (nodeIts: any[], parentScope: any, count = 1) => {
    for (let i = 0; i < nodeIts.length; i++) {
      const it = nodeIts[i]
      const type = it.type
      if (!type) {
        continue
      }
      nodeMap[type] = nodeMap[type] || []
      const itChildList = it.children
      const itScope = new Scope({
        node: it,
        parent: parentScope.node,
        parentScope,
        curList: nodeIts,
        children: itChildList,
        level: count,
        index: i,
      })
      nodeMap[type].push(itScope)
      if (tc.isArray(itChildList)) {
        checkNode(itChildList, itScope, count + 1)
      }
    }
  }

  checkNode(children, nodeScope, 1)

  for (const type of Object.keys(opts)) {
    const nodeList = nodeMap[type] || []
    const func = opts[type] || noop
    nodeList.forEach((it) => {
      func(it.node, it)
    })
  }
}
