export class Scope {
  node: any
  parent: any
  parentScope: Scope
  childrenScope: Scope[] = []
  curList: any[]
  children: any[]
  nodeMap: any
  level: number
  index: number
  deleted = false
  constructor(data: any) {
    this.node = data.node
    this.parent = data.parent
    this.curList = data.curList || []
    this.children = data.children
    this.level = data.level
    this.index = data.index || 0
    this.nodeMap = data.nodeMap
    this.parentScope = data.parentScope || {}

    data.parentScope?.setChildrenScope?.(this)
  }

  getIndex() {
    const { curList, node, index } = this
    if (curList[index] === node) {
      return index
    }
    const newIndex = curList.findIndex((it) => {
      return it === node
    })
    if (newIndex >= 0) {
      this.index = newIndex
    } else {
      console.log('can not find index')
    }
    return this.index
  }

  getParent() {
    return this.parent
  }

  getChildren() {
    return this.children
  }

  getChild(index: number) {
    return this.children[index]
  }

  getCurList() {
    return this.curList
  }

  delete() {
    if (this.deleted) {
      return
    }
    const index = this.getIndex()
    this.curList.splice(index, 1)
    this.deleted = true
  }

  addBrotherNode(node: any, index?: number) {
    if (index === undefined) {
      this.curList.push(node)
      return
    }
    this.curList.splice(index, 0, node)
  }

  addChildNode(node: any, index?: number) {
    if (index === undefined) {
      this.children.push(node)
      return
    }
    this.children.splice(index, 0, node)
  }

  setChildrenScope(scope: Scope) {
    this.childrenScope.push(scope)
  }

  findScope(node: any) {
    for (const type of Object.keys(this.nodeMap)) {
      const nodeList = this.nodeMap[type] || []
      const scope = nodeList.find((it) => {
        return it.node === node
      })
      if (scope) {
        return scope
      }
    }
  }

  getbrotherNode(offset = 1) {
    const index = this.getIndex()
    let bIndex = index + offset
    while (bIndex > this.curList.length - 1) {
      bIndex = bIndex - this.curList.length - 1
    }
    const brotherNode = this.curList[bIndex]
    return brotherNode
  }
}
