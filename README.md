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
