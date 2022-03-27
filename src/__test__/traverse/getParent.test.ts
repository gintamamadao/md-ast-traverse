import { traverse, toAst } from '../../index'
import { md1, md2 } from './md'

describe('traverse', () => {
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
})
