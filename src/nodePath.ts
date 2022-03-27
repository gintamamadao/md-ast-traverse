import { Chain } from 'ginlibs-chain'

export class NodePath {
  key: string
  type: string
  node: any

  constructor(info: { chain: Chain; astNode: any; key: string; type }) {
    const { chain, astNode, key, type } = info
    this[Symbol.for('_traverseChain')] = chain
    this.node = astNode
    this.key = key
    this.type = type
  }

  getChain = () => {
    return this[Symbol.for('_traverseChain')]
  }
}
