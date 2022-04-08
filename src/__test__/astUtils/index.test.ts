import {
  traverse,
  toAst,
  astToStr,
  replaceWithNodeByStr,
  addSiblingNodeByStr,
} from '../../index'
import { md1 } from './md'

describe('astUtils', () => {
  test('astUtils: addSiblingNodeByStr 1', async () => {
    const ast: any = toAst(md1)
    let tPath: any
    traverse(ast, {
      listItem: (path) => {
        tPath = path
      },
    })
    addSiblingNodeByStr('- 2', 'listItem', tPath)
    expect(astToStr(ast)).toBe(`*   1\n*   2\n`)
  })
  test('astUtils: addSiblingNodeByStr 2', async () => {
    const ast: any = toAst(md1)
    let tPath: any
    traverse(ast, {
      listItem: (path) => {
        tPath = path
      },
    })
    addSiblingNodeByStr('# 2', 'listItem', tPath)
    expect(astToStr(ast)).toBe(`*   1\n`)
  })
  test('astUtils: replaceWithNodeByStr 1', async () => {
    const ast: any = toAst(md1)
    let tPath: any
    traverse(ast, {
      listItem: (path) => {
        tPath = path
      },
    })
    replaceWithNodeByStr('- 2', 'listItem', tPath)
    expect(astToStr(ast)).toBe(`*   2\n`)
  })
  test('astUtils: replaceWithNodeByStr 2', async () => {
    const ast: any = toAst(md1)
    let tPath: any
    traverse(ast, {
      listItem: (path) => {
        tPath = path
      },
    })
    replaceWithNodeByStr('# 2', 'listItem', tPath)
    expect(astToStr(ast)).toBe(`*   1\n`)
  })
})
