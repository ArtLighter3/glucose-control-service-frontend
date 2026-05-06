export interface Page<T> {
  content: T[],
  page: PageInfo,
}

export interface PageInfo {
  size: number,
  number: number,
  totalElements: number,
  totalPages: number
}

export interface Slice<T> {
  content: T[],
  page: SliceInfo,
}

export interface SliceInfo {
  size: number,
  number: number,
  hasNext: boolean
}
