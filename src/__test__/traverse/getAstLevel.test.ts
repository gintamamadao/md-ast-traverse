import { traverse, toAst, astToStr } from '../../index'
import { md10 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  test('traverse: addChild 1', async () => {
    const ast: any = toAst(md10)
    traverse(ast, {
      heading: (path) => {
        expect(path.getAstLevel()).toBe(1)
      },
      listItem: (path) => {
        expect(path.getAstLevel()).toBe(2)
      },
    })
  })
})
