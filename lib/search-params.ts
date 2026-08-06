export type SearchParamValue = string | string[] | undefined

export function firstSearchParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value
}
