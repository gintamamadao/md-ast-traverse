import { Chain } from 'ginlibs-chain'

export class NodePath {
  _traverseChain: Chain
  key: string
  astNode: any

  constructor(info: { chain: Chain; astNode: any; key: string }) {
    const { chain, astNode, key } = info
    this._traverseChain = chain
    this.astNode = astNode
    this.key = key
  }
}
