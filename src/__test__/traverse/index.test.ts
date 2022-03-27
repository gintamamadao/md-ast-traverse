import { traverse, toAst, astToStr } from '../../index'
import { md1, md2, md3 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  test('traverse: node type', async () => {
    const ast: any = toAst(md1)
    let cnt = 0
    traverse(ast, {
      heading: (path) => {
        const node = path.node
        cnt++
        expect(node.type).toBe('heading')
        if (cnt === 1) {
          expect(node.children[0].value).toBe('笔记')
        } else if (cnt === 2) {
          expect(node.children[0].value).toBe('思考')
        }
      },
      text: (path) => {
        const node = path.node
        expect(node.type).toBe('text')
        if (cnt === 1) {
          expect(node.value).toBe('笔记')
        } else if (cnt === 2) {
          expect(node.value).toBe('思考')
        }
      },
    })
    expect(cnt).toBe(2)
  })

  test('traverse: node getParent 1', async () => {
    const ast: any = toAst(md1)
    traverse(ast, {
      text: (path) => {
        const pNodePath = path.getParent()
        expect(pNodePath.node.type).toBe('heading')
      },
    })
  })

  test('traverse: node getParent 2', async () => {
    const ast: any = toAst(md2)
    traverse(ast, {
      text: (path) => {
        expect(path.getParent().node.type).toBe('link')
        expect(path.getParent().getParent().node.type).toBe('paragraph')
        expect(path.getParent().getParent().getParent().node.type).toBe(
          'listItem'
        )
        expect(
          path.getParent().getParent().getParent().getParent().node.type
        ).toBe('list')
        expect(
          path.getParent().getParent().getParent().getParent().getParent().node
            .type
        ).toBe('root')
      },
    })
  })

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
    // cache.write(ast)
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
    // cache.write(ast)
  })
})
