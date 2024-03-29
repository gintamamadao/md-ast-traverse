import { Chain } from 'ginlibs-chain'
import { isNumber } from 'ginlibs-type-check'
import { getChainKey, IDX } from './utils'
import { toAst } from './toAst'
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

    let arriSiblingStatus = 0
    let cNode = cParentNode.next
    while (cNode) {
      const payload = cNode.payload || {}
      const { nodePath } = payload
      const { parentKey: cnParentKey, key = '' } = nodePath || {}

      if (cnParentKey === parentKey) {
        arriSiblingStatus = 1
        siblingIts.push(nodePath)
      } else {
        if (arriSiblingStatus === 1 && !key.startsWith(parentKey)) {
          break
        }
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

  getAstLevel() {
    const keyLevel = this.key.split(IDX)
    return keyLevel.length - 1
  }

  getParent = () => {
    const cParentNode = this.getChainNode(this.parentKey)
    const { nodePath: pNodePath } = cParentNode.payload
    return pNodePath
  }

  getSiblings = () => {
    return this.getChildren(this.parentKey)
  }

  getChild = (index = 0) => {
    const children = this.getChildren()
    return children[index]
  }

  getPrevSibling = () => {
    const siblings = this.getSiblings()
    if (siblings.length < 2) {
      return
    }
    const curIdx = siblings.findIndex((it) => it.key === this.key)
    if (isNumber(curIdx) && curIdx >= 1) {
      return siblings[curIdx - 1]
    }
    return
  }

  getNextSibling = () => {
    const siblings = this.getSiblings()
    if (siblings.length < 2) {
      return
    }
    const curIdx = siblings.findIndex((it) => it.key === this.key)
    if (isNumber(curIdx) && curIdx < siblings.length - 1) {
      return siblings[curIdx + 1]
    }
    return
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

  replaceWithString = (string: string) => {
    const strNodeList = toAst(string)?.children || []
    strNodeList.forEach((it, idx) => {
      if (idx === 0) {
        this.replaceWith(it)
        return
      }
      this.addSibling(it)
    })
  }

  getNewSiblingPathInfo = (node: any) => {
    const siblings = this.getSiblings()
    const siblIdxs = siblings.map((it) => it.index || 0)
    const maxSiblIdx = siblIdxs.length > 0 ? Math.max(...siblIdxs) : 0
    const index = maxSiblIdx + 1
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
    return {
      newKey: key,
      siblings,
      nodePath,
    }
  }

  getNewChildPathInfo = (node: any) => {
    const children = this.getChildren()
    const childIdxs = children.map((it) => it.index || 0)
    const maxChildIdx = childIdxs.length > 0 ? Math.max(...childIdxs) : 0
    const index = maxChildIdx + 1
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

    return {
      newKey: key,
      children,
      nodePath,
    }
  }

  addSibling = (node: any) => {
    const chain = this.getChain()
    const { siblings, nodePath, newKey } = this.getNewSiblingPathInfo(node)
    const lastSibl = siblings[siblings.length - 1]
    chain.insertAfter(lastSibl.key, newKey, {
      nodePath,
    })
    this.setParentAstNodeChildren()
  }

  unshiftSibling = (node: any) => {
    const chain = this.getChain()
    const { nodePath, newKey } = this.getNewSiblingPathInfo(node)
    chain.insertAfter(this.parentKey, newKey, {
      nodePath,
    })
    this.setParentAstNodeChildren()
  }

  insertSiblingAfter = (node: any, coorPath: NodePath) => {
    const chain = this.getChain()
    const { nodePath, newKey } = this.getNewSiblingPathInfo(node)
    chain.insertAfter(coorPath.key, newKey, {
      nodePath,
    })
    this.setParentAstNodeChildren()
  }

  addChild = (node: any) => {
    const chain = this.getChain()
    const { children, nodePath, newKey } = this.getNewChildPathInfo(node)
    const lastChild = children[children.length - 1]
    chain.insertAfter(lastChild.key, newKey, {
      nodePath,
    })
    this.setAstNodeChildren()
  }

  unshiftChild = (node: any) => {
    const chain = this.getChain()
    const { nodePath, newKey } = this.getNewChildPathInfo(node)
    chain.insertAfter(this.key, newKey, {
      nodePath,
    })
    this.setAstNodeChildren()
  }
}
