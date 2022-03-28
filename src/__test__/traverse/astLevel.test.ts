import { traverse, toAst } from '../../index'
import { md10 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  test('traverse: getAstLevel 1', async () => {
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

  test('traverse: level 1', async () => {
    const ast: any = toAst(md10)
    const astPath = traverse(
      ast,
      {},
      {
        level: 1,
      }
    )
    expect(astPath.getChain().checkLength()).toBe(8)
  })

  test('traverse: level 2', async () => {
    const ast: any = toAst(md10)
    const astPath2 = traverse(
      ast,
      {},
      {
        level: 2,
      }
    )
    expect(astPath2.getChain().checkLength()).toBe(19)

    const astPath3 = traverse(
      ast,
      {},
      {
        level: 3,
      }
    )
    expect(astPath3.getChain().checkLength()).toBe(23)

    const astPath1000 = traverse(
      ast,
      {},
      {
        level: 1000,
      }
    )
    expect(astPath1000.getChain().checkLength()).toBe(29)
  })
})
