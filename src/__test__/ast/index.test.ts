import { toAst, astToStr } from '../../index'
import { md1 } from './md'

describe('to ast', () => {
  test('to ast', async () => {
    const ast: any = toAst(md1)
    expect(ast.children[0].children[0].type).toBe('text')
    expect(ast.children[0].children[0].value).toBe('笔记')
  })
})

describe('ast to str', () => {
  test('ast to str', async () => {
    const ast: any = toAst(md1)
    ast.children[0].children[0].value = 'noted'
    expect(astToStr(ast)).toBe(`## noted\n`)
  })
})
