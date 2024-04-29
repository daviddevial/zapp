export type Product = {
  id: string
  name: string,
  imageUrl: string,
}

export enum IssueType {
  MISSING_ITEM = 'MISSING_ITEM',
  DAMAGE = 'DAMAGE',
  OTHER = 'OTHER'
}

export type CreateIssue = {
  type: IssueType,
  comment: string,
  productId: string
}

export type DBIssue = CreateIssue & {
  id: string
}

export type Issue = {
  id: string
  type: IssueType,
  comment: string,
  product: Product
}