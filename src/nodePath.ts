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

  getSibling = () => {
    const cParentNode = this.getChainNode(this.parentKey)
    const cNode = cParentNode.next
    const curParentKey = this.parentKey

    const siblingIts: any[] = []

    let isSiblingStart = false
    let isSiblingEnd = false

    while (cNode) {
      const payload = cNode.payload || {}
      const { nodePath } = payload
      const { parentKey: nParentKey } = nodePath || {}

      if (nParentKey === curParentKey) {
        siblingIts.push(nodePath)
        isSiblingStart = true
      } else {
        if (isSiblingStart) {
          isSiblingEnd = true
        }
      }
      if (isSiblingEnd) {
        break
      }
    }

    return siblingIts
  }
}
