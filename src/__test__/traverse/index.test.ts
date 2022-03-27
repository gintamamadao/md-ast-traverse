import { traverse, toAst } from '../../index'
import { md1 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  test('traverse', async () => {
    const ast: any = toAst(md1)
    cache.write(ast)
    traverse(ast, {
      heading: (path) => {
        const node = path.node

        expect(node.type).toBe('heading')
        expect(node.children[0].value).toBe('笔记')
      },
    })
  })
})
