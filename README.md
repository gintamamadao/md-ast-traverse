[![NPM version](https://badgen.net/npm/v/md-ast-traverse)](https://www.npmjs.com/package/md-ast-traverse)
[![NPM Weekly Downloads](https://badgen.net/npm/dw/md-ast-traverse)](https://www.npmjs.com/package/md-ast-traverse)
[![License](https://badgen.net/npm/license/md-ast-traverse)](https://www.npmjs.com/package/md-ast-traverse)

# md-ast-traverse

> 遍历 mdast-util-from-markdown 解析生成的 Markdown AST 语法树，用法类似 @babel/traverse

```ts
import { traverse } from 'md-ast-traverse'

traverse(mdAst, {
  heading: (path) => {
    // to do
  },
  listItem: (path) => {
    // to do
  },
})
```

# Test Report

> Tests are using jest, to run the tests use:

```sh
$ npm run test:cov
```

report detail

```sh
-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------|---------|----------|---------|---------|-------------------
All files              |   97.89 |    80.18 |   97.56 |   97.74 |                   
 src                   |   97.82 |    80.18 |   97.56 |   97.67 |                   
  astToStr.ts          |     100 |      100 |     100 |     100 |                   
  astUtils.ts          |     100 |      100 |     100 |     100 |                   
  index.ts             |     100 |      100 |      75 |     100 |                   
  nodePath.ts          |   96.99 |    71.42 |     100 |   96.89 | 50,67,108,120     
  toAst.ts             |     100 |      100 |     100 |     100 |                   
  traverse.ts          |   98.27 |     92.3 |     100 |   98.18 | 49                
  types.ts             |     100 |      100 |     100 |     100 |                   
  utils.ts             |     100 |      100 |     100 |     100 |                   
 src/__test__/ast      |     100 |      100 |     100 |     100 |                   
  md.ts                |     100 |      100 |     100 |     100 |                   
 src/__test__/astUtils |     100 |      100 |     100 |     100 |                   
  md.ts                |     100 |      100 |     100 |     100 |                   
 src/__test__/traverse |     100 |      100 |     100 |     100 |                   
  md.ts                |     100 |      100 |     100 |     100 |                   
-----------------------|---------|----------|---------|---------|-------------------

Test Suites: 10 passed, 10 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        4.506 s, estimated 5 s
Ran all test suites.
```

---

# License

MIT
