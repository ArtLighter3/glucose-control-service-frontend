export interface Page<T> {
  content: T,
  last: boolean,
  first: boolean,
  number: number,
  numberOfElements: number,
  size: number,
  totalElements?: number,
  totalPages?: number
}
