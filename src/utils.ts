export const IDX = '__i__'
export const TYPE = '__t__'

export const getChainKey = (parentKey: string, idx: number, type: string) => {
  return `${parentKey}${IDX}${idx}${TYPE}${type}`
}
