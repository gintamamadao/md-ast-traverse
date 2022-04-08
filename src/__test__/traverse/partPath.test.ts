import { traverse, toAst } from '../../index'
import { md4 } from './md'
import cache from 'ginlibs-cache'

describe('traverse', () => {
  test('traverse: partPath 1', async () => {
    const ast: any = toAst(md4)
    let firstItemDone = false
    let txtCnt = 0
    let innerTxtCnt = 0
    traverse(ast, {
      listItem: (path) => {
        if (firstItemDone) {
          return
        }
        firstItemDone = true
        traverse(path, {
          text: (itPath) => {
            innerTxtCnt++
            expect(itPath.node.value).toBe('1')
          },
        })
      },
      text: (path) => {
        txtCnt++
        expect(path.node.value).toBe(`${txtCnt}`)
      },
    })

    expect(txtCnt).toBe(4)
    expect(innerTxtCnt).toBe(1)
  })
})
