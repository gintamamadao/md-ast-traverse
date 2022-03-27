import { traverse, toAst } from '../../index'
import { md1 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  test('traverse', async () => {
    const ast: any = toAst(md1)
    cache.write(ast)
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
})
