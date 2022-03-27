import { Chain } from 'ginlibs-chain'

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

  getParent = () => {
    const cParentNode = this.getChainNode(this.parentKey)
    const { nodePath: pNodePath } = cParentNode.payload
    return pNodePath
  }

  getSiblings = () => {
    const cParentNode = this.getChainNode(this.parentKey)
    if (!cParentNode) {
      return []
    }
    const curParentKey = this.parentKey

    const siblingIts: any[] = []

    let isSiblingStart = false
    let isSiblingEnd = false

    let cNode = cParentNode.next
    while (cNode) {
      const payload = cNode.payload || {}
      const { nodePath } = payload
      const { parentKey: nParentKey, key = '' } = nodePath || {}

      if (nParentKey === curParentKey) {
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

  setParentAstNodeChildren = () => {
    const cParentNode = this.getChainNode(this.parentKey)
    const { nodePath: parentPath } = cParentNode.payload
    const { node: parentAstNode } = parentPath
    const siblings = this.getSiblings().map((it) => {
      return it.node
    })
    parentAstNode.children.splice(0)
    parentAstNode.children.push(...siblings)
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
}
