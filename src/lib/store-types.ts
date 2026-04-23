/** Normalized product for UI (catalog API maps into this). */
export interface ProductCategoryPath {
  id: string
  name: string
}

export interface StoreProduct {
  sku: number
  name: string
  salePrice?: number
  regularPrice?: number
  image?: string
  largeFront?: string
  customerReviewAverage?: number
  customerReviewCount?: number
  longDescription?: string
  description?: string
  manufacturer?: string
  categoryPath?: ProductCategoryPath[]
}

export interface StoreListResponse {
  from: number
  to: number
  total: number
  currentPage: number
  totalPages: number
  products: StoreProduct[]
}

/** @deprecated use StoreProduct */
export type BestBuyProduct = StoreProduct
/** @deprecated use StoreListResponse */
export type BestBuyProductsResponse = StoreListResponse
