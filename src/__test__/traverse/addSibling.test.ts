import { traverse, toAst, astToStr } from '../../index'
import { md3 } from './md'

describe('traverse', () => {
  const newAst = toAst('- [总结](./总结.md)')
  let newNode
  traverse(newAst, {
    listItem: (path) => {
      newNode = path.node
    },
  })

  test('traverse: addSibling 1', async () => {
    const ast: any = toAst(md3)
    let cnt = 0
    const astPath = traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 1) {
          path.addSibling(newNode)
        }
      },
    })
    expect(astToStr(ast)).toBe(
      `*   [笔记](./笔记.md)\n*   [思考](./思考.md)\n*   [总结](./总结.md)\n`
    )
    let cnt2 = 0
    traverse(astPath, {
      listItem: (path) => {
        expect(path.index).toBe(cnt2)
        cnt2++
      },
    })
  })
})
