import { traverse, toAst, astToStr } from '../../index'
import { md3 } from './md'

describe('traverse', () => {
  test('traverse: remove 1', async () => {
    const ast: any = toAst(md3)
    let cnt = 0
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 1) {
          path.remove()
        }
      },
    })
    expect(astToStr(ast)).toBe(`*   [思考](./思考.md)\n`)
  })

  test('traverse: remove 2', async () => {
    const ast: any = toAst(md3)
    let cnt = 0
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 2) {
          path.remove()
        }
      },
    })
    expect(astToStr(ast)).toBe(`*   [笔记](./笔记.md)\n`)
  })
})
