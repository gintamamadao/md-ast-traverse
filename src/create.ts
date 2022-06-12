import { NodeType } from './types'

export const textNode = (value: string) => {
  return {
    type: NodeType.text,
    value: value,
  }
}

export const paragraphNode = (children: any[]) => {
  return {
    type: NodeType.paragraph,
    children,
  }
}
