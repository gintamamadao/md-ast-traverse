import { NType } from './types'
import { toAst } from './toAst'
import { traverse } from './traverse'
import { NodePath } from './nodePath'

export const getTypeNodeByAst = (ast: any, type: NType) => {
  let node: any
  traverse(ast, {
    [type]: (path) => {
      node = path.node
    },
  })
  return node
}

export const getTypeNodeByStr = (str: string, type: NType) => {
  const mdAst = toAst(str)
  return getTypeNodeByAst(mdAst, type)
}

export const addSiblingNodeByStr = (
  str: string,
  type: NType,
  path: NodePath
) => {
  const node = getTypeNodeByStr(str, type)
  node && path.addSibling(node)
}

export const replaceWithNodeByStr = (
  str: string,
  type: NType,
  path: NodePath
) => {
  const node = getTypeNodeByStr(str, type)
  node && path.replaceWith(node)
}
