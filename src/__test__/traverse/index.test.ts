import { traverse, toAst } from '../../index'
import { md1 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  test('traverse', async () => {
    const ast: any = toAst(md1)
    cache.write(ast)
    const node = traverse(ast, {
      heading: (node, scope) => {},
    })
    cache.write(node, 'node')
  })
})
