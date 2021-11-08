import { NodeType } from './types'
import tc from 'ginlibs-type-check'

export type Options = {
  [p in NodeType]: (node: any, scope: any) => void
}

const noop: any = () => undefined

export const traverse = (node: any, opts: Options) => {
  const nodeMap: Partial<Record<NodeType, any>> = {}
  const type = node.type || 'root'
  const children = node.children || []
  nodeMap[type] = [{ node, children, level: 0 }]

  const checkNode = (nodeIts: any[], parentNode: any, count = 1) => {
    for (let i = 0; i < nodeIts.length; i++) {
      const it = nodeIts[i]
      const type = it.type
      if (!type) {
        continue
      }
      nodeMap[type] = nodeMap[type] || []
      const itChildList = it.children
      nodeMap[type].push({
        node: it,
        parent: parentNode,
        curList: nodeIts,
        children: itChildList,
        level: count,
        index: i,
      })
      if (tc.isArray(itChildList)) {
        checkNode(itChildList, it, count + 1)
      }
    }
  }

  checkNode(children, node, 1)

  for (const type of Object.keys(opts)) {
    const nodeList = nodeMap[type] || []
    const func = opts[type] || noop
    nodeList.forEach((it) => {
      func(it.node, it)
    })
  }
}
