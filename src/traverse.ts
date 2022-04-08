import { NodeType } from './types'
import { isArray } from 'ginlibs-type-check'
import { Chain } from 'ginlibs-chain'
import { NodePath } from './nodePath'
import { getChainKey, IDX } from './utils'
import cache from 'ginlibs-cache'

export type MDEleTypeHandleMap = {
  [p in NodeType]?: (path: NodePath) => void
}

export interface Options {
  level?: number // 指遍历 ast 树的第几层
}

const noop: any = () => undefined

export const traverse = (
  node: any,
  typeHandleMap: MDEleTypeHandleMap,
  opts: Options = {}
) => {
  const { level = Number.MAX_SAFE_INTEGER } = opts
  const children = node.children || []
  const nodeChain = node.getChain && node.getChain?.()
  const chain = nodeChain || new Chain()
  const astNode = nodeChain ? node.node : node
  const type = node.type || 'root'
  const key = node.key || type
  const pathInfo = {
    chain,
    astNode,
    key,
    type,
  }
  const rootPath = nodeChain ? node : new NodePath(pathInfo)

  if (!nodeChain) {
    chain.push(key, {
      nodePath: rootPath,
    })
  }

  const checkNode = (nodeIts: any[], parentKey: string) => {
    for (let i = 0; i < nodeIts.length; i++) {
      const it = nodeIts[i]
      const itType = it.type
      if (!itType) {
        continue
      }
      const itKey = getChainKey(parentKey, i, itType)
      const itCurLevel = itKey.split(IDX).length - 1
      if (itCurLevel > level) {
        return
      }
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

  if (!nodeChain) {
    checkNode(children, key)
  }

  let cNode: any = chain.getHead()
  const arriStatus = {
    start: false,
    end: false,
  }
  while (cNode) {
    const payload = cNode.payload || {}
    const { nodePath } = payload
    const { type: nodeType, key: nodeKey } = nodePath || {}
    const func = typeHandleMap[nodeType] || noop

    if (nodeChain) {
      if (nodeKey && nodeKey.startsWith(key)) {
        arriStatus.start = true
        func(nodePath)
        cNode = cNode.next
        continue
      } else {
        // 不符合当前 node key 跳过当次或者中断循环
        if (arriStatus.start) {
          arriStatus.end = true
        }
        if (arriStatus.end) {
          break
        } else {
          cNode = cNode.next
          continue
        }
      }
    } else {
      func(nodePath)
      cNode = cNode.next
    }
  }
  return rootPath
}
