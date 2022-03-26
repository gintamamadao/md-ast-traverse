import { traverse, toAst } from '../../index'
import { md1 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  test('traverse', async () => {
    const ast: any = toAst(md1)

    cache.write(JSON.stringify(ast, undefined, 2))
    traverse(ast, {
      heading: (node, scope) => {
        cache.write(JSON.stringify(node, undefined, 2))
      },
    })
  })
})
