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

  getParent = () => {
    const cParentNode = this.getChain().find(this.parentKey)
    const { nodePath: pNodePath } = cParentNode.payload
    return pNodePath
  }
}
