import { traverse, toAst, astToStr, getTypeNodeByStr } from '../../index'
import { md3, md4 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  const newNode = getTypeNodeByStr('- [总结](./总结.md)', 'listItem')

  test('traverse: getChild 1', async () => {
    const ast: any = toAst(md4)
    traverse(ast, {
      list: (path) => {
        traverse(path.getChild(0), {
          text: (itPath) => {
            expect(itPath.node.value).toBe('1')
          },
        })
        traverse(path.getChild(1), {
          text: (itPath) => {
            expect(itPath.node.value).toBe('2')
          },
        })
      },
    })
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
