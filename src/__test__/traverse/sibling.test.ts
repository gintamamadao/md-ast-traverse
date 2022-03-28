import { traverse, toAst, astToStr } from '../../index'
import { md3, md4 } from './md'
import cache from 'ginlibs-cache'

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

  test('traverse: unshiftSibling 1', async () => {
    const ast: any = toAst(md3)
    let cnt = 0
    const astPath = traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 1) {
          path.unshiftSibling(newNode)
        }
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

  test('traverse: insertSiblingAfter 1', async () => {
    const ast: any = toAst(md3)
    let cnt = 0
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 1) {
          path.insertSiblingAfter(newNode, path)
        }
      },
    })
    expect(astToStr(ast)).toBe(
      `*   [笔记](./笔记.md)\n*   [总结](./总结.md)\n*   [思考](./思考.md)\n`
    )
  })

  test('traverse: insertSiblingAfter 2', async () => {
    const ast: any = toAst(md3)
    let cnt = 0
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 2) {
          path.insertSiblingAfter(newNode, path)
        }
      },
    })
    expect(astToStr(ast)).toBe(
      `*   [笔记](./笔记.md)\n*   [思考](./思考.md)\n*   [总结](./总结.md)\n`
    )
  })

  test('traverse: getPrevSibling 1', async () => {
    const ast: any = toAst(md4)
    let cnt = 0
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 1) {
          expect(path.getPrevSibling()).toBe(undefined)
        }
        if (cnt === 2) {
          traverse(path.getPrevSibling(), {
            text: (itPath) => {
              expect(itPath.node.value).toBe('1')
            },
          })
        }
        if (cnt === 3) {
          traverse(path.getPrevSibling(), {
            text: (itPath) => {
              expect(itPath.node.value).toBe('2')
            },
          })
        }
      },
    })
  })

  test('traverse: getNextSibling 1', async () => {
    const ast: any = toAst(md4)
    let cnt = 0
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 1) {
          traverse(path.getNextSibling(), {
            text: (itPath) => {
              expect(itPath.node.value).toBe('2')
            },
          })
        }
        if (cnt === 4) {
          expect(path.getNextSibling()).toBe(undefined)
        }
      },
    })
  })
})
