import { traverse, toAst, astToStr, getTypeNodeByStr } from '../../index'
import { md3 } from './md'

import cache from 'ginlibs-cache'

describe('traverse', () => {
  const newNode = getTypeNodeByStr('- [总结](./总结.md)', 'listItem')

  test('traverse: replaceWith 1', async () => {
    const ast: any = toAst(md3)
    let cnt = 0
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 1) {
          path.replaceWith(newNode)
        }
      },
    })
    expect(astToStr(ast)).toBe(`*   [总结](./总结.md)\n*   [思考](./思考.md)\n`)
  })

  test('traverse: replaceWith 2', async () => {
    const ast: any = toAst(md3)
    let cnt = 0
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 2) {
          path.replaceWith(newNode)
        }
      },
    })
    expect(astToStr(ast)).toBe(`*   [笔记](./笔记.md)\n*   [总结](./总结.md)\n`)
  })

  test('traverse: replaceWithString 1', async () => {
    const ast: any = toAst(md3)
    let cnt = 0
    traverse(ast, {
      listItem: (path) => {
        cnt++
        if (cnt === 2) {
          path.replaceWithString('## a\n- b')
        }
      },
    })
    cache.write(astToStr(ast))
    expect(astToStr(ast)).toBe(`*   [笔记](./笔记.md)\n## a\n*   b\n`)
  })
})
