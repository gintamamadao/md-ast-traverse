import { Chain } from 'ginlibs-chain'
import { getChainKey } from './utils'
import cache from 'ginlibs-cache'

export class NodePath {
  key: string
  parentKey: string
  type: string
  node: any
  index: number

  constructor(info: {
    chain: Chain
    astNode: any
    key: string
    type: string
    parentKey?: string
    index?: number
  }) {
    const { chain, astNode, key, parentKey = '', type, index = 0 } = info
    this[Symbol.for('_traverseChain')] = chain
    this.node = astNode
    this.key = key
    this.parentKey = parentKey || ''
    this.type = type
    this.index = index
  }

  getChain = (): Chain => {
    return this[Symbol.for('_traverseChain')]
  }

  getChainNode = (key: string = this.key) => {
    return this.getChain().find(key)
  }

  getNodePath = (key: string) => {
    return this.getChainNode(key)?.payload?.nodePath
  }

  getAstNode = (key: string) => {
    return this.getNodePath(key)?.node
  }

  getChildren = (parentKey: string = this.key) => {
    const cParentNode = this.getChainNode(parentKey)

    if (!cParentNode) {
      return []
    }

    const siblingIts: any[] = []

    let isSiblingStart = false
    let isSiblingEnd = false

    let cNode = cParentNode.next
    while (cNode) {
      const payload = cNode.payload || {}
      const { nodePath } = payload
      const { parentKey: nParentKey, key = '' } = nodePath || {}

      if (nParentKey === parentKey) {
        siblingIts.push(nodePath)
        isSiblingStart = true
      } else {
        if (isSiblingStart && !key.startsWith(nParentKey)) {
          isSiblingEnd = true
        }
      }
      if (isSiblingEnd) {
        break
      }
      cNode = cNode.next
    }

    return siblingIts
  }

  setAstNodeChildren = (key: string = this.key) => {
    const astNode = this.getAstNode(key)
    const siblings = this.getChildren(key).map((it) => {
      return it.node
    })
    astNode?.children?.splice(0)
    astNode?.children?.push(...siblings)
  }

  getParent = () => {
    const cParentNode = this.getChainNode(this.parentKey)
    const { nodePath: pNodePath } = cParentNode.payload
    return pNodePath
  }

  getSiblings = () => {
    return this.getChildren(this.parentKey)
  }

  setParentAstNodeChildren = () => {
    return this.setAstNodeChildren(this.parentKey)
  }

  remove = () => {
    const cNode = this.getChainNode(this.key)
    this.getChain().remove(cNode)
    this.setParentAstNodeChildren()
  }

  replaceWith = (node: any) => {
    this.node = node
    this.setParentAstNodeChildren()
  }

  addSibling = (node: any) => {
    const siblings = this.getSiblings()
    const lastSibl = siblings[siblings.length - 1]
    const lastSiblIdx = lastSibl.index || 0
    const index = lastSiblIdx + 1
    const type = node.type
    const parentKey = this.parentKey
    const key = getChainKey(parentKey, index, type)
    const chain = this.getChain()

    const pathInfo = {
      chain,
      astNode: node,
      parentKey,
      key,
      type,
      index,
    }
    const nodePath = new NodePath(pathInfo)
    chain.insertAfter(lastSibl.key, key, {
      nodePath,
    })
    this.setParentAstNodeChildren()
  }

  addChild = (node: any) => {
    const children = this.getChildren()

    const lastChild = children[children.length - 1]
    const lastChildIdx = lastChild.index || 0
    const index = lastChildIdx + 1
    const type = node.type
    const parentKey = this.key
    const key = getChainKey(parentKey, index, type)
    const chain = this.getChain()

    const pathInfo = {
      chain,
      astNode: node,
      parentKey,
      key,
      type,
      index,
    }

    const nodePath = new NodePath(pathInfo)
    chain.insertAfter(lastChild.key, key, {
      nodePath,
    })
    this.setAstNodeChildren()
  }
}
