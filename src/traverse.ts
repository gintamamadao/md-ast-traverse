import { NodeType } from './types'
import tc from 'ginlibs-type-check'

export type Options = {
  [p in NodeType]: (node: any) => void
}

const noop: any = () => undefined

export const traverse = (node: any, opts: Options) => {
  const nodeMap: Partial<Record<NodeType, any>> = {}
  const type = node.type || 'root'
  const children = node.children || []
  nodeMap[type] = [node]

  const checkNode = (nodeIts: any[]) => {
    for (const it of nodeIts) {
      const type = it.type
      if (!type) {
        continue
      }
      nodeMap[type] = it
      const itChildList = it.children
      if (tc.isArray(itChildList)) {
        checkNode(itChildList)
      }
    }
  }

  checkNode(children)

  for (const type of Object.keys(opts)) {
    const nodeList = nodeMap[type] || []
    const func = opts[type] || noop
    nodeList.forEach((it) => {
      func(it)
    })
  }
}
