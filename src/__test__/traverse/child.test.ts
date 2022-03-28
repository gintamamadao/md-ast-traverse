import { traverse, toAst, astToStr } from '../../index'
import { md3 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  const newAst = toAst('- [总结](./总结.md)')
  let newNode
  traverse(newAst, {
    listItem: (path) => {
      newNode = path.node
    },
  })

  test('traverse: addChild 1', async () => {
    const ast: any = toAst(md3)
    const astPath = traverse(ast, {
      list: (path) => {
        path.addChild(newNode)
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

  test('traverse: unshiftChild 1', async () => {
    const ast: any = toAst(md3)
    const astPath = traverse(ast, {
      list: (path) => {
        path.unshiftChild(newNode)
      },
    })

    expect(astToStr(ast)).toBe(
      `*   [总结](./总结.md)\n*   [笔记](./笔记.md)\n*   [思考](./思考.md)\n`
    )

    let cnt2 = 0
    traverse(astPath, {
      listItem: (path) => {
        if (cnt2 === 0) {
          expect(path.index).toBe(2)
        }
        cnt2++
      },
    })
  })
})
