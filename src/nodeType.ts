export const isHeading = (node: any) => {
  return node?.type === 'heading'
}

export const isList = (node: any) => {
  return node?.type === 'list'
}

export const isListItem = (node: any) => {
  return node?.type === 'listItem'
}

export const isCode = (node: any) => {
  return node?.type === 'code'
}
