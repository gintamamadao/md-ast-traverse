import { traverse, toAst, astToStr } from '../../index'
import { md3 } from './md'

describe('traverse', () => {
  test('traverse: replaceWith 1', async () => {
    const ast: any = toAst(md3)
    const newAst = toAst('- [总结](./总结.md)')
    let cnt = 0
    let newNode
    traverse(newAst, {
      listItem: (path) => {
        newNode = path.node
      },
    })
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 1) {
          path.replaceWith(newNode)
        }
      },
    })
    expect(astToStr(ast)).toBe(`*   [总结](./总结.md)\n*   [思考](./思考.md)\n`)
  })

  test('traverse: replaceWith 2', async () => {
    const ast: any = toAst(md3)
    const newAst = toAst('- [总结](./总结.md)')
    let cnt = 0
    let newNode
    traverse(newAst, {
      listItem: (path) => {
        newNode = path.node
      },
    })
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 2) {
          path.replaceWith(newNode)
        }
      },
    })
    expect(astToStr(ast)).toBe(`*   [笔记](./笔记.md)\n*   [总结](./总结.md)\n`)
  })
})