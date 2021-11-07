export enum NodeType {
  root = 'root',
  paragraph = 'paragraph',
  heading = 'heading',
  thematicBreak = 'thematicBreak',
  blockquote = 'blockquote',
  list = 'list',
  listItem = 'listItem',
  table = 'table',
  tableRow = 'tableRow',
  tableCell = 'tableCell',
  html = 'html',
  code = 'code',
  yaml = 'yaml',
  definition = 'definition',
  footnoteDefinition = 'footnoteDefinition',
  text = 'text',
  emphasis = 'emphasis',
  strong = 'strong',
  delete = 'delete',
  inlineCode = 'inlineCode',
  break = 'break',
  link = 'link',
  image = 'image',
  linkReference = 'linkReference',
  imageReference = 'imageReference',
  footnote = 'footnote',
  footnoteReference = 'footnoteReference',
}

export type Options = {
  [p in NodeType]: (node: any) => void
}

export const traverse = (node: any, opts: Options) => {
  return ''
}
